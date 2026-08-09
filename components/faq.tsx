"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Apakah Zense bisa mendiagnosis penyakit?",
    a: "Tidak. Zense hanya menghubungkan gejala dengan pola hidup dan memberi panduan umum. Konsultasi dengan tenaga kesehatan untuk diagnosis.",
  },
  {
    q: "Apakah Zense gratis?",
    a: "Gratis. Tanpa biaya, tanpa langganan.",
  },
  {
    q: "Apakah partner Zense manusia sungguhan?",
    a: "Saat ini partner adalah pendamping terdekatmu. Fitur untuk terhubung dengan teman sungguhan sedang kami kembangkan.",
  },
  {
    q: "Siapa di balik Zense?",
    a: "Zense dikembangkan oleh Tim . untuk Bitsmikro Innovative Vibecode 2026.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-6 sm:py-28">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
          Tanya dulu
        </h2>
        <p className="mt-3 text-muted">Pertanyaan yang sering muncul sebelum mulai.</p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className="overflow-hidden rounded-md border border-hairline bg-surface transition-colors duration-200 hover:border-terracotta/30"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
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
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
