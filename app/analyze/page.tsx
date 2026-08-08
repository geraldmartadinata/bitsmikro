"use client";

import { MotionConfig } from "framer-motion";
import { AnalyzeSection } from "../../components/analyze-section";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";

export default function AnalyzePage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />

        <main>
          <div className="pt-16 sm:pt-20">
            <AnalyzeSection />
          </div>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}