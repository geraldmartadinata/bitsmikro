import { PERSONAS } from "./partner";

export const GROUP_NAME = "Grup Bugar Pagi";

export interface GroupMessage {
  id: string;
  from: string;
  name: string;
  emoji: string;
  text: string;
  at: number;
}

const SEED_AT = Date.now() - 24 * 3600 * 1000;

const SEED_TEXTS: { personaId: string; text: string }[] = [
  {
    personaId: "rara",
    text: "Halo semua! Semangat hari ini — kita mulai dari gerak ringan dulu ya! 🏃",
  },
  {
    personaId: "bima",
    text: "Selamat pagi. Semoga tidur kalian nyenyak semalam. Mari jaga ritme. 🧘",
  },
  {
    personaId: "sinta",
    text: "Hai-hai! Jangan lupa sarapan bergizi, tim! 🥗",
  },
  {
    personaId: "danu",
    text: "Streak kita nggak boleh putus. Gas terus, jangan berhenti! 🔥",
  },
];

export const GROUP_SEED: GroupMessage[] = SEED_TEXTS.map((entry, i) => {
  const persona = PERSONAS.find((p) => p.id === entry.personaId) ?? PERSONAS[0];
  return {
    id: `seed-${i + 1}`,
    from: persona.id,
    name: persona.name,
    emoji: persona.emoji,
    text: entry.text,
    at: SEED_AT + i * 60_000,
  };
});

const GROUP_REPLIES: Record<string, string[]> = {
  bima: [
    "Aku juga lagi jaga jam tidurku, semangat!",
    "Tidur nyenyak itu investasi, bener banget.",
    "Coba matikan layar 30 menit lebih awal malam ini.",
  ],
  sinta: [
    "Aku juga lagi jaga pola makanku 😄",
    "Sarapan protein dulu, baru ngobrol sehat.",
    "Gula dikit, sayur banyak — setuju!",
  ],
  rara: [
    "Energiku juga naik kalau gerak pagi!",
    "Ayo jalan kaki bentar, biar semangat bareng.",
    "Capek itu wajar, istirahat singkat lalu lanjut!",
  ],
  danu: [
    "Gas pol! Jangan putus streak kita.",
    "Satu hari aja udah menang. Lanjut terus!",
    "Semangatnya nular nih, bagus!",
  ],
};

const SLEEP_KEYWORDS = ["tidur", "sleep", "ngantuk", "insomnia", "pulas", "malam"];
const EAT_KEYWORDS = ["makan", "diet", "nutrisi", "sarapan", "makanan", "gula", "sayur"];
const TIRED_KEYWORDS = ["capek", "lelah", "lemas", "energi", "fokus", "stres", "pusing"];

function topicPersona(text: string): string {
  const t = text.toLowerCase();
  if (SLEEP_KEYWORDS.some((k) => t.includes(k))) return "bima";
  if (EAT_KEYWORDS.some((k) => t.includes(k))) return "sinta";
  if (TIRED_KEYWORDS.some((k) => t.includes(k))) return "rara";
  return "danu";
}

export function groupReplyFor(text: string): { personaId: string; text: string } {
  const personaId = topicPersona(text);
  const lines = GROUP_REPLIES[personaId];
  return { personaId, text: lines[text.length % lines.length] };
}

export function chatReplyForGroup(input: string): { personaId: string; text: string } {
  const t = input.toLowerCase();
  const personaId = SLEEP_KEYWORDS.some((k) => t.includes(k)) ? "bima" : "rara";
  return { personaId, text: input };
}

export function groupChitChat(
  input: string,
  excludePersonaId: string,
): { personaId: string; text: string } {
  const reply = groupReplyFor(input);
  if (reply.personaId !== excludePersonaId) return reply;
  const idx = PERSONAS.findIndex((p) => p.id === reply.personaId);
  const next = PERSONAS[(idx + 1) % PERSONAS.length];
  const lines = GROUP_REPLIES[next.id];
  return { personaId: next.id, text: lines[input.length % lines.length] };
}

export const GROUP_MESSAGES_STORAGE_KEY = "zense_group_messages";

export function loadGroupMessages(): GroupMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GROUP_MESSAGES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is GroupMessage =>
        typeof m === "object" &&
        m !== null &&
        typeof m.id === "string" &&
        typeof m.from === "string" &&
        typeof m.text === "string" &&
        typeof m.at === "number",
    );
  } catch {
    return [];
  }
}

export function saveGroupMessages(messages: GroupMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GROUP_MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* storage unavailable — ignore */
  }
}