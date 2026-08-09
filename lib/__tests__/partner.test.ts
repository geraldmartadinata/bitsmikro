import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GROUP_STORAGE_KEY,
  hasChatted,
  lastMessageOf,
  loadChats,
  loadGroupCheckin,
  loadPartnerState,
  loadStreak,
  PARTNER_STORAGE_KEY,
  PERSONAS,
  recommendPersona,
  replyFor,
  saveChats,
  saveGroupCheckin,
  savePartnerState,
  saveStreak,
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

  it("round-trips the new per-persona shape under the partner storage key", () => {
    const state = {
      chats: {
        bima: [
          { from: "persona" as const, text: "Halo!", at: 1 },
          { from: "user" as const, text: "halo", at: 2 },
        ],
      },
      streak: 3,
      activeId: "bima",
    };
    savePartnerState(state);
    expect(store.has(PARTNER_STORAGE_KEY)).toBe(true);
    expect(loadPartnerState()).toEqual(state);
  });

  it("migrates the legacy { personaId, chat, streak } shape to per-persona chats", () => {
    store.set(
      PARTNER_STORAGE_KEY,
      JSON.stringify({
        personaId: "bima",
        chat: [{ from: "user", text: "saya susah tidur", at: 10 }],
        streak: 2,
      }),
    );
    expect(loadPartnerState()).toEqual({
      chats: { bima: [{ from: "user", text: "saya susah tidur", at: 10 }] },
      streak: 2,
      activeId: "bima",
    });
  });

  it("keeps two personas' chats separate", () => {
    const state = {
      chats: {
        rara: [{ from: "user" as const, text: "capek", at: 1 }],
        bima: [{ from: "user" as const, text: "tidur", at: 2 }],
      },
      streak: 1,
      activeId: "rara",
    };
    savePartnerState(state);
    const loaded = loadPartnerState();
    expect(loaded.chats.rara).toEqual(state.chats.rara);
    expect(loaded.chats.bima).toEqual(state.chats.bima);
    expect(loaded.chats.bima).not.toEqual(state.chats.rara);
  });

  it("falls back to default on corrupt JSON or unknown shape", () => {
    store.set(PARTNER_STORAGE_KEY, "{oops");
    expect(loadPartnerState()).toEqual({ chats: {}, streak: 0, activeId: null });
    store.set(PARTNER_STORAGE_KEY, JSON.stringify({ personaId: "ghost", chat: [], streak: 0 }));
    expect(loadPartnerState()).toEqual({ chats: {}, streak: 0, activeId: null });
  });

  it("sanitizes chats to known personas and valid messages", () => {
    store.set(
      PARTNER_STORAGE_KEY,
      JSON.stringify({
        chats: {
          ghost: [{ from: "user", text: "x", at: 1 }],
          bima: [
            { from: "user", text: "y", at: 2 },
            { from: "robot", text: "z", at: 3 },
            "nonsense",
          ],
        },
        streak: 0,
        activeId: "ghost",
      }),
    );
    const loaded = loadPartnerState();
    expect(loaded.chats.ghost).toBeUndefined();
    expect(loaded.chats.bima).toEqual([{ from: "user", text: "y", at: 2 }]);
    expect(loaded.activeId).toBeNull();
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

describe("loadChats / saveChats / loadStreak / saveStreak", () => {
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

  it("loadChats returns the chats portion of the new shape", () => {
    savePartnerState({
      chats: {
        bima: [{ from: "user" as const, text: "tidur", at: 1 }],
        sinta: [{ from: "persona" as const, text: "Hai!", at: 2 }],
      },
      streak: 4,
      activeId: "bima",
    });
    expect(loadChats()).toEqual({
      bima: [{ from: "user", text: "tidur", at: 1 }],
      sinta: [{ from: "persona", text: "Hai!", at: 2 }],
    });
  });

  it("loadChats migrates the legacy { personaId, chat } shape", () => {
    store.set(
      PARTNER_STORAGE_KEY,
      JSON.stringify({
        personaId: "bima",
        chat: [{ from: "user", text: "saya susah tidur", at: 10 }],
        streak: 2,
      }),
    );
    expect(loadChats()).toEqual({
      bima: [{ from: "user", text: "saya susah tidur", at: 10 }],
    });
  });

  it("loadChats returns {} when empty or corrupt", () => {
    expect(loadChats()).toEqual({});
    store.set(PARTNER_STORAGE_KEY, "{oops");
    expect(loadChats()).toEqual({});
  });

  it("saveChats updates chats without clobbering streak/activeId", () => {
    savePartnerState({
      chats: { rara: [{ from: "user" as const, text: "capek", at: 1 }] },
      streak: 5,
      activeId: "rara",
    });
    saveChats({
      rara: [{ from: "user", text: "capek", at: 1 }],
      bima: [{ from: "user", text: "tidur", at: 2 }],
    });
    const loaded = loadPartnerState();
    expect(loaded.chats.bima).toEqual([{ from: "user", text: "tidur", at: 2 }]);
    expect(loaded.chats.rara).toEqual([{ from: "user", text: "capek", at: 1 }]);
    expect(loaded.streak).toBe(5);
    expect(loaded.activeId).toBe("rara");
  });

  it("saveChats merges with chats already in storage", () => {
    savePartnerState({
      chats: { danu: [{ from: "user" as const, text: "gas", at: 1 }] },
      streak: 0,
      activeId: null,
    });
    saveChats({ danu: [{ from: "user", text: "gas", at: 1 }], bima: [{ from: "user", text: "tidur", at: 2 }] });
    expect(loadChats().danu).toEqual([{ from: "user", text: "gas", at: 1 }]);
  });

  it("loadStreak reads the streak without touching chats", () => {
    savePartnerState({
      chats: { bima: [{ from: "user" as const, text: "x", at: 1 }] },
      streak: 7,
      activeId: null,
    });
    expect(loadStreak()).toBe(7);
    expect(loadChats().bima).toEqual([{ from: "user", text: "x", at: 1 }]);
  });

  it("saveStreak updates streak without clobbering chats/activeId", () => {
    savePartnerState({
      chats: { bima: [{ from: "user" as const, text: "x", at: 1 }] },
      streak: 1,
      activeId: "bima",
    });
    saveStreak(2);
    const loaded = loadPartnerState();
    expect(loaded.streak).toBe(2);
    expect(loaded.chats.bima).toEqual([{ from: "user", text: "x", at: 1 }]);
    expect(loaded.activeId).toBe("bima");
  });

  it("loadStreak defaults to 0 on empty or corrupt storage", () => {
    expect(loadStreak()).toBe(0);
    store.set(PARTNER_STORAGE_KEY, "null");
    expect(loadStreak()).toBe(0);
  });
});

describe("lastMessageOf & hasChatted", () => {
  it("lastMessageOf returns the newest message by timestamp", () => {
    const chat = [
      { from: "persona" as const, text: "pertama", at: 100 },
      { from: "user" as const, text: "terbaru", at: 300 },
      { from: "persona" as const, text: "tengah", at: 200 },
    ];
    expect(lastMessageOf(chat)?.text).toBe("terbaru");
  });

  it("lastMessageOf returns null for an empty chat", () => {
    expect(lastMessageOf([])).toBeNull();
  });

  it("hasChatted is true only for personas with messages", () => {
    const state = {
      chats: { bima: [{ from: "user" as const, text: "halo", at: 1 }] },
      streak: 0,
      activeId: null,
    };
    expect(hasChatted(state, "bima")).toBe(true);
    expect(hasChatted(state, "rara")).toBe(false);
    expect(hasChatted({ chats: {}, streak: 0, activeId: null }, "bima")).toBe(false);
  });
});

describe("recommendPersona", () => {
  it("maps a high-impact sleep factor to Bima", () => {
    const persona = recommendPersona([{ id: "sleep", impact: "high" }]);
    expect(persona.id).toBe("bima");
  });

  it("maps a hydration factor to Danu and diet to Sinta", () => {
    expect(recommendPersona([{ id: "hydration", impact: "medium" }]).id).toBe("danu");
    expect(recommendPersona([{ id: "diet", impact: "medium" }]).id).toBe("sinta");
  });

  it("picks the highest-impact factor deterministically", () => {
    const persona = recommendPersona([
      { id: "diet", impact: "low" },
      { id: "sleep", impact: "high" },
      { id: "hydration", impact: "medium" },
    ]);
    expect(persona.id).toBe("bima");
  });

  it("defaults to Rara for unknown or empty factors", () => {
    expect(recommendPersona([{ id: "mystery", impact: "high" }]).id).toBe("rara");
    expect(recommendPersona([]).id).toBe("rara");
  });

  it("always returns one of the defined personas", () => {
    const ids = PERSONAS.map((p) => p.id);
    expect(ids).toContain(recommendPersona([]).id);
    expect(ids).toContain(recommendPersona([{ id: "stress", impact: "high" }]).id);
  });
});
