"use client";

import dynamic from "next/dynamic";
import type { Persona } from "../lib/partner";

const PersonaChat = dynamic(() => import("./persona-chat").then((m) => m.PersonaChat), {
  ssr: false,
  loading: () => <p className="py-24 text-center text-sm text-muted">Memuat…</p>,
});

export function ClientPersonaChat({ persona }: { persona: Persona }) {
  return <PersonaChat persona={persona} />;
}