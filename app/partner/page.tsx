"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";

const PartnerInbox = dynamic(
  () => import("../../components/partner-inbox").then((m) => m.PartnerInbox),
  {
    ssr: false,
    loading: () => <p className="py-24 text-center text-sm text-muted">Memuat…</p>,
  },
);

export default function PartnerPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />

        <main>
          <div className="pt-16 sm:pt-20">
            <PartnerInbox />
          </div>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
