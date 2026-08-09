"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Analisis", href: "/analyze" },
  { label: "Partner", href: "/partner" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="Zense - beranda"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-cream">
            <Activity className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-tight">Zense</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href !== "/" && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-terracotta after:transition-transform after:duration-200 hover:text-ink hover:after:scale-x-100 ${
                  active ? "text-ink after:scale-x-100" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/analyze"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-[background-color,box-shadow] duration-200 hover:bg-terracotta-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          Coba Sekarang
        </Link>
      </motion.nav>
    </div>
  );
}