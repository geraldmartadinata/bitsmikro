"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import {
  hasChatted,
  lastMessageOf,
  loadPartnerState,
  PERSONAS,
  personaGreeting,
  replyFor,
  savePartnerState,
  type ChatMessage,
  type PartnerState,
  type Persona,
} from "../lib/partner";
import { loadGroupMessages, type GroupMessage } from "../lib/group";
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

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

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
  const [state, setState] = useState<PartnerState>({ chats: {}, streak: 0, activeId: null });
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [lastSource, setLastSource] = useState<"gemini" | "mock" | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const persona =
    state.activeId && state.activeId !== "group"
      ? PERSONAS.find((p) => p.id === state.activeId) ?? null
      : null;
  const activeChat: ChatMessage[] = persona ? state.chats[persona.id] ?? [] : [];

  useEffect(() => {
    const id = window.setTimeout(() => {
      setState(loadPartnerState());
      setGroupMessages(loadGroupMessages());
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
  }, [activeChat.length, typing]);

  function openInbox() {
    setActive(null);
    setInput("");
    setEnded(false);
    setLastSource(null);
  }

  function setActive(id: string | null) {
    setState((s) => ({ ...s, activeId: id }));
    setEnded(false);
    setLastSource(null);
    setInput("");
  }

  async function send() {
    const text = input.trim();
    if (!text || typing || !persona) return;
    const now = Date.now();
    const lastUser = [...activeChat].reverse().find((m) => m.from === "user");
    const streak = lastUser && sameDay(lastUser.at, now) ? state.streak : state.streak + 1;

    setState((s) => ({
      ...s,
      chats: {
        ...s.chats,
        [persona.id]: [
          ...(s.chats[persona.id] ?? []),
          { from: "user", text, at: now },
        ],
      },
      streak,
    }));
    setInput("");

    setTyping(true);
    let replyText: string;
    let continuing: boolean;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: persona.id,
          input: text,
          history: activeChat.slice(-4).map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        reply?: string;
        source?: "gemini" | "mock";
      };
      const template = replyFor(text, persona.id);
      replyText = data.ok && data.reply ? data.reply : template.text;
      setLastSource(data.ok ? (data.source ?? "mock") : "mock");
      continuing = data.source === "gemini" ? true : template.continuing;
    } catch {
      const template = replyFor(text, persona.id);
      replyText = template.text;
      continuing = template.continuing;
      setLastSource("mock");
    }
    setTyping(false);
    setState((s) => ({
      ...s,
      chats: {
        ...s.chats,
        [persona.id]: [...(s.chats[persona.id] ?? []), { from: "persona", text: replyText, at: Date.now() }],
      },
    }));
    if (!continuing) setEnded(true);
  }

  function restartChat() {
    if (!persona) return;
    setState((s) => {
      const chats = { ...s.chats };
      delete chats[persona.id];
      return { ...s, chats };
    });
    setEnded(false);
    setLastSource(null);
  }

  return (
    <motion.section
      className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20"
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
          Pilih percakapan, jaga semangatmu bareng.
        </p>
      </motion.div>

      {!hydrated ? (
        <motion.p variants={itemVariant} className="text-center text-sm text-muted">
          Memuat…
        </motion.p>
      ) : state.activeId === null ? (
        <Inbox
          state={state}
          groupMessages={groupMessages}
          onOpenPersona={(id) => setActive(id)}
          onOpenGroup={() => setActive("group")}
        />
      ) : persona ? (
        <Chat
          persona={persona}
          messages={activeChat}
          streak={state.streak}
          input={input}
          setInput={setInput}
          typing={typing}
          ended={ended}
          lastSource={lastSource}
          send={send}
          onBack={openInbox}
          onRestart={restartChat}
          chatRef={chatRef}
        />
      ) : (
        <GroupView onBack={openInbox} />
      )}
    </motion.section>
  );
}

function Inbox({
  state,
  groupMessages,
  onOpenPersona,
  onOpenGroup,
}: {
  state: PartnerState;
  groupMessages: GroupMessage[];
  onOpenPersona: (id: string) => void;
  onOpenGroup: () => void;
}) {
  const groupLast = lastMessageOf(groupMessages);
  const recommended = PERSONAS.filter((p) => !hasChatted(state, p.id));

  return (
    <motion.div variants={itemVariant} className="flex flex-col gap-6">
      <div className="card-surface divide-y divide-hairline overflow-hidden rounded-md">
        <button
          type="button"
          onClick={onOpenGroup}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface"
        >
          <span className="flex -space-x-2 shrink-0">
            {PERSONAS.map((p) => (
              <span
                key={p.id}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface text-base ${COLOR_CIRCLE[p.color] ?? COLOR_CIRCLE.ink}`}
              >
                {p.emoji}
              </span>
            ))}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-lg text-ink">Grup Bugar Pagi</span>
              {groupLast ? (
                <span className="shrink-0 text-[10px] tabular-nums text-muted">
                  {formatTime(groupLast.at)}
                </span>
              ) : null}
            </div>
            <p className="text-[10px] text-muted">Rara, Bima, Sinta, Danu</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted">
              {groupLast ? groupLast.text : "Mulai obrolan grup…"}
            </p>
          </div>
        </button>

        {PERSONAS.map((p) => {
          const chat = state.chats[p.id] ?? [];
          const last = lastMessageOf(chat);
          const preview = last ? last.text : "Mulai obrolan…";
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onOpenPersona(p.id)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${COLOR_CIRCLE[p.color] ?? COLOR_CIRCLE.ink}`}
              >
                {p.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-ink">{p.name}</span>
                  {last ? (
                    <span className="shrink-0 text-[10px] tabular-nums text-muted">
                      {formatTime(last.at)}
                    </span>
                  ) : null}
                </div>
                <p
                  className={`line-clamp-1 text-xs ${last ? "text-muted" : "italic text-muted/70"}`}
                >
                  {preview}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {recommended.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted">
            Rekomendasi untukmu
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recommended.map((p) => (
              <div
                key={p.id}
                className="card-surface flex items-center gap-3 rounded-md p-4"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${COLOR_CIRCLE[p.color] ?? COLOR_CIRCLE.ink}`}
                >
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-ink">{p.name}</span>
                  <p className="truncate text-xs text-muted">{p.focus}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPersona(p.id)}
                  className="shrink-0 rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  Mulai
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}

function Chat({
  persona,
  messages,
  streak,
  input,
  setInput,
  typing,
  ended,
  lastSource,
  send,
  onBack,
  onRestart,
  chatRef,
}: {
  persona: Persona;
  messages: ChatMessage[];
  streak: number;
  input: string;
  setInput: (v: string) => void;
  typing: boolean;
  ended: boolean;
  lastSource: "gemini" | "mock" | null;
  send: () => void;
  onBack: () => void;
  onRestart: () => void;
  chatRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div variants={itemVariant} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-terracotta"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Semua chat
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${COLOR_CIRCLE[persona.color] ?? COLOR_CIRCLE.ink}`}
          >
            {persona.emoji}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ink">{persona.name}</span>
            <span className="text-[10px] text-muted">{persona.focus}</span>
          </div>
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-medium text-sage">
            🔥 {streak}
          </span>
        </div>
      </div>

      <div
        ref={chatRef}
        className="flex h-80 flex-col gap-3 overflow-y-auto rounded-xl border border-hairline bg-surface p-4"
      >
        {messages.length === 0 ? (
          <div className="self-start rounded-xl rounded-bl-sm border border-hairline bg-surface px-3.5 py-2 text-sm leading-relaxed text-ink">
            {personaGreeting(persona.id)}
          </div>
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
        {lastSource === "mock" && !typing ? (
          <p className="self-end text-[10px] text-muted">mode cadangan</p>
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
        onClick={onRestart}
        className="self-start text-xs font-medium text-muted transition-colors hover:text-terracotta"
      >
        Mulai ulang percakapan
      </button>
    </motion.div>
  );
}

function GroupView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div variants={itemVariant} className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted transition-colors hover:text-terracotta"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Semua chat
      </button>
      <div className="card-surface flex flex-wrap items-center justify-between gap-3 rounded-md p-5">
        <div>
          <h2 className="font-display text-xl text-ink">Grup Bugar Pagi</h2>
          <p className="mt-1 text-xs text-muted">
            Bareng Rara, Bima, Sinta &amp; Danu — saling semangat tiap hari.
          </p>
        </div>
        <Link
          href="/group"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-terracotta px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-terracotta-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          Buka Grup
        </Link>
      </div>
    </motion.div>
  );
}