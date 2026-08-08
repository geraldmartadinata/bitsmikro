import { analyzeSymptoms, MockProvider } from "../../../lib/ai";
import type { AnalysisResult } from "../../../types/analysis";

export const runtime = "nodejs";

const MIN_CHARS = 10;

function jsonError(status: number, error: string): Response {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request): Promise<Response> {
  let body: { input?: unknown };
  try {
    body = (await request.json()) as { input?: unknown };
  } catch {
    return jsonError(400, "Request tidak valid.");
  }

  const raw = typeof body.input === "string" ? body.input : "";
  const input = raw.trim();

  if (input.length === 0) {
    return jsonError(400, "Masukkan gejala kamu terlebih dahulu.");
  }
  if (input.length < MIN_CHARS) {
    return jsonError(400, `Tulis minimal ${MIN_CHARS} karakter agar analisis lebih akurat.`);
  }

  const provider = process.env.AI_PROVIDER ?? "mock";

  try {
    const result = await analyzeSymptoms(input);
    return Response.json({ ok: true, result });
  } catch (err) {
    console.error("Analyze route failed", err);
    if (provider === "openai-compatible") {
      try {
        const result: AnalysisResult = await analyzeSymptoms(input, new MockProvider());
        return Response.json({ ok: true, result, fellBack: true });
      } catch {
        return jsonError(500, "Analisis gagal. Coba lagi.");
      }
    }
    return jsonError(500, "Analisis gagal. Coba lagi.");
  }
}