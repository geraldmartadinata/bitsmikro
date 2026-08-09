import { notFound } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { ClientPersonaChat } from "../../../components/client-persona-chat";
import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar";
import { PERSONAS } from "../../../lib/partner";

export default async function PersonaChatPage({
  params,
}: {
  params: Promise<{ personaId: string }>;
}) {
  const { personaId } = await params;
  const persona = PERSONAS.find((p) => p.id === personaId);
  if (!persona) notFound();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />

        <main>
          <div className="pt-16 sm:pt-20">
            <ClientPersonaChat persona={persona} />
          </div>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
