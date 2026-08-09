"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QuickAnswerCard } from "./quick-answer";

const primaryLinkClasses =
  "inline-flex items-center justify-center gap-2 rounded-md bg-terracotta px-6 py-3 text-base font-medium text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-terracotta-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

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
        <motion.span
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="mb-6 inline-block rounded-full border border-terracotta/70 bg-black/20 px-3 py-1 text-sm font-medium text-[#e8a26a]"
        >
          Bukan diagnosis — panduan
        </motion.span>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="max-w-4xl font-display text-[42px] leading-[1.08] tracking-tight text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[72px]"
        >
          <motion.span
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          >
            Tanya - tanya gejala.
          </motion.span>
          <br />
          <motion.span
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          >
            Dapat jawaban pola hidup.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        >
          Kurang enak badan tapi nggak ngerti mulai dari mana? Zense
          menghubungkan gejala dengan kebiasaan harianmu — tidur, makan,
          hidrasi, stres — dan kasih rekomendasi yang bisa kamu mulai hari ini.
        </motion.p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.6 }}
          className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
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
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? false : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.8 }}
          className="mt-12 w-full max-w-2xl"
        >
          <QuickAnswerCard />
        </motion.div>
      </div>
    </section>
  );
}