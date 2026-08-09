import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildSevenDayPlan,
  loadPlanProgress,
  PLAN_STORAGE_KEY,
  savePlanProgress,
} from "../plan";
import type { PrioritizedAction } from "../../types/analysis";

function makeActions(count: number): PrioritizedAction[] {
  return Array.from({ length: count }, (_, i) => ({
    action: `Langkah ${i + 1}`,
    reason: `Alasan ${i + 1}`,
    priority: i + 1,
  }));
}

describe("buildSevenDayPlan", () => {
  it("returns exactly 7 days for a typical result", () => {
    expect(buildSevenDayPlan(makeActions(3))).toHaveLength(7);
  });

  it("day 1 contains only the top-priority action", () => {
    const actions = makeActions(3);
    const plan = buildSevenDayPlan(actions);
    expect(plan[0].actionIds).toHaveLength(1);
    expect(actions[plan[0].actionIds[0]].action).toBe("Langkah 1");
  });

  it("every day has 1-2 unique actions with valid indexes", () => {
    const actions = makeActions(3);
    const plan = buildSevenDayPlan(actions);
    for (const day of plan) {
      expect(day.actionIds.length).toBeGreaterThanOrEqual(1);
      expect(day.actionIds.length).toBeLessThanOrEqual(2);
      expect(new Set(day.actionIds).size).toBe(day.actionIds.length);
      for (const id of day.actionIds) {
        expect(actions[id]).toBeDefined();
      }
    }
  });

  it("is deterministic: same input produces identical plan", () => {
    const actions = makeActions(3);
    expect(buildSevenDayPlan(actions)).toEqual(buildSevenDayPlan(actions));
  });

  it("cycles cleanly when there are more actions than slots", () => {
    const actions = makeActions(10);
    const plan = buildSevenDayPlan(actions);
    expect(plan).toHaveLength(7);
    for (const day of plan) {
      expect(day.actionIds.length).toBeGreaterThanOrEqual(1);
      expect(day.actionIds.length).toBeLessThanOrEqual(2);
      for (const id of day.actionIds) {
        expect(id).toBeGreaterThanOrEqual(0);
        expect(id).toBeLessThan(10);
      }
    }
  });

  it("handles a single action without duplicates per day", () => {
    const plan = buildSevenDayPlan(makeActions(1));
    expect(plan).toHaveLength(7);
    for (const day of plan) {
      expect(day.actionIds).toEqual([0]);
    }
  });

  it("returns an empty array when no actions are provided", () => {
    expect(buildSevenDayPlan([])).toEqual([]);
  });
});

describe("plan progress storage", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("round-trips progress under the plan storage key", () => {
    const progress = { 1: ["Langkah 1"], 2: ["Langkah 2", "Langkah 3"] };
    savePlanProgress(progress);
    expect(store.has(PLAN_STORAGE_KEY)).toBe(true);
    expect(loadPlanProgress()).toEqual(progress);
  });

  it("returns {} when nothing is stored", () => {
    expect(loadPlanProgress()).toEqual({});
  });

  it("returns {} on corrupt JSON", () => {
    store.set(PLAN_STORAGE_KEY, "{oops");
    expect(loadPlanProgress()).toEqual({});
  });

  it("returns {} and does not throw when window is unavailable", () => {
    vi.unstubAllGlobals();
    expect(loadPlanProgress()).toEqual({});
    expect(() => savePlanProgress({ 1: ["x"] })).not.toThrow();
  });
});