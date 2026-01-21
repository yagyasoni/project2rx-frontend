"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import LogoMarquee from "@/components/LogoMarquee";
import FeaturesSection from "@/components/FeaturesSection";
import PMSSection from "@/components/PMSSection";
import WholesalersSection from "@/components/WholesalersSection";
import AuditAssistanceSection from "@/components/AuditAssistanceSection";
import BenefitsSection from "@/components/BenefitsSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <LogoMarquee />
      <FeaturesSection />
      <PMSSection />
      <WholesalersSection />
      <AuditAssistanceSection />
      <BenefitsSection />
    </main>
  );
}
