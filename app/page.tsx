import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartPulse, ListChecks, Stethoscope } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Faq } from "../components/faq";
import { QuickAnswerCard } from "../components/quick-answer";

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

/* ------------------------------- Hero ------------------------------- */

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#1d1e21] text-cream">
      <Image
        src="/images/hero.webp"
        alt=""
        fill
        priority
        quality={50}
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40"
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-28 text-center sm:px-6 sm:pt-32">
        <span className="mb-6 inline-block rounded-full border border-terracotta/70 bg-black/20 px-3 py-1 text-sm font-medium text-[#e8a26a]">
          Bukan diagnosis — panduan
        </span>

        <h1 className="max-w-4xl font-display text-[42px] leading-[1.08] tracking-tight text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[72px]">
          Tanya - tanya gejala.
          <br />
          Dapat jawaban pola hidup.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          Kurang enak badan tapi nggak ngerti mulai dari mana? Zense
          menghubungkan gejala dengan kebiasaan harianmu — tidur, makan,
          hidrasi, stres — dan kasih rekomendasi yang bisa kamu mulai hari ini.
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Link href="/analyze" className={`${primaryLinkClasses} w-full sm:w-auto`}>
            Analisis Gejalaku
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#cara-kerja"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium text-cream/90 transition-colors hover:bg-white/10 hover:text-cream sm:w-auto"
          >
            Lihat cara kerja
          </a>
        </div>

        <div className="mt-12 w-full max-w-2xl">
          <QuickAnswerCard />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Trust strip --------------------------- */

function TrustStrip() {
  return (
    <div className="border-b border-hairline bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-5 text-center text-sm text-muted sm:flex-row sm:gap-3">
        <span>Bukan diagnosis medis</span>
        <span className="hidden sm:inline-block" aria-hidden="true">
          ·
        </span>
        <span>Tanpa akun</span>
        <span className="hidden sm:inline-block" aria-hidden="true">
          ·
        </span>
        <span>Gratis</span>
      </div>
    </div>
  );
}

/* ----------------------------- Features ----------------------------- */

const features = [
  {
    icon: Stethoscope,
    title: "Analisis Gejala",
    description:
      "Ceritakan keluhan dengan bahasa sehari-hari. AI memecah kemungkinan faktor penyebabnya, satu demi satu.",
  },
  {
    icon: HeartPulse,
    title: "Koneksi Pola Hidup",
    description:
      "Diet, tidur, stres, dan hidrasi dilihat bersama-sama — bukan terpisah-pisah.",
    sparkline: true,
  },
  {
    icon: ListChecks,
    title: "Rekomendasi Prioritas",
    description:
      "Langkah konkret dengan alasan di belakangnya, urut dari yang paling berdampak.",
  },
];

function HeartbeatSparkline() {
  return (
    <svg
      viewBox="0 0 120 36"
      className="mt-auto h-9 w-full text-terracotta/60"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 20 H22 L28 11 L36 32 L44 20 H78 L116 10"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        className="z-draw"
      />
    </svg>
  );
}

function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
      <div className="mb-12 text-center">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Kenapa Zense?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Bukan cuma jawaban singkat — kamu lihat alur berpikirnya dan tahu
          harus mulai dari mana.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description, sparkline }) => (
          <div
            key={title}
            className="card-surface group flex flex-col gap-4 rounded-md p-7 transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(42,43,47,0.12)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta transition-shadow duration-200 group-hover:shadow-[0_0_20px_rgba(176,90,54,0.35)]">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </div>
            {sparkline ? <HeartbeatSparkline /> : null}
          </div>
        ))}
      </div>
    </section>
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
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Cara kerjanya
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Tiga langkah sederhana — dari kata jadi rencana.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map(({ number, title, description }) => (
            <div
              key={number}
              className="card-surface group flex flex-col gap-3 rounded-md p-6 transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-1 hover:border-terracotta/40 hover:shadow-[0_12px_32px_rgba(42,43,47,0.12)]"
            >
              <span className="font-display text-6xl leading-none text-terracotta">
                {number}
              </span>
              <span className="h-px w-24 bg-terracotta/60" />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </div>
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
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-6 sm:py-24">
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
      </div>
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

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-6 sm:py-28">
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
      </div>
    </section>
  );
}
