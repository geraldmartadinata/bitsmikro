"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { loadPlanProgress, savePlanProgress, type PlanDay } from "../lib/plan";
import type { PrioritizedAction } from "../types/analysis";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const itemVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
} satisfies Variants;

export function PlanSection({
  plan,
  actions,
}: {
  plan: PlanDay[];
  actions: PrioritizedAction[];
}) {
  const [progress, setProgress] = useState<Record<number, string[]>>(() =>
    loadPlanProgress(),
  );

  useEffect(() => {
    savePlanProgress(progress);
  }, [progress]);

  const totalSteps = plan.reduce((sum, day) => sum + day.actionIds.length, 0);

  const checkedSteps = plan.reduce((sum, day) => {
    const checked = progress[day.id] ?? [];
    return (
      sum +
      day.actionIds.filter((id) => checked.includes(actions[id]?.action ?? "")).length
    );
  }, 0);

  const pct = totalSteps > 0 ? Math.round((checkedSteps / totalSteps) * 100) : 0;
  const done = totalSteps > 0 && checkedSteps === totalSteps;

  function isDayDone(day: PlanDay): boolean {
    if (day.actionIds.length === 0) return false;
    const checked = progress[day.id] ?? [];
    return day.actionIds.every((id) => checked.includes(actions[id]?.action ?? ""));
  }

  function toggle(dayId: number, actionText: string) {
    setProgress((prev) => {
      const list = prev[dayId] ?? [];
      const nextList = list.includes(actionText)
        ? list.filter((t) => t !== actionText)
        : [...list, actionText];
      return { ...prev, [dayId]: nextList };
    });
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className="flex flex-col gap-5 rounded-md border border-hairline bg-[#faf8f1] p-5 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl text-ink sm:text-3xl">Plan 7 Hari</h3>
        <p className="text-sm text-muted">
          Fokus satu langkah kecil setiap hari — achievable, bukan sempurna.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-medium tabular-nums text-muted">
            {checkedSteps}/{totalSteps} langkah selesai
          </span>
          <span className="text-xs font-medium tabular-nums text-sage">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/5">
          <div
            className="h-full rounded-full bg-sage transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {done ? (
        <div className="rounded-md border border-sage/30 bg-sage/10 p-4">
          <p className="font-semibold text-sage">
            7 hari selesai — kamu konsisten! 🎉
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Lanjutkan kebiasaan kecil ini, lalu analisis ulang setelah seminggu
            untuk lihat perubahan.
          </p>
        </div>
      ) : null}

      <ol className="flex flex-col gap-3">
        {plan.map((day) => {
          const dayDone = isDayDone(day);
          return (
            <motion.li
              key={day.id}
              variants={itemVariant}
              className="card-surface flex flex-col gap-3 rounded-md p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-sm transition-colors duration-200 ${
                    dayDone
                      ? "border-sage bg-sage text-white"
                      : "border-hairline bg-surface text-muted"
                  }`}
                >
                  {dayDone ? <Check className="h-4 w-4" /> : day.id}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-ink">{day.title}</span>
                  <span className="truncate text-xs text-muted">{day.focus}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                {day.actionIds.map((id) => {
                  const text = actions[id]?.action ?? "";
                  const isChecked = (progress[day.id] ?? []).includes(text);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggle(day.id, text)}
                      className="flex items-center gap-2.5 rounded-sm px-1 py-1 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200 ${
                          isChecked
                            ? "border-sage bg-sage text-white"
                            : "border-hairline bg-surface text-transparent hover:border-terracotta"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span
                        className={`min-w-0 truncate text-sm transition-colors duration-200 ${
                          isChecked ? "text-muted line-through" : "text-ink"
                        }`}
                      >
                        {text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}