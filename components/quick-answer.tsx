"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { isRedFlag } from "../lib/redflag";
import type { AnalysisResult } from "../types/analysis";

const MIN_CHARS = 10;

const CHIPS = [
  {
    label: "Sulit tidur",
    text: "Akhir-akhir ini saya sulit tidur dan sering terbangun tengah malam",
  },
  {
    label: "Gampang capek",
    text: "Akhir-akhir ini saya gampang capek dan susah fokus, padahal tidur cukup",
  },
  {
    label: "Pusing",
    text: "Kepala saya sering pusing, terutama di siang hari",
  },
  {
    label: "Perut tidak nyaman",
    text: "Perut saya terasa tidak nyaman setelah makan",
  },
];

const RED_FLAG_MESSAGE =
  "Kata yang kamu tulis bisa menandakan kondisi yang butuh penanganan cepat. Jangan ditunda.";
const RED_FLAG_EMERGENCY = "Segera hubungi 112 atau fasilitas kesehatan terdekat.";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-cream/70"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function QuickAnswerCard() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<AnalysisResult | null>(null);
  const [redFlag, setRedFlag] = useState<{ message: string; emergency: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [asked, setAsked] = useState("");

  const trimmed = input.trim();

  async function submit() {
    const text = trimmed;
    if (text.length < MIN_CHARS) {
      setError("Tulis minimal 10 karakter.");
      return;
    }
    setError(null);
    setAnswer(null);
    setRedFlag(null);

    if (isRedFlag(text)) {
      setRedFlag({ message: RED_FLAG_MESSAGE, emergency: RED_FLAG_EMERGENCY });
      setAsked(text);
      return;
    }

    setLoading(true);
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
      };
      if (!data.ok || !data.result) {
        setError(data.error ?? "Analisis gagal. Coba lagi.");
        return;
      }
      if (data.result.redFlag) {
        setRedFlag({
          message: data.result.redFlag.message,
          emergency: data.result.redFlag.emergency,
        });
      } else {
        setAnswer(data.result);
      }
      setAsked(text);
    } catch {
      setError("Terjadi kendala saat menghubungi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30 p-5 text-left shadow-xl backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2 text-cream/60">
        <span className="h-2 w-2 animate-pulse rounded-full bg-terracotta" />
        <span className="text-xs font-medium tracking-wide uppercase">
          Jawaban cepat
        </span>
        <Sparkles className="ml-1 h-3.5 w-3.5 text-terracotta/70" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            maxLength={500}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) submit();
            }}
            placeholder="Akhir-akhir ini gampang capek…"
            className="w-full rounded-md border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-cream placeholder:text-cream/50 focus:border-terracotta focus:outline-none"
            aria-label="Keluhan singkat"
          />
          <button
            type="button"
            onClick={submit}
            disabled={loading || trimmed.length === 0}
            className="shrink-0 rounded-md bg-terracotta px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tanya
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                setInput(chip.text);
                setError(null);
              }}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-cream/70 transition-colors hover:border-terracotta hover:text-[#e8a26a]"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-cream/70">
          <TypingDots />
          <span>Mengerjakan…</span>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-200">
          <span>{error}</span>
          <button
            type="button"
            onClick={submit}
            className="shrink-0 rounded-md border border-red-400/40 px-3 py-1 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/20"
          >
            Coba Lagi
          </button>
        </div>
      ) : null}

      {redFlag ? (
        <div className="mt-4 flex flex-col gap-1.5 rounded-md border border-red-400/30 bg-red-500/10 p-3.5 text-red-200">
          <p className="text-sm font-medium">Segera cari bantuan medis</p>
          <p className="text-xs">{redFlag.message}</p>
          <p className="text-xs font-medium">{redFlag.emergency}</p>
        </div>
      ) : null}

      {answer ? (
        <div className="mt-4 flex flex-col gap-3">
          <p className="line-clamp-3 text-sm leading-relaxed text-cream/85">
            {answer.summary}
          </p>
          {answer.prioritizedActions.slice(0, 3).map((action) => (
            <div key={action.action} className="flex items-start gap-2">
              <span className="mt-0.5 text-terracotta">&#10003;</span>
              <div className="min-w-0">
                <p className="truncate text-xs text-cream/75">{action.action}</p>
                <p className="truncate text-[11px] text-cream/45">{action.reason}</p>
              </div>
            </div>
          ))}
          <p className="text-[10px] leading-relaxed text-cream/45">
            {answer.disclaimer}
          </p>
        </div>
      ) : null}

      {asked && !loading ? (
        <div className="mt-4 border-t border-white/10 pt-3">
          <Link
            href={`/analyze?q=${encodeURIComponent(asked)}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-terracotta transition-colors hover:underline"
          >
            Analisis lengkap
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}