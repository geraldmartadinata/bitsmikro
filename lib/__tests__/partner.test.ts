import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GROUP_STORAGE_KEY,
  loadGroupCheckin,
  loadPartnerState,
  PARTNER_STORAGE_KEY,
  PERSONAS,
  replyFor,
  saveGroupCheckin,
  savePartnerState,
} from "../partner";

describe("replyFor", () => {
  it("is deterministic: same text + persona always gives the same reply", () => {
    const a = replyFor("saya susah tidur semalaman", "bima");
    const b = replyFor("saya susah tidur semalaman", "bima");
    expect(a).toEqual(b);
  });

  it("routes sleep keywords to a sleep-themed reply for every persona", () => {
    for (const persona of PERSONAS) {
      const reply = replyFor("saya susah tidur malam ini", persona.id);
      expect(reply.text).toMatch(/tidur/i);
      expect(reply.continuing).toBe(true);
    }
  });

  it("routes diet keywords to a diet-themed reply", () => {
    const reply = replyFor("pola makan saya berantakan", "sinta");
    expect(reply.text).toMatch(/makan/i);
    expect(reply.continuing).toBe(true);
  });

  it("routes energy keywords to an energy-themed reply", () => {
    const reply = replyFor("aku gampang capek akhir-akhir ini", "rara");
    expect(reply.text).toMatch(/capek/i);
  });

  it("returns a non-empty generic reply for random input", () => {
    const reply = replyFor("zxqvpxj obrolan acak", "rara");
    expect(reply.text.length).toBeGreaterThan(0);
    expect(reply.continuing).toBe(true);
  });

  it("marks farewells as continuing false", () => {
    expect(replyFor("makasih ya, sampai jumpa", "danu").continuing).toBe(false);
    expect(replyFor("bye", "sinta").continuing).toBe(false);
  });

  it("falls back to a default persona for unknown persona ids", () => {
    expect(replyFor("saya susah tidur", "nobody").text.length).toBeGreaterThan(0);
  });
});

describe("partner state storage", () => {
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

  it("round-trips partner state under the partner storage key", () => {
    const state = {
      personaId: "bima",
      chat: [
        { from: "persona" as const, text: "Halo!", at: 1 },
        { from: "user" as const, text: "halo", at: 2 },
      ],
      streak: 3,
    };
    savePartnerState(state);
    expect(store.has(PARTNER_STORAGE_KEY)).toBe(true);
    expect(loadPartnerState()).toEqual(state);
  });

  it("falls back to default on corrupt JSON", () => {
    store.set(PARTNER_STORAGE_KEY, "{oops");
    expect(loadPartnerState()).toEqual({ personaId: null, chat: [], streak: 0 });
  });

  it("sanitizes an unknown personaId to null", () => {
    store.set(PARTNER_STORAGE_KEY, JSON.stringify({ personaId: "ghost", chat: [], streak: 0 }));
    expect(loadPartnerState().personaId).toBeNull();
  });

  it("group check-in clamps between 0 and 4 and round-trips", () => {
    expect(loadGroupCheckin()).toBe(0);
    saveGroupCheckin(3);
    expect(store.get(GROUP_STORAGE_KEY)).toBe("3");
    expect(loadGroupCheckin()).toBe(3);
    saveGroupCheckin(99);
    expect(loadGroupCheckin()).toBe(4);
    store.set(GROUP_STORAGE_KEY, "not-a-number");
    expect(loadGroupCheckin()).toBe(0);
  });
});
