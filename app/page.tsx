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
import TestimonialSection from "@/components/Testimonialsection";
import  TrustSection  from "@/components/trust-section";
import Footer from "@/components/footer";
import BookNowSection from "@/components/Booknowsection";

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
      <TestimonialSection />
      <BookNowSection />
      <TrustSection />
      <Footer />
    </main>
  );
}
