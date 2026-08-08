"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  ListChecks,
  Stethoscope,
} from "lucide-react";
import { Button } from "../components/ui/button";

type Bezier = [number, number, number, number];

const EASE: Bezier = [0.4, 0, 0.2, 1];
const DURATION = 0.6;

const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION, ease: EASE, delay },
  },
});

const staggerContainer = (stagger = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />

        <main>
          <Hero />
          <TrustStrip />
          <Features />
          <HowItWorks />
          <ClosingCta />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}

/* ------------------------------ Navbar ------------------------------ */

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-cream">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => scrollToId("hero")}
          className="flex items-center gap-2.5"
          aria-label="Zense - kembali ke atas"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-terracotta text-cream">
            <Activity className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-tight">Zense</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { label: "Fitur", href: "fitur" },
            { label: "Cara Kerja", href: "cara-kerja" },
            { label: "Tentang", href: "tentang" },
          ].map((link) => (
            <a
              key={link.href}
              href={`#${link.href}`}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          onClick={() => scrollToId("analyze")}
          className="rounded-md px-4 py-2 text-sm"
        >
          Coba Sekarang
        </Button>
      </div>
    </header>
  );
}

/* ------------------------------- Hero ------------------------------- */

function Hero() {
  return (
    <motion.section
      id="hero"
      className="bg-[#1d1e21] text-cream"
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
        <motion.span
          variants={fadeUp(0)}
          className="mb-6 inline-block rounded-md border border-terracotta/70 px-3 py-1 text-sm font-medium text-[#d29b63]"
        >
          Bukan diagnosis — panduan
        </motion.span>

        <motion.h1
          variants={fadeUp(0.1)}
          className="max-w-4xl font-display text-[42px] leading-[1.08] tracking-tight text-cream sm:text-6xl lg:text-[72px]"
        >
          Tanya - tanya gejala.
          <br />
          Dapat jawaban pola hidup.
        </motion.h1>

        <motion.p
          variants={fadeUp(0.2)}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70"
        >
          Kurang enak badan tapi nggak ngerti mulai dari mana? Zense
          menghubungkan gejala dengan kebiasaan harianmu — tidur, makan,
          hidrasi, stres — dan kasih rekomendasi yang bisa kamu mulai hari ini.
        </motion.p>

        <motion.div
          variants={fadeUp(0.3)}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            onClick={() => scrollToId("analyze")}
            className="rounded-md px-6 py-3 text-base"
          >
            Analisis Gejalaku
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href="#cara-kerja"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium text-cream/80 transition-colors hover:bg-white/10 hover:text-cream sm:w-auto"
          >
            Lihat cara kerja
          </a>
        </motion.div>

        <motion.div variants={fadeUp(0.4)} className="mt-14 w-full max-w-2xl">
          <HeroPreview />
        </motion.div>
      </div>
    </motion.section>
  );
}

function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-5 text-left shadow-lg">
      <div className="mb-4 flex items-center gap-2 text-cream/50">
        <span className="h-2 w-2 animate-pulse rounded-full bg-terracotta" />
        <span className="text-xs font-medium tracking-wide uppercase">
          Analisis hasil
        </span>
      </div>
      <div className="flex animate-pulse flex-col gap-3">
        <div className="h-4 w-2/3 rounded-md bg-white/15" />
        <div className="h-4 w-1/2 rounded-md bg-white/15" />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="h-16 rounded-md bg-white/10" />
          <div className="h-16 rounded-md bg-white/10" />
        </div>
      </div>
    </div>
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
        <span>Data tetap di perangkatmu</span>
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
  },
  {
    icon: ListChecks,
    title: "Rekomendasi Prioritas",
    description:
      "Langkah konkret dengan alasan di belakangnya, urut dari yang paling berdampak.",
  },
];

function Features() {
  return (
    <motion.section
      id="fitur"
      className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer(0.12)}
    >
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
        {features.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            variants={fadeUp(0)}
            className="card-surface flex flex-col gap-4 rounded-md p-7"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-terracotta/10 text-terracotta">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted">{description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
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
    <motion.section
      id="cara-kerja"
      className="border-y border-hairline bg-[#faf8f1]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(0.12)}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Cara kerjanya
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Tiga langkah sederhana — dari kata jadi rencana.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map(({ number, title, description }) => (
            <motion.div
              key={number}
              variants={fadeUp(0)}
              className="flex flex-col gap-3"
            >
              <span className="font-display text-6xl text-terracotta">
                {number}
              </span>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="leading-relaxed text-muted">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------------------- Closing CTA --------------------------- */

function ClosingCta() {
  return (
    <motion.section
      id="tentang"
      className="bg-[#1d1e21] text-cream"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer(0.1)}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center sm:px-6 sm:py-28">
        <motion.h2
          variants={fadeUp(0)}
          className="font-display text-4xl tracking-tight sm:text-5xl"
        >
          Mulai analisis sekarang
        </motion.h2>
        <motion.p variants={fadeUp(0)} className="mt-4 text-cream/70">
          Cerita 30 detik untuk mulai. Semua data tetap di perangkatmu.
        </motion.p>
        <motion.div variants={fadeUp(0)} className="mt-8">
          <Button
            onClick={() => scrollToId("analyze")}
            className="rounded-md px-6 py-3 text-base"
          >
            Coba Analisis Gejalaku
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ------------------------------ Footer ------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-hairline bg-[#faf8f1]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-terracotta text-cream">
              <Activity className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">Zense</span>
          </span>
          <p className="max-w-2xl text-xs leading-relaxed text-muted">
            Disclaimer: Zense memberikan panduan gaya hidup, bukan diagnosis
            medis. Informasi di sini tidak menggantikan nasihat, pemeriksaan,
            atau perawatan dari tenaga kesehatan profesional. Jika keluhan
            berlanjut atau memburuk, segera konsultasikan dengan dokter atau
            fasilitas kesehatan terdekat.
          </p>
          <p className="text-xs text-muted">
            Dibuat untuk Bitsmikro Innovative Vibecode 2026 · Tim &quot;.&quot;
          </p>
        </div>
      </div>
    </footer>
  );
}