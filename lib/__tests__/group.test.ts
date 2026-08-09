import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  chatReplyForGroup,
  GROUP_MESSAGES_STORAGE_KEY,
  GROUP_NAME,
  GROUP_SEED,
  groupChitChat,
  groupReplyFor,
  loadGroupMessages,
  saveGroupMessages,
} from "../group";
import { PERSONAS } from "../partner";

describe("GROUP_SEED", () => {
  it("is deterministic with 4 seeded messages", () => {
    expect(GROUP_SEED).toHaveLength(4);
    expect(GROUP_SEED.map((m) => m.id)).toEqual(["seed-1", "seed-2", "seed-3", "seed-4"]);
    for (const m of GROUP_SEED) {
      expect(m.text.length).toBeGreaterThan(0);
      expect(PERSONAS.some((p) => p.id === m.from)).toBe(true);
      expect(typeof m.at).toBe("number");
    }
  });

  it("references known personas with matching names/emojis", () => {
    for (const m of GROUP_SEED) {
      const persona = PERSONAS.find((p) => p.id === m.from);
      expect(m.name).toBe(persona?.name);
      expect(m.emoji).toBe(persona?.emoji);
    }
  });
});

describe("groupReplyFor", () => {
  it("routes sleep topics to Bima", () => {
    const reply = groupReplyFor("aku susah tidur malam ini");
    expect(reply.personaId).toBe("bima");
    expect(reply.text.length).toBeGreaterThan(0);
  });

  it("routes food topics to Sinta and tired topics to Rara", () => {
    expect(groupReplyFor("pola makan mulai berantakan").personaId).toBe("sinta");
    expect(groupReplyFor("gampang capek hari ini").personaId).toBe("rara");
  });

  it("falls back to Danu for unmatched input and is deterministic", () => {
    const a = groupReplyFor("zxq random obrolan");
    expect(a.personaId).toBe("danu");
    expect(groupReplyFor("zxq random obrolan")).toEqual(a);
  });
});

describe("chatReplyForGroup", () => {
  it("chooses Bima for sleep and Rara otherwise, deterministically", () => {
    expect(chatReplyForGroup("tidurku berantakan").personaId).toBe("bima");
    expect(chatReplyForGroup("gampang capek nih").personaId).toBe("rara");
    expect(chatReplyForGroup("halo semua")).toEqual(chatReplyForGroup("halo semua"));
  });
});

describe("groupChitChat", () => {
  it("never returns the excluded persona", () => {
    for (let len = 0; len < 40; len++) {
      const input = "x".repeat(len + 1) + " capek";
      const reply = groupChitChat(input, "rara");
      expect(reply.personaId).not.toBe("rara");
    }
  });
});

describe("group messages storage", () => {
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

  it("round-trips messages under the group storage key", () => {
    const messages = GROUP_SEED;
    saveGroupMessages(messages);
    expect(store.has(GROUP_MESSAGES_STORAGE_KEY)).toBe(true);
    expect(loadGroupMessages()).toEqual(messages);
  });

  it("falls back to [] on corrupt JSON or non-array", () => {
    store.set(GROUP_MESSAGES_STORAGE_KEY, "{oops");
    expect(loadGroupMessages()).toEqual([]);
    store.set(GROUP_MESSAGES_STORAGE_KEY, '{"not":"array"}');
    expect(loadGroupMessages()).toEqual([]);
  });

  it("returns [] when window is unavailable", () => {
    vi.unstubAllGlobals();
    expect(loadGroupMessages()).toEqual([]);
  });

  it("exports the group name", () => {
    expect(GROUP_NAME).toBe("Grup Bugar Pagi");
  });
});