"use client";

import { MotionConfig } from "framer-motion";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { PartnerSection } from "../../components/partner-section";

export default function PartnerPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />

        <main>
          <div className="pt-16 sm:pt-20">
            <PartnerSection />
          </div>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}