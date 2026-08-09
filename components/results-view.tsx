"use client";

import { useReducedMotion } from "framer-motion";
import { motion, type Variants } from "framer-motion";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { AnalysisResult, Severity } from "../types/analysis";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const impactBadge: Record<Severity, string> = {
  low: "bg-ink/5 text-muted",
  medium: "bg-[#f5efd6] text-[#8a6a2f]",
  high: "bg-danger/10 text-danger",
};

const impactLabel: Record<Severity, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

const springTransition = { type: "spring", stiffness: 100, damping: 15 } as const;

const factorsStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
} satisfies Variants;

const factorItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: springTransition },
} satisfies Variants;

const actionsStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
} satisfies Variants;

const actionItem = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springTransition },
} satisfies Variants;

export function ResultsView({
  result,
  loading,
}: {
  result: AnalysisResult | null;
  loading: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="h-20 animate-pulse rounded-md bg-ink/5" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-28 animate-pulse rounded-md bg-ink/5" />
          <div className="h-28 animate-pulse rounded-md bg-ink/5" />
        </div>
        <div className="h-16 animate-pulse rounded-md bg-ink/5" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card-surface flex min-h-24 items-center justify-center rounded-md">
        <p className="text-sm text-muted">Hasil analisis akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      aria-live="polite"
      initial={shouldReduceMotion ? false : "hidden"}
      animate={shouldReduceMotion ? false : "visible"}
    >
      {result.redFlag ? <RedFlagCard result={result} /> : null}

      {result.factors.length > 0 ? (
        <SummaryCard result={result} />
      ) : null}

      {result.factors.length > 0 ? <FactorList result={result} /> : null}

      {result.prioritizedActions.length > 0 ? (
        <ActionsList result={result} />
      ) : null}

      <p className="max-w-md text-xs leading-relaxed text-muted">
        {result.disclaimer}
      </p>
    </motion.div>
  );
}

function RedFlagCard({ result }: { result: AnalysisResult }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: EASE }}
      className="flex flex-col gap-2 rounded-md border border-danger bg-danger/5 p-5"
    >
      <div className="flex items-center gap-2 font-semibold text-danger">
        <AlertTriangle className="h-5 w-5" />
        <span>Segera cari bantuan medis</span>
      </div>
      {result.redFlag ? (
        <>
          <p className="text-sm text-ink">{result.redFlag.message}</p>
          <p className="text-sm font-medium text-danger">
            {result.redFlag.emergency}
          </p>
        </>
      ) : null}
    </motion.div>
  );
}

function SummaryCard({ result }: { result: AnalysisResult }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.6, ease: EASE }}
      className="rounded-r-md border-l-4 border-terracotta bg-surface p-5"
    >
      <p className="text-base leading-relaxed text-ink">{result.summary}</p>
    </motion.div>
  );
}

function FactorList({ result }: { result: AnalysisResult }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Faktor yang berpengaruh
      </h3>
      <motion.ol
        variants={factorsStagger}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? false : "visible"}
        className="grid gap-4 sm:grid-cols-2"
      >
        {result.factors.map((factor) => (
          <motion.li
            key={factor.id}
            variants={factorItem}
            className="card-surface flex flex-col gap-2 rounded-md p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-ink">{factor.name}</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${impactBadge[factor.impact]}`}
              >
                {impactLabel[factor.impact]}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {factor.reasoning}
            </p>
            <p className="flex items-start gap-2 text-sm font-medium text-ink">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
              {factor.suggestion}
            </p>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}

function ActionsList({ result }: { result: AnalysisResult }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Rekomendasi prioritas
      </h3>
      <motion.ol
        variants={actionsStagger}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={shouldReduceMotion ? false : "visible"}
        className="flex flex-col gap-3"
      >
        {result.prioritizedActions.map((action, i) => (
          <motion.li
            key={`${action.action}-${i}`}
            variants={actionItem}
            className="card-surface flex flex-col gap-1 rounded-md p-5 sm:flex-row sm:items-center sm:gap-5"
          >
            <span className="font-display text-4xl leading-none text-terracotta">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-semibold text-ink">{action.action}</p>
              <p className="mt-0.5 text-sm text-muted">{action.reason}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}