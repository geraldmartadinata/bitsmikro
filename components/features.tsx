"use client";

import { useReducedMotion } from "framer-motion";
import { motion, type Variants } from "framer-motion";
import { Stethoscope, HeartPulse, ListChecks } from "lucide-react";

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

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function HeartbeatSparkline({ animate = true }: { animate?: boolean }) {
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
        className={animate ? "z-draw" : ""}
      />
    </svg>
  );
}

export function Features() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="fitur" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={shouldReduceMotion ? undefined : stagger}
        className="mb-12 text-center"
      >
        <motion.h2
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="font-display text-4xl tracking-tight sm:text-5xl"
        >
          Kenapa Zense?
        </motion.h2>
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUp}
          className="mx-auto mt-3 max-w-xl text-muted"
        >
          Bukan cuma jawaban singkat — kamu lihat alur berpikirnya dan tahu
          harus mulai dari mana.
        </motion.p>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.15 }}
        variants={shouldReduceMotion ? undefined : stagger}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, description, sparkline }) => (
          <motion.div
            key={title}
            variants={shouldReduceMotion ? undefined : fadeUp}
            className="card-surface group flex flex-col gap-4 rounded-md p-7 transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(42,43,47,0.12)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta/10 text-terracotta transition-shadow duration-200 group-hover:shadow-[0_0_20px_rgba(176,90,54,0.35)]">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </div>
            {sparkline ? <HeartbeatSparkline animate={!shouldReduceMotion} /> : null}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}