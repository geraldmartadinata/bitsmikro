import type { PrioritizedAction } from "../types/analysis";

export interface PlanDay {
  id: number;
  title: string;
  focus: string;
  actionIds: number[];
}

export const PLAN_STORAGE_KEY = "zense_plan_progress";

const DAY_THEMES = [
  "Mulai",
  "Konsistensi",
  "Hidrasi",
  "Pola makan",
  "Gerakan",
  "Layar",
  "Review",
];

function themeTitle(dayIdx: number): string {
  return `Hari ${dayIdx + 1} — ${DAY_THEMES[dayIdx] ?? "Lanjut"}`;
}

export function buildSevenDayPlan(actions: PrioritizedAction[]): PlanDay[] {
  if (actions.length === 0) return [];

  const ordered = actions
    .map((action, index) => ({ action, index }))
    .sort((a, b) => a.action.priority - b.action.priority);
  const order = ordered.map((item) => item.index);
  const n = order.length;

  const plan: PlanDay[] = [];
  let pointer = 0;

  for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
    const count = dayIdx === 0 ? 1 : 2;
    const seen = new Set<number>();
    for (let k = 0; k < count; k++) {
      seen.add(order[(pointer + k) % n]);
    }
    pointer = (pointer + count) % n;

    const actionIds = [...seen];
    const firstId = actionIds[0];
    plan.push({
      id: dayIdx + 1,
      title: themeTitle(dayIdx),
      focus: `Fokus: ${actions[firstId].action}`,
      actionIds,
    });
  }

  return plan;
}

export function loadPlanProgress(): Record<number, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<number, string[]>;
  } catch {
    return {};
  }
}

export function savePlanProgress(progress: Record<number, string[]>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* storage unavailable — ignore */
  }
}