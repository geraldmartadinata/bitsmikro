"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Check, Send } from "lucide-react";
import {
  loadGroupCheckin,
  loadPartnerState,
  PERSONAS,
  personaGreeting,
  replyFor,
  saveGroupCheckin,
  savePartnerState,
  type PartnerState,
  type Persona,
} from "../lib/partner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const itemVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
} satisfies Variants;

const COLOR_CIRCLE: Record<string, string> = {
  sage: "bg-sage/10 text-sage",
  terracotta: "bg-terracotta/10 text-terracotta",
  amber: "bg-amber-100 text-amber-800",
  ink: "bg-ink/10 text-ink",
};

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function sameDay(a: number, b: number): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function PartnerSection() {
  const [state, setState] = useState<PartnerState>({
    personaId: null,
    chat: [],
    streak: 0,
  });
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [groupCount, setGroupCount] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const persona = PERSONAS.find((p) => p.id === state.personaId) ?? null;

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadPartnerState());
      setGroupCount(loadGroupCheckin());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePartnerState(state);
  }, [state, hydrated]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [state.chat.length, typing]);

  function pickPersona(id: string) {
    const existing = state.chat;
    const chat =
      existing.length > 0
        ? existing
        : [{ from: "persona" as const, text: personaGreeting(id), at: Date.now() }];
    setState({ personaId: id, chat, streak: 0 });
    setEnded(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || typing || !persona) return;
    const now = Date.now();
    const lastUser = [...state.chat].reverse().find((m) => m.from === "user");
    const streak = lastUser && sameDay(lastUser.at, now) ? state.streak : state.streak + 1;

    setState((s) => ({
      ...s,
      chat: [...s.chat, { from: "user", text, at: now }],
      streak,
    }));
    setInput("");

    setTyping(true);
    const reply = replyFor(text, persona.id);
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    setTyping(false);
    setState((s) => ({
      ...s,
      chat: [...s.chat, { from: "persona", text: reply.text, at: Date.now() }],
    }));
    if (!reply.continuing) setEnded(true);
  }

  function changePartner() {
    setState({ personaId: null, chat: [], streak: 0 });
    setEnded(false);
  }

  function restartChat() {
    setState((s) => ({ ...s, chat: [] }));
    setEnded(false);
  }

  function toggleCheckin() {
    setGroupCount((prev) => {
      const mine = prev > 0;
      const next = mine ? Math.max(0, prev - 1) : Math.min(4, prev + 1);
      saveGroupCheckin(next);
      return next;
    });
  }

  return (
    <motion.section
      className="mx-auto max-w-3xl px-5 py-20 sm:px-6 sm:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={itemVariant} className="mb-8 text-center">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Tidak sendirian lagi
        </h1>
        <p className="mt-3 text-muted">
          Dapatkan pendamping yang punya fokus sama — saling jaga, saling
          semangat.
        </p>
      </motion.div>

      {!persona ? (
        <PickPersona onPick={pickPersona} />
      ) : (
        <>
          <Chat
            persona={persona}
            state={state}
            input={input}
            setInput={setInput}
            typing={typing}
            ended={ended}
            send={send}
            onRestart={restartChat}
            onChangePartner={changePartner}
            chatRef={chatRef}
          />
          <GroupCard count={groupCount} onToggle={toggleCheckin} />
        </>
      )}
    </motion.section>
  );
}

function PickPersona({ onPick }: { onPick: (id: string) => void }) {
  return (
    <motion.div variants={itemVariant} className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="font-display text-2xl sm:text-3xl">Pilih pendamping</h2>
        <p className="mt-1 text-sm text-muted">
          Semua pendamping Zense adalah teman AI yang tersimpan di perangkatmu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PERSONAS.map((p) => (
          <div
            key={p.id}
            className="card-surface flex flex-col items-center gap-3 rounded-md p-6 text-center"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${COLOR_CIRCLE[p.color] ?? COLOR_CIRCLE.ink}`}
            >
              {p.emoji}
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-display text-xl text-ink">{p.name}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {p.focus}
              </span>
              <p className="mt-1 text-sm leading-relaxed text-muted">{p.tagline}</p>
            </div>
            <Button onClick={() => onPick(p.id)} className="w-full rounded-md">
              Pilih {p.name}
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Chat({
  persona,
  state,
  input,
  setInput,
  typing,
  ended,
  send,
  onRestart,
  onChangePartner,
  chatRef,
}: {
  persona: Persona;
  state: PartnerState;
  input: string;
  setInput: (v: string) => void;
  typing: boolean;
  ended: boolean;
  send: () => void;
  onRestart: () => void;
  onChangePartner: () => void;
  chatRef: React.RefObject<HTMLDivElement | null>;
}) {
  const messages = state.chat.length > 0 ? state.chat : [];

  return (
    <motion.div variants={itemVariant} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${COLOR_CIRCLE[persona.color] ?? COLOR_CIRCLE.ink}`}
          >
            {persona.emoji}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-ink">{persona.name}</span>
            <span className="text-xs text-muted">{persona.focus}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium text-sage">
          🔥 streak {state.streak}
        </span>
      </div>

      <div
        ref={chatRef}
        className="flex h-80 flex-col gap-3 overflow-y-auto rounded-xl border border-hairline bg-surface p-4"
      >
        {messages.length === 0 ? (
          <p className="m-auto text-sm text-muted">
            Mulai percakapan dengan {persona.name}.
          </p>
        ) : null}
        {messages.map((m, i) => (
          <div
            key={`${m.at}-${i}`}
            className={`max-w-[78%] rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
              m.from === "user"
                ? "self-end rounded-br-sm bg-terracotta text-white"
                : "self-start rounded-bl-sm border border-hairline bg-surface text-ink"
            }`}
          >
            {m.text}
          </div>
        ))}
        {typing ? (
          <div className="self-start rounded-xl rounded-bl-sm border border-hairline bg-surface px-3.5 py-2.5">
            <TypingDots />
          </div>
        ) : null}
      </div>

      {ended ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-hairline bg-[#faf8f1] p-4 text-center">
          <p className="text-sm text-muted">
            Percakapan dengan {persona.name} selesai untuk hari ini.
          </p>
          <Button variant="outline" onClick={onRestart} className="rounded-full px-4 py-1.5 text-sm">
            Mulai ulang
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            value={input}
            maxLength={300}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !typing) send();
            }}
            placeholder={`Tulis ke ${persona.name}…`}
            className="rounded-full"
            aria-label="Pesan ke pendamping"
          />
          <button
            type="button"
            onClick={send}
            disabled={typing || input.trim().length === 0}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-white transition-colors hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Kirim pesan"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onChangePartner}
        className="self-start text-xs font-medium text-muted transition-colors hover:text-terracotta"
      >
        Ganti pendamping
      </button>
    </motion.div>
  );
}

function GroupCard({ count, onToggle }: { count: number; onToggle: () => void }) {
  const mine = count > 0;
  return (
    <motion.div variants={itemVariant} className="card-surface flex flex-col gap-4 rounded-md p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-ink">Grup Bugar Pagi</h2>
          <p className="mt-1 text-xs text-muted">
            Hari ini: minum 8 gelas air + jalan 15 menit.
          </p>
        </div>
        <div className="flex -space-x-2">
          {PERSONAS.map((p) => (
            <span
              key={p.id}
              title={p.name}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface text-base ${COLOR_CIRCLE[p.color] ?? COLOR_CIRCLE.ink}`}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-medium tabular-nums text-muted">
          {count}/4 orang sudah check-in
        </span>
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            mine
              ? "bg-sage text-white"
              : "border border-hairline bg-surface text-ink hover:border-sage hover:text-sage"
          }`}
        >
          {mine ? <Check className="h-3.5 w-3.5" /> : null}
          {mine ? "Sudah check-in" : "Check-in"}
        </button>
      </div>
    </motion.div>
  );
}