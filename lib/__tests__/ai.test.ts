import { afterEach, describe, expect, it, vi } from "vitest";
import { analyzeSymptoms, createProvider, MockProvider } from "../ai";
import { isRedFlag } from "../redflag";

afterEach(() => {
  delete process.env.AI_PROVIDER;
  delete process.env.AI_API_KEY;
  vi.restoreAllMocks();
});

const scenarioInputs: { label: string; input: string }[] = [
  { label: "tired", input: "akhir-akhir ini gampang capek dan susah fokus" },
  { label: "dizzy", input: "kepala sering pusing di siang hari" },
  { label: "stomach", input: "perut terasa tidak nyaman setelah makan" },
  { label: "fallback", input: "saya merasa kurang fit, tidak tahu penyebabnya" },
];

function expectNoUndefined(value: unknown): void {
  if (value === undefined || value === null) {
    throw new Error("found null/undefined value");
  }
  if (Array.isArray(value)) {
    value.forEach(expectNoUndefined);
  } else if (typeof value === "object") {
    Object.values(value).forEach(expectNoUndefined);
  }
}

describe("analyzeSymptoms", () => {
  it.each(scenarioInputs)(
    "returns a valid AnalysisResult for the '$label' scenario (no undefined fields)",
    async ({ input }) => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const result = await analyzeSymptoms(input);
      expect(result).toBeDefined();
      expect(typeof result.summary).toBe("string");
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.factors.length).toBeGreaterThanOrEqual(3);
      expect(result.factors.length).toBeLessThanOrEqual(4);
      expect(result.prioritizedActions).toHaveLength(3);
      expect(result.disclaimer.length).toBeGreaterThan(0);
      expect(result.redFlag).toBeUndefined();
      expectNoUndefined(result);
      vi.restoreAllMocks();
    },
  );

  it("assigns the tired scenario for tired/focus keywords", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = await analyzeSymptoms("gampang capek dan sulit fokus");
    expect(result.factors.map((f) => f.id)).toEqual(expect.arrayContaining(["sleep", "hydration", "diet"]));
    vi.restoreAllMocks();
  });

  it("assigns the dizzy scenario for head/dizzy keywords", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = await analyzeSymptoms("kepala saya sering pusing");
    expect(result.factors.map((f) => f.id)).toEqual(
      expect.arrayContaining(["hydration", "screen-time", "meal-schedule"]),
    );
    vi.restoreAllMocks();
  });

  it("assigns the stomach scenario for stomach keywords", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = await analyzeSymptoms("perut tidak nyaman dan mual");
    expect(result.factors.map((f) => f.id)).toEqual(
      expect.arrayContaining(["diet", "caffeine", "stress"]),
    );
    vi.restoreAllMocks();
  });

  it("uses the fallback scenario when no keyword matches", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const result = await analyzeSymptoms("zxq ollective phrase test");
    expect(result.factors.length).toBeGreaterThanOrEqual(3);
    expect(result.factors[0].id).toBe("sleep");
    vi.restoreAllMocks();
  });

  it("skips the simulated delay when a custom provider is injected", async () => {
    const fast = new MockProvider({ delayRangeMs: [0, 0] });
    const result = await analyzeSymptoms("gampang capek", fast);
    expect(result.factors[0].id).toBe("sleep");
  });
});

describe("MockProvider determinism", () => {
  it("returns the same structure twice for the same input", async () => {
    const provider = new MockProvider({ delayRangeMs: [0, 0] });
    const first = await provider.analyze("akhir-akhir ini gampang capek");
    const second = await provider.analyze("akhir-akhir ini gampang capek");
    expect(first).toEqual(second);
  });

  it("is returned by createProvider for the default 'mock' env", () => {
    delete process.env.AI_PROVIDER;
    expect(createProvider("mock")).toBeInstanceOf(MockProvider);
    expect(createProvider("unknown-provider")).toBeInstanceOf(MockProvider);
  });
});

describe("isRedFlag", () => {
  it.each([
    "saya merasa sakit dada sebelah kiri",
    "sesak napas ketika jalan kaki",
    "lumpuh di satu sisi tubuh setelah bangun",
    "saya pingsan tadi pagi",
    "mulai merasakan bicara pelo",
    "muntah darah setelah makan",
    "kejang di rumah",
    "shortness of breath",
  ])("returns true for a serious input: %s", (input) => {
    expect(isRedFlag(input)).toBe(true);
  });

  it.each([
    "saya sering pusing kalau siang",
    "akhir-akhir ini gampang capek dan susah fokus",
    "perut kembung setelah makan",
    "sakit kepala biasa, mereda dengan istirahat",
    "saya hanya ingin tahu pola hidup sehat",
  ])("returns false for a normal input: %s", (input) => {
    expect(isRedFlag(input)).toBe(false);
  });
});