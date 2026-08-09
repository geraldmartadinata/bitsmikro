"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { lastMessageOf, loadChats, PERSONAS } from "../lib/partner";
import { loadGroupMessages } from "../lib/group";

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
  return new Date(at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function PartnerInbox() {
  const chats = loadChats();
  const groupMessages = loadGroupMessages();
  const groupLast = lastMessageOf(groupMessages);
  const recommended = PERSONAS.filter((p) => (chats[p.id]?.length ?? 0) === 0);

  return (
    <motion.div
      className="mx-auto max-w-2xl px-5 sm:px-6"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Tidak sendirian lagi
        </h1>
        <p className="mt-3 text-muted">Pilih percakapan, jaga semangatmu bareng.</p>
      </motion.div>

      <motion.div variants={fadeUp} className="card-surface divide-y divide-hairline overflow-hidden rounded-md">
        <Link
          href="/group"
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.98]"
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
        </Link>

        {PERSONAS.map((p) => {
          const last = lastMessageOf(chats[p.id] ?? []);
          return (
            <Link
              key={p.id}
              href={`/partner/${p.id}`}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.98]"
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
                <p className={`line-clamp-1 text-xs ${last ? "text-muted" : "italic text-muted/70"}`}>
                  {last ? last.text : "Mulai obrolan…"}
                </p>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {recommended.length > 0 ? (
        <motion.div variants={fadeUp} className="mt-6">
          <h3 className="text-sm font-medium uppercase tracking-widest text-muted">
            Rekomendasi untukmu
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recommended.map((p) => (
              <Link
                key={p.id}
                href={`/partner/${p.id}`}
                className="card-surface group flex items-center gap-3 rounded-md p-4 transition-transform duration-200 active:scale-[0.98]"
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
                <span className="shrink-0 rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-xs font-medium text-ink transition-colors group-hover:border-terracotta group-hover:text-terracotta">
                  Mulai
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}