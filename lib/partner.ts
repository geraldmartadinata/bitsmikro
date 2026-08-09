import type { Severity } from "../types/analysis";

export type Energy = "high" | "calm" | "fun";

export interface Persona {
  id: string;
  name: string;
  tagline: string;
  focus: string;
  color: string;
  emoji: string;
  energy: Energy;
}

export interface ChatMessage {
  from: "user" | "persona";
  text: string;
  at: number;
}

export interface PartnerState {
  personaId: string | null;
  chat: ChatMessage[];
  streak: number;
}

export interface PartnerReply {
  text: string;
  continuing: boolean;
}

export const PERSONAS: Persona[] = [
  {
    id: "rara",
    name: "Rara",
    tagline: "Biar energimu naik tiap hari — gerak dulu, drama belakangan.",
    focus: "Energi & gerak",
    color: "sage",
    emoji: "🏃",
    energy: "high",
  },
  {
    id: "bima",
    name: "Bima",
    tagline: "Tidur nyenyak bukan bonus — ini bagian dari rencana.",
    focus: "Tidur & disiplin",
    color: "terracotta",
    emoji: "🧘",
    energy: "calm",
  },
  {
    id: "sinta",
    name: "Sinta",
    tagline: "Makan enak yang menyehatkan — seru, bukan siksaan.",
    focus: "Makanan & nutrisi",
    color: "amber",
    emoji: "🥗",
    energy: "fun",
  },
  {
    id: "danu",
    name: "Danu",
    tagline: "Satu hari saja sudah menang. Lanjut terus, jangan putus.",
    focus: "Semangat & streak",
    color: "ink",
    emoji: "🔥",
    energy: "high",
  },
];

export const PARTNER_STORAGE_KEY = "zense_partner";
export const GROUP_STORAGE_KEY = "zense_group_checkin";

interface PersonaLines {
  sleep: string;
  diet: string;
  energy: string;
  stress: string;
  generic: string;
  farewell: string;
  greeting: string;
}

const LINES: Record<string, PersonaLines> = {
  rara: {
    sleep: "Kurang tidur bikin energi kamu drop di pagi hari. Coba matikan lampu 30 menit lebih awal — besok rasakan bedanya!",
    diet: "Asupan yang bikin energi naik-turun itu musuh utama. Tambah protein + sayur, kurangi gula — tubuh langsung bilang makasih.",
    energy: "Capek itu sinyal buat gerak lebih sering, bukan diam lebih lama. Jalan 15 menit dulu — energimu bakal ngikutin.",
    stress: "Pusing dan tegang sering datang dari pikiran yang berputar terus. Tarik napas 4 detik, lepas 6 detik — ulangi 5x.",
    generic: "Aku di sini nemenin langkah kecilmu hari ini. Ceritain aja, kita cari jalannya bareng.",
    farewell: "Sampai nanti ya! Satu langkah hari ini sudah cukup. Aku tetep bangga sama kamu.",
    greeting: "Halo! Aku Rara — teman buat jaga energi dan gerak kamu. Gimana hari kamu?",
  },
  bima: {
    sleep: "Tidur itu pondasi segalanya. Coba tetapkan jam tidur yang sama semalam ini — konsistensi lebih penting dari durasi.",
    diet: "Makan terlalu malam bisa ganggu tidurmu. Coba makan terakhir 3 jam sebelum tidur, biar tubuh punya waktu beres-beres.",
    energy: "Kalau capek melulu padahal tidur cukup, cek rutinitas pagimu. Bangun di jam yang sama setiap hari bantu ritme tubuh.",
    stress: "Pikiran yang tegang bikin malam terasa panjang. Tulis 3 hal yang kamu syukuri sebelum tidur — otak jadi lebih tenang.",
    generic: "Sabar. Perubahan kecil yang konsisten selalu mengalahkan usaha besar yang sebentar.",
    farewell: "Sampai jumpa. Jangan lupa jaga jadwal tidurmu — itu janji paling penting hari ini.",
    greeting: "Halo, aku Bima. Fokusku jaga disiplin dan tidurmu. Ceritakan hari ini.",
  },
  sinta: {
    sleep: "Tidur dan makan itu pasangan serasi. Kopi sore bisa bikin kamu berguling-guling — ganti dengan teh herbal, lebih seru.",
    diet: "Makan enak boleh banget! Isi setengah piring dengan sayur + protein, sisanya bebas. Nutrisi nggak harus membosankan.",
    energy: "Merasa lemas? Coba cek warna piringmu — makin warna-warni, makin banyak nutrisi yang masuk.",
    stress: "Pusing dan stres bikin kita lapar palsu. Minum air dulu, tunggu 10 menit, baru putuskan mau ngemil apa.",
    generic: "Seru kan eksplorasi makanan sehat? Tanya aja apa pun yang kamu penasaran, kita cari tahu bareng.",
    farewell: "Dahh! Semoga menu besok makin seru dan sehat. Aku tunggu ceritanya ya!",
    greeting: "Hai! Aku Sinta — partner kuliner sehatmu. Mau mulai dari mana?",
  },
  danu: {
    sleep: "Tidur nyenyak = bahan bakar streak kamu. Satu malam yang baik, satu hari yang kuat.",
    diet: "Makan yang benar bikin streak kamu nggak gampang putus. Protein di pagi hari, gas di siang.",
    energy: "Lelah itu sementara, streak itu selamanya. Jangan berhenti di hari berat — jalan pelan tetap maju.",
    stress: "Pusing-pusing begini normal. Ambil jeda 5 menit, tarik napas, terus gas lagi.",
    generic: "Aku nggak peduli seberapa besar langkahmu — yang penting kamu nggak berhenti. Semangat!",
    farewell: "Sampai nanti, juara! Satu hari lagi masuk streak-mu. Jangan putus!",
    greeting: "Halo! Aku Danu, pemantik semangatmu. Siap lanjut streak hari ini?",
  },
};

const SLEEP_KEYWORDS = ["tidur", "sleep", "ngantuk", "insomnia", "pulas", "malam", "bangun"];
const DIET_KEYWORDS = ["makan", "diet", "nutrisi", "minum", "air", "gula", "sayur", "kafein", "makanan"];
const ENERGY_KEYWORDS = ["capek", "lelah", "lemas", "energi", "fokus", "gerak", "olahraga", "jalan", "stamina"];
const STRESS_KEYWORDS = ["pusing", "stres", "stress", "tegang", "cemas", "gelisah"];

const FAREWELL_RE = /\b(bye|sampai|dadah|makasih|terima kasih|terimakasih|sampai jumpa)\b/;
const GREETING_RE = /\b(halo|hai|hey|hii)\b/;

type Topic = "sleep" | "diet" | "energy" | "stress" | "generic";

function pickTopic(text: string): Topic {
  if (SLEEP_KEYWORDS.some((k) => text.includes(k))) return "sleep";
  if (DIET_KEYWORDS.some((k) => text.includes(k))) return "diet";
  if (ENERGY_KEYWORDS.some((k) => text.includes(k))) return "energy";
  if (STRESS_KEYWORDS.some((k) => text.includes(k))) return "stress";
  return "generic";
}

export function replyFor(text: string, personaId: string): PartnerReply {
  const lines = LINES[personaId] ?? LINES[PERSONAS[0].id];
  const t = text.toLowerCase().trim();

  if (FAREWELL_RE.test(t)) {
    return { text: lines.farewell, continuing: false };
  }
  if (GREETING_RE.test(t)) {
    return { text: lines.greeting, continuing: false };
  }
  return { text: lines[pickTopic(t)], continuing: true };
}

export function personaGreeting(personaId: string): string {
  return replyFor("halo", personaId).text;
}

const FACTOR_PERSONA: Record<string, string> = {
  sleep: "bima",
  tidur: "bima",
  diet: "sinta",
  nutrition: "sinta",
  makanan: "sinta",
  "meal-schedule": "sinta",
  caffeine: "sinta",
  stress: "rara",
  capek: "rara",
  lelah: "rara",
  energy: "rara",
  "screen-time": "rara",
  hydration: "danu",
  hidrasi: "danu",
};

const IMPACT_ORDER: Record<Severity, number> = { high: 3, medium: 2, low: 1 };

export function recommendPersona(
  factors: { id: string; impact: Severity }[],
): Persona {
  let best: { id: string; impact: Severity } | null = null;
  for (const factor of factors) {
    if (
      best === null ||
      IMPACT_ORDER[factor.impact] > IMPACT_ORDER[best.impact]
    ) {
      best = factor;
    }
  }
  const personaId = best ? FACTOR_PERSONA[best.id] ?? "rara" : "rara";
  return PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0];
}

const DEFAULT_STATE: PartnerState = { personaId: null, chat: [], streak: 0 };

export function loadPartnerState(): PartnerState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(PARTNER_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return { ...DEFAULT_STATE };
    const p = parsed as Record<string, unknown>;
    const personaId = PERSONAS.some((x) => x.id === p.personaId)
      ? (p.personaId as string)
      : null;
    const chat = Array.isArray(p.chat)
      ? p.chat.filter(
          (m): m is ChatMessage =>
            typeof m === "object" &&
            m !== null &&
            typeof m.text === "string" &&
            (m.from === "user" || m.from === "persona") &&
            typeof m.at === "number",
        )
      : [];
    const streak = typeof p.streak === "number" && p.streak >= 0 ? p.streak : 0;
    return { personaId, chat, streak };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function savePartnerState(state: PartnerState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function loadGroupCheckin(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(GROUP_STORAGE_KEY);
    const n = raw ? Number(raw) : 0;
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(4, Math.round(n)));
  } catch {
    return 0;
  }
}

export function saveGroupCheckin(count: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GROUP_STORAGE_KEY, String(Math.max(0, Math.min(4, Math.round(count)))));
  } catch {
    /* storage unavailable — ignore */
  }
}