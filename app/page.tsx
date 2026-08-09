"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, MotionConfig, type Variants } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  HeartPulse,
  ListChecks,
  Stethoscope,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { QuickAnswerCard } from "../components/quick-answer";

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

const primaryLinkClasses =
  "inline-flex items-center justify-center gap-2 rounded-md bg-terracotta px-6 py-3 text-base font-medium text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-terracotta-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

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
          <Faq />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}

/* ------------------------------- Hero ------------------------------- */

function Hero() {
  return (
    <motion.section
      id="hero"
      className="relative overflow-hidden bg-[#1d1e21] text-cream"
      initial="hidden"
      animate="visible"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.webp')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40"
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-28 text-center sm:px-6 sm:pt-32">
        <motion.span
          variants={fadeUp(0)}
          className="mb-6 inline-block rounded-full border border-terracotta/70 bg-black/20 px-3 py-1 text-sm font-medium text-[#e8a26a]"
        >
          Bukan diagnosis — panduan
        </motion.span>

        <motion.h1
          variants={fadeUp(0.1)}
          className="max-w-4xl font-display text-[42px] leading-[1.08] tracking-tight text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[72px]"
        >
          Tanya - tanya gejala.
          <br />
          Dapat jawaban pola hidup.
        </motion.h1>

        <motion.p
          variants={fadeUp(0.2)}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        >
          Kurang enak badan tapi nggak ngerti mulai dari mana? Zense
          menghubungkan gejala dengan kebiasaan harianmu — tidur, makan,
          hidrasi, stres — dan kasih rekomendasi yang bisa kamu mulai hari ini.
        </motion.p>

        <motion.div
          variants={fadeUp(0.3)}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/analyze" className={primaryLinkClasses}>
            Analisis Gejalaku
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#cara-kerja"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium text-cream/90 transition-colors hover:bg-white/10 hover:text-cream sm:w-auto"
          >
            Lihat cara kerja
          </a>
        </motion.div>

        <motion.div variants={fadeUp(0.4)} className="mt-12 w-full max-w-2xl">
          <QuickAnswerCard />
        </motion.div>
      </div>
    </motion.section>
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
      <motion.path
        d="M2 20 H22 L28 11 L36 32 L44 20 H78 L116 10"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    </svg>
  );
}

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
      <motion.div variants={fadeUp(0)} className="mb-12 text-center">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Kenapa Zense?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Bukan cuma jawaban singkat — kamu lihat alur berpikirnya dan tahu
          harus mulai dari mana.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description, sparkline }) => (
          <motion.div
            key={title}
            variants={fadeUp(0)}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: EASE } }}
            className="card-surface group flex flex-col gap-4 rounded-md p-7 transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(42,43,47,0.12)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta transition-shadow duration-200 group-hover:shadow-[0_0_20px_rgba(176,90,54,0.35)]">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </div>
            {sparkline ? <HeartbeatSparkline /> : null}
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
        <motion.div variants={fadeUp(0)} className="mb-12 text-center">
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
            Cara kerjanya
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Tiga langkah sederhana — dari kata jadi rencana.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map(({ number, title, description }) => (
            <motion.div
              key={number}
              variants={fadeUp(0)}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: EASE } }}
              className="card-surface group flex flex-col gap-3 rounded-md p-6 transition-[box-shadow,border-color] duration-200 hover:border-terracotta/40 hover:shadow-[0_12px_32px_rgba(42,43,47,0.12)]"
            >
              <span className="font-display text-6xl leading-none text-terracotta">
                {number}
              </span>
              <motion.span
                className="h-px w-24 origin-left bg-terracotta/60"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
              />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
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
          Cerita 30 detik. Semua data tetap di perangkatmu.
        </motion.p>
        <motion.div variants={fadeUp(0)} className="mt-8">
          <Link href="/analyze" className={primaryLinkClasses}>
            Coba Analisis Gejalaku
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* -------------------------------- FAQ ------------------------------- */

const faqs = [
  {
    q: "Apakah Zense bisa mendiagnosis penyakit?",
    a: "Tidak. Zense hanya menghubungkan gejala dengan pola hidup dan memberi panduan umum. Konsultasi dengan tenaga kesehatan untuk diagnosis.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Ya. Semua data tersimpan di perangkatmu (localStorage). Tidak dikirim ke server, tidak butuh akun.",
  },
  {
    q: "Apakah Zense gratis?",
    a: "Gratis. Tanpa biaya, tanpa langganan.",
  },
  {
    q: "Apakah partner Zense manusia sungguhan?",
    a: "Saat ini partner adalah pendamping (AI persona) yang tersimpan di perangkatmu. Fitur untuk terhubung dengan teman sungguhan sedang kami kembangkan.",
  },
  {
    q: "Siapa di balik Zense?",
    a: "Zense dikembangkan oleh Tim '.' untuk Bitsmikro Innovative Vibecode 2026.",
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <motion.section
      id="faq"
      className="mx-auto max-w-3xl px-5 py-20 sm:px-6 sm:py-28"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer(0.08)}
    >
      <motion.div variants={fadeUp(0)} className="mb-10 text-center">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Tanya dulu
        </h2>
        <p className="mt-3 text-muted">Pertanyaan yang sering muncul sebelum mulai.</p>
      </motion.div>

      <div className="flex flex-col gap-3">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={item.q}
              variants={fadeUp(0)}
              className="overflow-hidden rounded-md border border-hairline bg-surface transition-colors duration-200 hover:border-terracotta/30"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-ink">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-terracotta transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}