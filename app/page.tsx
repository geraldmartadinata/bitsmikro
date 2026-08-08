import { Activity } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-cream px-6 py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-12">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-terracotta" />
            <span className="font-display text-5xl text-ink">Zense</span>
          </div>
          <p className="text-muted">Design system & UI primitives test page.</p>
        </header>

        <Section title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Card & Badge">
          <Card className="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>Neutral</Badge>
              <Badge variant="sage">Sage</Badge>
              <Badge variant="danger">Danger</Badge>
            </div>
            <p className="text-muted">
              Ini permukaan card yang memakai .card-surface — warm white,
              hairline border, dan bayangan lembut.
            </p>
          </Card>
        </Section>

        <Section title="Form fields">
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">Input</span>
              <Input placeholder="Akhir-akhir ini gampang capek..." />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink">Textarea</span>
              <Textarea placeholder="Ceritakan gejala dengan bahasa sehari-hari kamu." />
            </label>
          </div>
        </Section>
      </div>
    </main>
  );
}