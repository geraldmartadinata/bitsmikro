"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Send, Users } from "lucide-react";
import {
  chatReplyForGroup,
  GROUP_NAME,
  GROUP_SEED,
  groupChitChat,
  groupReplyFor,
  loadGroupMessages,
  saveGroupMessages,
  type GroupMessage,
} from "../lib/group";
import { PERSONAS } from "../lib/partner";
import { Input } from "./ui/input";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
} satisfies Variants;

const COLOR_CIRCLE: Record<string, string> = {
  sage: "bg-sage/10 text-sage",
  terracotta: "bg-terracotta/10 text-terracotta",
  amber: "bg-amber-100 text-amber-800",
  ink: "bg-ink/10 text-ink",
};

function formatTime(at: number): string {
  return new Date(at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GroupSection() {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [typingId, setTypingId] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored = loadGroupMessages();
      setMessages(stored.length > 0 ? stored : GROUP_SEED);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveGroupMessages(messages);
  }, [messages, hydrated]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typingId]);

  function personaOf(id: string) {
    return PERSONAS.find((p) => p.id === id) ?? null;
  }

  async function send() {
    const text = input.trim();
    if (!text || typingId) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        from: "user",
        name: "Kamu",
        emoji: "🙂",
        text,
        at: Date.now(),
      },
    ]);
    setInput("");

    const { personaId } = chatReplyForGroup(text);
    const typingPersona = personaOf(personaId);
    setTypingId(personaId);

    const history = messages.slice(-4).map((m) => ({
      role: (m.from === "user" ? "user" : "assistant") as "user" | "assistant",
      content: m.text,
    }));

    let replyText = "";
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId, input: text, history }),
      });
      const data = (await response.json()) as { ok: boolean; reply?: string };
      if (data.ok && data.reply) replyText = data.reply;
    } catch {
      /* fall through to template */
    }

    if (!replyText) replyText = groupReplyFor(text).text;
    setTypingId(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        from: personaId,
        name: typingPersona?.name ?? "Anggota",
        emoji: typingPersona?.emoji ?? "👤",
        text: replyText,
        at: Date.now(),
      },
    ]);

    if (text.length % 10 < 6) {
      const second = groupChitChat(text, personaId);
      const secondPersona = personaOf(second.personaId);
      setTypingId(second.personaId);
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 300));
      setTypingId(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `r2-${Date.now()}`,
          from: second.personaId,
          name: secondPersona?.name ?? "Anggota",
          emoji: secondPersona?.emoji ?? "👤",
          text: second.text,
          at: Date.now(),
        },
      ]);
    }
  }

  const typingPersona = typingId ? personaOf(typingId) : null;

  return (
    <motion.section
      className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div
        variants={fadeUp}
        className="card-surface flex flex-col items-center gap-3 rounded-md p-5 text-center"
      >
        <div className="flex -space-x-2">
          {PERSONAS.map((p) => (
            <span
              key={p.id}
              title={p.name}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface text-lg ${COLOR_CIRCLE[p.color] ?? COLOR_CIRCLE.ink}`}
            >
              {p.emoji}
            </span>
          ))}
        </div>
        <div>
          <h1 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
            {GROUP_NAME}
          </h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Users className="h-3.5 w-3.5" />
            Anggota: Rara, Bima, Sinta, Danu
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-5">
        <div
          ref={threadRef}
          className="flex h-[26rem] flex-col gap-3 overflow-y-auto rounded-xl border border-hairline bg-surface p-4"
        >
          {!hydrated ? (
            <p className="m-auto text-sm text-muted">Memuat grup…</p>
          ) : (
            messages.map((m) => {
              const mine = m.from === "user";
              const persona = personaOf(m.from);
              return (
                <div
                  key={m.id}
                  className={`flex w-full items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                >
                  {!mine ? (
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${
                        persona
                          ? COLOR_CIRCLE[persona.color] ?? COLOR_CIRCLE.ink
                          : "bg-ink/10 text-ink"
                      }`}
                    >
                      {m.emoji}
                    </span>
                  ) : null}
                  <div
                    className={`flex max-w-[78%] flex-col gap-0.5 ${
                      mine ? "items-end" : "items-start"
                    }`}
                  >
                    {!mine ? (
                      <span className="text-[10px] font-medium text-muted">{m.name}</span>
                    ) : null}
                    <div
                      className={`rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
                        mine
                          ? "rounded-br-sm bg-terracotta text-white"
                          : "rounded-bl-sm border border-hairline bg-surface text-ink"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-muted">{formatTime(m.at)}</span>
                  </div>
                </div>
              );
            })
          )}
          {typingPersona ? (
            <div className="flex items-end gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${
                  COLOR_CIRCLE[typingPersona.color] ?? COLOR_CIRCLE.ink
                }`}
              >
                {typingPersona.emoji}
              </span>
              <div className="rounded-xl rounded-bl-sm border border-hairline bg-surface px-3.5 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                  {typingPersona.emoji} mengetik
                  <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1 w-1 rounded-full bg-muted"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </span>
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Input
            value={input}
            maxLength={300}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !typingId) send();
            }}
            placeholder={`Kirim ke ${GROUP_NAME}…`}
            className="rounded-full"
            aria-label="Pesan grup"
          />
          <button
            type="button"
            onClick={send}
            disabled={typingId !== null || input.trim().length === 0}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-white transition-colors hover:bg-terracotta-hover disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Kirim pesan grup"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}