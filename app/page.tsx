"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartPulse, ListChecks, Stethoscope } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Faq } from "../components/faq";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { Reveal } from "../components/ui/reveal";

const primaryLinkClasses =
  "inline-flex items-center justify-center gap-2 rounded-md bg-terracotta px-6 py-3 text-base font-medium text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-terracotta-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

export default function Page() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />

      <main>
        <Hero />
        <TrustStrip />
        <Features />
        <HowItWorks />
        <PartnerTeaser />
        <ClosingCta />
        <Faq />
      </main>

      <Footer />
    </div>
  );
}

/* ---------------------------- Trust strip --------------------------- */

function TrustStrip() {
  return (
    <div className="border-b border-hairline bg-cream">
      <Reveal y={12} className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-5 text-center text-sm text-muted sm:flex-row sm:gap-3">
        <span>Bukan diagnosis medis</span>
        <span className="hidden sm:inline-block" aria-hidden="true">
          ·
        </span>
        <span>Tanpa akun</span>
        <span className="hidden sm:inline-block" aria-hidden="true">
          ·
        </span>
        <span>Gratis</span>
      </Reveal>
    </div>
  );
}

/* --------------------------- How it works --------------------------- */

const steps = [
  {
    number: "01",
    title: "Ceritakan gejalamu",
    description:
      "Ketik yang kamu rasakan dengan bahasa yang paling alami — nggak perlu istilah medis.",
  },
  {
    number: "02",
    title: "AI memecah faktornya",
    description:
      "Gejala dihubungkan ke pola hidup: tidur, hidrasi, makan, dan stres.",
  },
  {
    number: "03",
    title: "Terima rekomendasi",
    description:
      "Langkah prioritas dengan reasoning, siap kamu praktikkan hari ini.",
  },
];

function HowItWorks() {
  return (
    <section id="cara-kerja" className="border-y border-hairline bg-[#faf8f1]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Cara kerjanya
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Tiga langkah sederhana — dari kata jadi rencana.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map(({ number, title, description }, i) => (
            <Reveal key={number} delay={i * 0.12}>
              <div className="card-surface group flex h-full flex-col gap-3 rounded-md p-6 transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-1 hover:border-terracotta/40 hover:shadow-[0_12px_32px_rgba(42,43,47,0.12)]">
                <span className="font-display text-6xl leading-none text-terracotta">
                  {number}
                </span>
                <span className="h-px w-24 bg-terracotta/60" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Partner teaser ------------------------- */

function PartnerTeaser() {
  return (
    <section id="partner" className="border-b border-hairline bg-[#faf8f1]">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-6 sm:py-24">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Tidak sendirian lagi
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Dapatkan pendamping yang punya fokus kesehatan sama, saling
          semangat tiap hari, dan check-in bareng di grup kecil.
        </p>
        <div className="mt-8">
          <Link href="/partner" className={primaryLinkClasses}>
            Temukan Pendamping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------- Closing CTA --------------------------- */

function ClosingCta() {
  return (
    <section id="tentang" className="relative overflow-hidden bg-[#1d1e21] text-cream">
      <Image
        src="/images/cta-analyze.webp"
        alt=""
        fill
        quality={50}
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

      <Reveal className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Mulai analisis sekarang
        </h2>
        <p className="mt-4 text-cream/80">
          Cerita 30 detik. Langkah kecil yang bisa langsung kamu mulai.
        </p>
        <div className="mt-8">
          <Link href="/analyze" className={primaryLinkClasses}>
            Coba Analisis Gejalaku
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}