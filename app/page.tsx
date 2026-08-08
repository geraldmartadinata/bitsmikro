"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig, type Variants } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  HeartPulse,
  ListChecks,
  Stethoscope,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { AnalyzeSection } from "../components/analyze-section";

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
          <AnalyzeSection />
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

/* ------------------------------ Navbar ------------------------------ */

const NAV_LINKS = [
  { label: "Fitur", href: "fitur" },
  { label: "Cara Kerja", href: "cara-kerja" },
  { label: "Tentang", href: "tentang" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-1/2 top-4 z-50 w-full max-w-5xl -translate-x-1/2 px-4 sm:px-6">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`flex h-14 items-center justify-between gap-3 rounded-full border px-4 backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 sm:px-6 ${
          scrolled
            ? "border-hairline bg-cream/95 shadow-[0_6px_24px_rgba(42,43,47,0.12)]"
            : "border-hairline bg-cream/85 shadow-[0_4px_20px_rgba(42,43,47,0.08)]"
        } hover:border-terracotta/40`}
      >
        <button
          onClick={() => scrollToId("hero")}
          className="flex items-center gap-2.5"
          aria-label="Zense - ke atas"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-cream">
            <Activity className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-tight">Zense</span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={`#${link.href}`}
              className="relative text-sm font-medium text-muted transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-terracotta after:transition-transform after:duration-200 hover:text-ink hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          onClick={() => scrollToId("analyze")}
          className="rounded-full px-5 py-2 text-sm"
        >
          Coba Sekarang
        </Button>
      </motion.nav>
    </div>
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
          <Button
            onClick={() => scrollToId("analyze")}
            className="rounded-md px-6 py-3 text-base"
          >
            Analisis Gejalaku
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href="#cara-kerja"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium text-cream/90 transition-colors hover:bg-white/10 hover:text-cream sm:w-auto"
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

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-cream/70"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/25 p-5 text-left shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2 text-cream/60">
        <span className="h-2 w-2 animate-pulse rounded-full bg-terracotta" />
        <span className="text-xs font-medium tracking-wide uppercase">
          Analisis hasil
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5">
        <span className="min-w-0 flex-1 truncate text-sm text-cream/75">
          Akhir-akhir ini gampang capek dan susah fokus…
        </span>
        <TypingDots />
      </div>

      <div className="mt-4 flex animate-pulse flex-col gap-3">
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

/* ------------------------------ Footer ------------------------------ */

const footerColumns = [
  {
    heading: "Fitur",
    links: ["Analisis Gejala", "Plan 7 Hari", "Find Partner"],
  },
  {
    heading: "Perusahaan",
    links: ["Tentang", "Cara Kerja"],
  },
  {
    heading: "Legal",
    links: ["Kebijakan Privasi", "Syarat Layanan"],
  },
];

function Footer() {
  return (
    <footer className="border-t border-hairline bg-[#faf8f1]">
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-cream">
                <Activity className="h-4 w-4" />
              </span>
              <span className="font-display text-lg">Zense</span>
            </div>
            <p className="font-display text-sm italic text-muted">
              Pendamping kesehatan pribadimu
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h4 className="text-xs font-medium uppercase tracking-widest text-muted">
                {col.heading}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-ink/80 transition-colors hover:text-terracotta"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-hairline pt-6">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-muted">
            Zense adalah alat edukasi pola hidup — bukan pengganti diagnosis
            atau saran medis profesional. Untuk kondisi serius atau
            berkelanjutan, konsultasikan dengan tenaga kesehatan.
          </p>
          <p className="mt-4 text-center text-xs text-muted">
            © 2026 Zense · Tim &quot;.&quot; untuk Bitsmikro Innovative Vibecode
            2026
          </p>
        </div>
      </div>
    </footer>
  );
}