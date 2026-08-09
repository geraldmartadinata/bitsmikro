import type {
  AnalysisResult,
  Factor,
  PrioritizedAction,
  Severity,
} from "../types/analysis";

export interface AIProvider {
  analyze(input: string): Promise<AnalysisResult>;
}

const DISCLAIMER =
  "Ini bukan diagnosis medis — jika keluhan berlanjut atau memburuk, konsultasikan dengan tenaga kesehatan.";

const mockScenarioTired: AnalysisResult = {
  summary:
    "Gejala mudah capek dan sulit fokus paling sering berkaitan dengan kualitas tidur, keseimbangan cairan, dan pola makan. Berikut perkiraan faktor yang berpengaruh.",
  factors: [
    {
      id: "sleep",
      name: "Kualitas tidur",
      impact: "high",
      reasoning:
        "Tidur di bawah 6 jam atau sering terbangun membuat tubuh sulit memulihkan energi dan otak kesulitan mempertahankan fokus.",
      suggestion:
        "Tetapkan waktu tidur dan bangun yang konsisten, targetkan minimal 7 jam per malam.",
    },
    {
      id: "hydration",
      name: "Hidrasi",
      impact: "medium",
      reasoning:
        "Dehidrasi ringan (kurang 1-2% cairan tubuh) sudah cukup menurunkan energi dan konsentrasi.",
      suggestion:
        "Minum 250-300 ml air saat bangun tidur, lalu jadwalkan minum rutin sepanjang hari.",
    },
    {
      id: "diet",
      name: "Pola makan",
      impact: "medium",
      reasoning:
        "Melewatkan makan atau menu yang didominasi karbohidrat cepat membuat energi turun di tengah hari.",
      suggestion:
        "Tambah protein dan sayur pada makan siang, kurangi camilan tinggi gula.",
    },
  ],
  prioritizedActions: [
    {
      action: "Perbaiki tidur dulu — 7 jam dengan jam bangun tetap",
      reason: "Tidur adalah faktor terbesar untuk pemulihan energi dan fokus.",
      priority: 1,
    },
    {
      action: "Cek hidrasi harian",
      reason: "Dehidrasi ringan memperburuk rasa lemas dan sulit fokus.",
      priority: 2,
    },
    {
      action: "Kurangi gula & makan lebih seimbang",
      reason: "Energi yang stabil menopang fokus sampai sore.",
      priority: 3,
    },
  ],
  disclaimer: DISCLAIMER,
};

const mockScenarioDizzy: AnalysisResult = {
  summary:
    "Pusing atau keluhan di area kepala sering dikaitkan dengan hidrasi, intensitas layar, dan keteraturan makan. Ini perkiraan faktor yang paling mungkin.",
  factors: [
    {
      id: "hydration",
      name: "Hidrasi",
      impact: "high",
      reasoning:
        "Kurang minum membuat tubuh dehidrasi ringan dan kepala terasa ringan, terutama saat siang hari.",
      suggestion: "Konsumsi air minimal 1,5-2 liter sehari secara terdistribusi.",
    },
    {
      id: "screen-time",
      name: "Screen time",
      impact: "medium",
      reasoning:
        "Menatap layar berjam-jam memicu ketegangan mata dan pusing berkepanjangan.",
      suggestion:
        "Terapkan aturan 20-20-20: setiap 20 menit, pandang objek jauh selama 20 detik.",
    },
    {
      id: "meal-schedule",
      name: "Jadwal makan",
      impact: "medium",
      reasoning:
        "Jeda makan yang terlalu lama membuat gula darah turun dan kepala lebih mudah pusing.",
      suggestion:
        "Makan 3 porsi utama plus 1 snack sehat agar gula darah lebih stabil.",
    },
  ],
  prioritizedActions: [
    {
      action: "Perbaiki hidrasi harian",
      reason:
        "Dehidrasi adalah penyebab pusing paling umum dan paling cepat diperbaiki.",
      priority: 1,
    },
    {
      action: "Kurangi layar dengan break teratur",
      reason: "Screen time yang panjang membuat mata lelah dan pusing lebih cepat datang.",
      priority: 2,
    },
    {
      action: "Jadwalkan makan lebih teratur",
      reason: "Gula darah yang turun memperparah kepala pusing menjelang sore.",
      priority: 3,
    },
  ],
  disclaimer: DISCLAIMER,
};

const mockScenarioStomach: AnalysisResult = {
  summary:
    "Ketidaknyamanan perut sering berhubungan dengan pola makan, kafein, dan tingkat stres. Berikut faktor yang diduga berpengaruh.",
  factors: [
    {
      id: "diet",
      name: "Pola makan",
      impact: "high",
      reasoning:
        "Makanan terlalu pedas, berlemak, atau jadwal makan tidak teratur dapat mengiritasi lambung.",
      suggestion:
        "Makan dalam porsi kecil tapi sering, dan jangan langsung berbaring setelah makan.",
    },
    {
      id: "caffeine",
      name: "Kafein",
      impact: "medium",
      reasoning:
        "Kafein berlebih (3+ gelas kopi) bisa menstimulasi produksi asam lambung dan membuat perut tidak nyaman.",
      suggestion: "Batasi kafein maksimal 2 gelas, hindari kopi di sore hari.",
    },
    {
      id: "stress",
      name: "Stres",
      impact: "low",
      reasoning:
        "Stres memicu respons tubuh yang bisa meningkatkan produksi asam lambung.",
      suggestion:
        "Sisihkan 5 menit latihan pernapasan setelah pulang kerja.",
    },
  ],
  prioritizedActions: [
    {
      action: "Atur ulang porsi & jadwal makan",
      reason: "Pola makan adalah faktor terbesar terhadap kenyamanan perut.",
      priority: 1,
    },
    {
      action: "Kurangi kafein di sore hari",
      reason: "Kafein berkurang membantu menenangkan lambung menjelang malam.",
      priority: 2,
    },
    {
      action: "Kelola stres ringan",
      reason: "Stres memperbesar ketidaknyamanan perut meski makanan sudah sehat.",
      priority: 3,
    },
  ],
  disclaimer: DISCLAIMER,
};

const mockScenarioFallback: AnalysisResult = {
  summary:
    "Terima kasih sudah berbagi. Gejala yang kamu rasakan bisa menarik karena mencakup faktor gaya hidup umum: tidur, hidrasi, dan keteraturan makan. Berikut langkah yang bisa dicoba.",
  factors: [
    {
      id: "sleep",
      name: "Kualitas tidur",
      impact: "medium",
      reasoning:
        "Kualitas tidur yang kurang sering jadi dasar dari energi dan suasana hati yang tidak enak.",
      suggestion: "Bangun di jam yang sama setiap hari, kamar gelap dan sejuk.",
    },
    {
      id: "hydration",
      name: "Hidrasi",
      impact: "medium",
      reasoning:
        "Banyak keluhan ringan membaik hanya dengan asupan cairan yang cukup.",
      suggestion: "Segera minum air lebih awal di hari ketimbang menunggu haus.",
    },
    {
      id: "diet",
      name: "Keteraturan makan",
      impact: "medium",
      reasoning:
        "Pola makan yang tidak teratur membuat gula darah tidak stabil seharian.",
      suggestion:
        "Sediakan tiga waktu makan sehat per hari plus satu snack sehat.",
    },
  ],
  prioritizedActions: [
    {
      action: "Naikkan durasi tidur secara bertahap",
      reason: "Tidur cukup memengaruhi hampir seluruh aspek perasaan sehat.",
      priority: 1,
    },
    {
      action: "Jaga hidrasi lebih berpola",
      reason:
        "Cairan yang cukup adalah dasar utama dari perasaan enak badan.",
      priority: 2,
    },
    {
      action: "Rapkan jadwal makan & menu",
      reason: "Pola makan teratur memberi energi yang stabil menuju malam.",
      priority: 3,
    },
  ],
  disclaimer: DISCLAIMER,
};

interface MockScenario {
  match: (input: string) => boolean;
  result: AnalysisResult;
}

const TIRED_KEYWORDS = [
  "capek",
  "lelah",
  "lemas",
  "fokus",
  "tired",
  "letharg",
  "fatigue",
  "ngantuk",
  "kurang tidur",
  "sulit fokus",
];
const DIZZY_KEYWORDS = [
  "pusing",
  "kepala",
  "sakit kepala",
  "puyeng",
  "dizzy",
  "headache",
];
const STOMACH_KEYWORDS = [
  "perut",
  "lambung",
  "mual",
  "kembung",
  "mag",
  "indigestion",
  "gastritis",
];

const scenarios: readonly MockScenario[] = [
  {
    match: (input) => TIRED_KEYWORDS.some((k) => input.includes(k)),
    result: mockScenarioTired,
  },
  {
    match: (input) => DIZZY_KEYWORDS.some((k) => input.includes(k)),
    result: mockScenarioDizzy,
  },
  {
    match: (input) => STOMACH_KEYWORDS.some((k) => input.includes(k)),
    result: mockScenarioStomach,
  },
];

function randomDelay(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export class MockProvider implements AIProvider {
  private readonly delayRange: [number, number];

  constructor(options: { delayRangeMs?: [number, number] } = {}) {
    this.delayRange = options.delayRangeMs ?? [1800, 2500];
  }

  async analyze(input: string): Promise<AnalysisResult> {
    await sleep(randomDelay(this.delayRange[0], this.delayRange[1]));
    const normalized = input.toLowerCase();
    const scenario =
      scenarios.find((s) => s.match(normalized)) ?? {
        match: () => true,
        result: mockScenarioFallback,
      };
    return structuredClone(scenario.result);
  }
}

const SYSTEM_PROMPT = `You are Zense, a warm lifestyle-and-wellbeing guide for Indonesian users.
Tone: empathetic, calm, supportive, and non-judgemental. Never sound clinical or alarmist.
IMPORTANT — NEVER give a medical diagnosis. Your response is lifestyle advice only. Always include a "disclaimer" field: this is advice, not a medical diagnosis, and the user should consult a health professional if symptoms persist or worsen.
Analyze the user's complaint in terms of daily habits: sleep, hydration, diet, stress, and screen time.
Respond STRICTLY with a single JSON object matching this schema (no markdown fences, no extra text):
{
  "summary": string,
  "factors": [{ "id": string, "name": string, "impact": "low"|"medium"|"high", "reasoning": string, "suggestion": string }],
  "prioritizedActions": [{ "action": string, "reason": string, "priority": number }],
  "disclaimer": string
}
If the user's message clearly describes an emergency (chest pain, difficulty breathing, heavy bleeding, paralysis, fainting), include a "redFlag" field: { "message": string, "emergency": string }.`;

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid analysis response: "${field}" is missing or empty`);
  }
  return value;
}

function isSeverity(value: unknown): value is Severity {
  return value === "low" || value === "medium" || value === "high";
}

function parseFactor(raw: unknown): Factor {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid AI response: a factor is not an object");
  }
  const f = raw as Record<string, unknown>;
  if (!isSeverity(f.impact)) {
    throw new Error("Invalid AI response: factor.impact is not 'low'|'medium'|'high'");
  }
  return {
    id: requireString(f.id, "factor.id"),
    name: requireString(f.name, "factor.name"),
    impact: f.impact,
    reasoning: requireString(f.reasoning, "factor.reasoning"),
    suggestion: requireString(f.suggestion, "factor.suggestion"),
  };
}

function parseAction(raw: unknown): PrioritizedAction {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid AI response: a prioritizedAction is not an object");
  }
  const a = raw as Record<string, unknown>;
  if (typeof a.priority !== "number") {
    throw new Error("Invalid AI response: prioritizedAction.priority is not a number");
  }
  return {
    action: requireString(a.action, "prioritizedAction.action"),
    reason: requireString(a.reason, "prioritizedAction.reason"),
    priority: a.priority,
  };
}

function parseAnalysisResult(raw: unknown): AnalysisResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid AI response: body is not an object");
  }
  const r = raw as Record<string, unknown>;
  const result: AnalysisResult = {
    summary: requireString(r.summary, "summary"),
    factors: Array.isArray(r.factors) ? r.factors.map(parseFactor) : [],
    prioritizedActions: Array.isArray(r.prioritizedActions)
      ? r.prioritizedActions.map(parseAction)
      : [],
    disclaimer: requireString(r.disclaimer, "disclaimer"),
  };
  if (r.redFlag !== undefined && r.redFlag !== null) {
    const rf = r.redFlag as Record<string, unknown>;
    result.redFlag = {
      message: requireString(rf.message, "redFlag.message"),
      emergency: requireString(rf.emergency, "redFlag.emergency"),
    };
  }
  return result;
}

export function extractJson(content: string): unknown {
  const cleaned = content.replace(/```json|```/g, "").trim();

  // Fast path: the model was asked for strict JSON — try parsing as-is.
  try {
    return JSON.parse(cleaned);
  } catch {
    // fall through to brace-scan extraction
  }

  // Balanced-brace scan that respects strings and escape sequences.
  const start = cleaned.indexOf("{");
  if (start === -1) {
    throw new Error("Invalid AI response: no JSON object found");
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) {
    throw new Error("Invalid AI response: unbalanced JSON object");
  }

  const candidate = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    throw new Error("Invalid AI response: JSON object could not be parsed");
  }
}

export class OpenAICompatibleProvider implements AIProvider {
  async analyze(input: string): Promise<AnalysisResult> {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = (process.env.AI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    if (!apiKey) {
      throw new Error("AI_API_KEY is required when AI_PROVIDER=openai-compatible");
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input },
        ],
        temperature: 0.4,
        // Ask the endpoint for strict JSON output (supported by Gemini's
        // OpenAI-compatible API and OpenAI) — removes prose/markdown noise.
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("AI request returned no content");
    }
    return parseAnalysisResult(extractJson(content));
  }
}

export function createProvider(providerName: string): AIProvider {
  switch (providerName) {
    case "openai-compatible":
      return new OpenAICompatibleProvider();
    case "mock":
    default:
      return new MockProvider();
  }
}

export async function analyzeSymptoms(
  input: string,
  provider?: AIProvider,
): Promise<AnalysisResult> {
  const resolved = provider ?? createProvider(process.env.AI_PROVIDER ?? "mock");
  return resolved.analyze(input);
}