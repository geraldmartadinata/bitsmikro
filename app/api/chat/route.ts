import { chatWithAI, type ChatTurn } from "../../../lib/ai";
import { PERSONAS } from "../../../lib/partner";

export const runtime = "nodejs";

function jsonError(status: number, error: string): Response {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request): Promise<Response> {
  let body: { personaId?: unknown; input?: unknown; history?: unknown };
  try {
    body = (await request.json()) as {
      personaId?: unknown;
      input?: unknown;
      history?: unknown;
    };
  } catch {
    return jsonError(400, "Request tidak valid.");
  }

  const personaId = typeof body.personaId === "string" ? body.personaId : "";
  if (!PERSONAS.some((p) => p.id === personaId)) {
    return jsonError(400, "Pendamping tidak dikenal.");
  }

  const input = typeof body.input === "string" ? body.input.trim() : "";
  if (input.length === 0) {
    return jsonError(400, "Pesan tidak boleh kosong.");
  }
  if (input.length > 500) {
    return jsonError(400, "Pesan terlalu panjang (maksimal 500 karakter).");
  }

  const history: ChatTurn[] = Array.isArray(body.history)
    ? body.history.filter(
        (m): m is ChatTurn =>
          typeof m === "object" &&
          m !== null &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string",
      )
    : [];

  const { reply, source } = await chatWithAI(personaId, input, history);
  return Response.json({ ok: true, reply, source });
}