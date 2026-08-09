"use client";

import { MotionConfig } from "framer-motion";
import { Footer } from "../../components/footer";
import { GroupSection } from "../../components/group-section";
import { Navbar } from "../../components/navbar";

export default function GroupPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-cream text-ink">
        <Navbar />

        <main>
          <div className="pt-16 sm:pt-20">
            <GroupSection />
          </div>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}