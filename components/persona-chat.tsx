"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import {
  loadChats,
  loadStreak,
  personaGreeting,
  replyFor,
  saveChats,
  saveStreak,
  type ChatMessage,
  type Persona,
} from "../lib/partner";
import { Input } from "./ui/input";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
} satisfies Variants;

function sameDay(a: number, b: number): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
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

export function PersonaChat({ persona }: { persona: Persona }) {
  const [chat, setChat] = useState<ChatMessage[]>(
    () => loadChats()[persona.id] ?? [],
  );
  const [streak, setStreak] = useState<number>(() => loadStreak());
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const [lastSource, setLastSource] = useState<"gemini" | "mock" | null>(null);

  async function send() {
    const text = input.trim();
    if (!text || typing) return;
    const now = Date.now();
    const lastUser = [...chat].reverse().find((m) => m.from === "user");
    const nextStreak = lastUser && sameDay(lastUser.at, now) ? streak : streak + 1;

    const withUser: ChatMessage[] = [...chat, { from: "user", text, at: now }];
    setChat(withUser);
    saveChats({ ...loadChats(), [persona.id]: withUser });
    setStreak(nextStreak);
    saveStreak(nextStreak);
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
          history: chat.slice(-4).map((m) => ({
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

    const withReply: ChatMessage[] = [
      ...withUser,
      { from: "persona", text: replyText, at: Date.now() },
    ];
    setChat(withReply);
    saveChats({ ...loadChats(), [persona.id]: withReply });
    if (!continuing) setEnded(true);
  }

  function restart() {
    const next = loadChats();
    delete next[persona.id];
    saveChats(next);
    setChat([]);
    setEnded(false);
    setLastSource(null);
  }

  const messages = chat;

  return (
    <motion.div
      className="mx-auto max-w-2xl px-5 sm:px-6"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={fadeUp} className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href="/partner"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-terracotta"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Semua chat
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${
                {
                  sage: "bg-sage/10 text-sage",
                  terracotta: "bg-terracotta/10 text-terracotta",
                  amber: "bg-amber-100 text-amber-800",
                  ink: "bg-ink/10 text-ink",
                }[persona.color] ?? "bg-ink/10 text-ink"
              }`}
            >
              {persona.emoji}
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-ink">{persona.name}</span>
              <span className="text-xs text-muted">{persona.focus}</span>
            </div>
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium text-sage">
              🔥 {streak}
            </span>
          </div>
        </div>

        <div className="flex h-80 flex-col gap-3 overflow-y-auto rounded-xl border border-hairline bg-surface p-4">
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
            <button
              type="button"
              onClick={restart}
              className="rounded-full border border-hairline bg-surface px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Mulai ulang
            </button>
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
          onClick={restart}
          className="self-start text-xs font-medium text-muted transition-colors hover:text-terracotta"
        >
          Mulai ulang percakapan
        </button>
      </motion.div>
    </motion.div>
  );
}