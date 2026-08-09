"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { History, Sparkles } from "lucide-react";
import { isRedFlag } from "../lib/redflag";
import { buildSevenDayPlan } from "../lib/plan";
import { recommendPersona } from "../lib/partner";
import type { AnalysisResult } from "../types/analysis";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ResultsView } from "./results-view";
import { PlanSection } from "./plan-section";

const CHIPS = [
  { label: "Sulit tidur", text: "Akhir-akhir ini saya sulit tidur dan sering terbangun tengah malam" },
  { label: "Gampang capek", text: "Akhir-akhir ini saya gampang capek dan susah fokus, padahal tidur cukup" },
  { label: "Kepala pusing", text: "Kepala saya sering pusing, terutama di siang hari" },
  { label: "Perut tidak nyaman", text: "Perut saya terasa tidak nyaman setelah makan" },
];

const STAGES = [
  "Menghubungkan gejala dengan pola hidup…",
  "Menganalisis faktor risiko…",
  "Menyusun rekomendasi…",
];

const HISTORY_KEY = "zense_history";
const MAX_HISTORY = 5;
const MIN_CHARS = 10;
const MAX_CHARS = 500;
const QUICK_RESULT_KEY = "zense_quick_result";
const QUICK_RESULT_TTL_MS = 15 * 60 * 1000;

function restoreQuickResult(q: string): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(QUICK_RESULT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      input?: string;
      result?: AnalysisResult;
      at?: number;
    };
    if (parsed.input !== q) return null;
    if (!parsed.result || typeof parsed.at !== "number") return null;
    if (Date.now() - parsed.at > QUICK_RESULT_TTL_MS) return null;
    return parsed.result;
  } catch {
    return null;
  }
}

interface HistoryEntry {
  input: string;
  result: AnalysisResult;
  timestamp: number;
}

function buildRedFlagResult(): AnalysisResult {
  return {
    summary: "",
    factors: [],
    prioritizedActions: [],
    disclaimer:
      "Ini bukan diagnosis medis — jika keluhan berlanjut atau memburuk, segera konsultasikan dengan tenaga kesehatan.",
    redFlag: {
      message:
        "Kata yang kamu tulis bisa menandakan kondisi yang butuh penanganan cepat. Jangan ditunda.",
      emergency: "Segera hubungi 112 atau fasilitas kesehatan terdekat.",
    },
  };
}

export function AnalyzeSection({ initialText }: { initialText?: string }) {
  const [input, setInput] = useState(initialText ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fellBack, setFellBack] = useState(false);
  const [stage, setStage] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const trimmed = input.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_CHARS;

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [loading]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    const value = q ?? initialText ?? "";
    if (!value) return;
    const id = window.setTimeout(() => {
      const restored = restoreQuickResult(value);
      setInput(value);
      if (restored) {
        setResult(restored);
        setFellBack(false);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [initialText]);

  function saveHistory(entry: HistoryEntry) {
    const next = [entry, ...history.filter((h) => h.input !== entry.input)].slice(0, MAX_HISTORY);
    setHistory(next);
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* storage not available — ignore */
    }
  }

  function scrollToResults() {
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  async function handleSubmit(preset?: string) {
    const text = (preset ?? input).trim();
    setError(null);

    if (text.length < MIN_CHARS) {
      setInput(text);
      setError(`Tulis minimal ${MIN_CHARS} karakter untuk analisis.`);
      return;
    }

    if (isRedFlag(text)) {
      const r = buildRedFlagResult();
      setResult(r);
      setFellBack(false);
      setLoading(false);
      saveHistory({ input: text, result: r, timestamp: Date.now() });
      scrollToResults();
      return;
    }

    setLoading(true);
    setStage(0);
    setResult(null);
    setFellBack(false);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        result?: AnalysisResult;
        error?: string;
        fellBack?: boolean;
      };
      if (!data.ok || !data.result) {
        setError(data.error ?? "Analisis gagal. Coba lagi dalam beberapa saat.");
        return;
      }
      setFellBack(data.fellBack === true);
      setResult(data.result);
      saveHistory({ input: text, result: data.result, timestamp: Date.now() });
    } catch (err) {
      console.error("Analyze failed", err);
      setError(
        "Terjadi kendala saat menghubungi server. Coba lagi dalam beberapa saat.",
      );
    } finally {
      setLoading(false);
    }
    scrollToResults();
  }

  function loadHistory(entry: HistoryEntry) {
    setInput(entry.input);
    setResult(entry.result);
    setError(null);
    scrollToResults();
  }

  return (
    <section id="analyze" className="border-b border-hairline bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-col gap-10"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } } }}
            className="text-center"
          >
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              Apa yang kamu rasakan?
            </h2>
            <p className="mt-3 text-muted">
              Jelaskan dengan bahasa sehari-hari — tidak perlu istilah medis.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            <Textarea
              value={input}
              maxLength={MAX_CHARS}
              placeholder="Akhir-akhir ini gampang capek dan susah fokus, padahal tidur cukup…"
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              className="min-h-36"
              aria-label="Gejala kamu"
            />
            <div className="flex flex-wrap items-center gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setInput(chip.text)}
                  className="rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  {chip.label}
                </button>
              ))}
              <span className="ml-auto text-xs tabular-nums text-muted">
                {trimmed.length}/{MAX_CHARS}
              </span>
            </div>

            {tooShort ? (
              <p className="text-sm text-danger">
                Tulis minimal {MIN_CHARS} karakter agar analisis lebih akurat.
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                onClick={() => handleSubmit()}
                disabled={loading || trimmed.length === 0}
                className="w-full rounded-md px-6 py-3 text-base sm:w-auto"
              >
                {loading ? "Menganalisis…" : "Analisis Gejalaku"}
              </Button>
              {error ? (
                <div className="flex flex-col gap-2 rounded-md border border-danger bg-danger/5 p-4 text-sm text-danger">
                  <span>{error}</span>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit()}
                    className="self-start rounded-md border-danger/40 px-4 py-1.5 text-danger"
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : null}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3" role="status">
              <p className="flex items-center gap-2 text-sm text-terracotta">
                <Sparkles className="h-4 w-4" />
                {STAGES[stage]}
              </p>
              <ResultsView result={null} loading />
            </div>
          ) : null}

          <div ref={resultsRef} className="scroll-mt-28">
            {!loading && result ? (
              <div className="flex flex-col gap-6">
                {fellBack ? (
                  <p className="text-xs text-muted">
                    Analisis ini dihasilkan mode fallback karena model AI tidak
                    tersedia saat ini.
                  </p>
                ) : null}
                <ResultsView result={result} loading={false} />
                {!result.redFlag && result.prioritizedActions.length > 0 ? (
                  <PlanSection
                    plan={buildSevenDayPlan(result.prioritizedActions)}
                    actions={result.prioritizedActions}
                  />
                ) : null}
                {!result.redFlag ? <PersonaSuggestion result={result} /> : null}
                {history.length > 0 ? <HistoryRow history={history} onPick={loadHistory} /> : null}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PersonaSuggestion({ result }: { result: AnalysisResult }) {
  const persona = recommendPersona(
    result.factors.map((f) => ({ id: f.id, impact: f.impact })),
  );
  return (
    <div className="card-surface flex flex-col items-start gap-3 rounded-md p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-ink">
          Lanjut bareng {persona.name} — {persona.tagline}
        </p>
        <p className="text-sm text-muted">
          Mulai obrolan singkat dan pertahankan semangatmu.
        </p>
      </div>
      <Link
        href="/partner"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-terracotta px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-terracotta-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        Ngobrol dengan {persona.name}
      </Link>
    </div>
  );
}

function HistoryRow({
  history,
  onPick,
}: {
  history: HistoryEntry[];
  onPick: (entry: HistoryEntry) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <History className="h-3.5 w-3.5" />
        Analisis sebelumnya
      </p>
      <div className="flex flex-wrap gap-2">
        {history.slice(0, 3).map((entry) => (
          <button
            key={entry.timestamp}
            type="button"
            onClick={() => onPick(entry)}
            className="max-w-full truncate rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-terracotta hover:text-terracotta"
            title={entry.input}
          >
            {entry.input}
          </button>
        ))}
      </div>
    </div>
  );
}