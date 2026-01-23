"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="hero-gradient relative min-h-screen overflow-hidden">
      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large diamond shape on left */}
        <div 
          className="absolute -left-20 top-1/3 w-64 h-64 bg-[hsl(0_0%_44%)] rotate-45 opacity-60"
        />
        {/* Smaller shape */}
        <div 
          className="absolute left-10 top-1/2 w-32 h-32 bg-[hsl(0_0%_66%)] rotate-45 opacity-40"
        />
      </div>

      <div className="container mx-auto px-6 pt-32 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Where Pharmacies Turn for Trusted Audit Support
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Streamline your audit process with our all-in-one tool designed specifically for pharmacies
          </motion.p>

          {/* CTA BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/Mainpage">
              <Button 
                size="lg" 
                className="text-white rounded-full px-8 py-6 text-lg font-medium border border-primary-foreground/20 bg-opacity-90 hover:bg-opacity-100"
              >
                Request Demo
              </Button>
            </Link>
          </motion.div>

          {/* Ratings */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-6"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-white/80 text-sm">
              Trusted by 300+ pharmacies
            </span>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="bg-card bg-white rounded-xl shadow-2xl overflow-hidden border border-border">

            {/* Browser chrome */}
            <div className="bg-muted px-4 py-3 flex items-center gap-4 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Inventory Report</span>
                <span className="text-muted-foreground/50">Start Date</span>
                <span className="text-muted-foreground/50">End Date</span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="bg-background rounded px-3 py-1 text-sm text-muted-foreground flex items-center gap-2">
                  <span>Search...</span>
                </div>

                <Button size="sm" className="bg-accent text-accent-foreground h-7 px-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </Button>

                <span className="text-sm text-muted-foreground">Filters</span>
                <span className="text-sm text-muted-foreground">Tags</span>
                <span className="text-sm text-muted-foreground">Priority</span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-background">
              <div className="grid grid-cols-10 gap-2 px-4 py-3 text-xs font-medium text-muted-foreground border-b border-border">
                <div>NDC</div>
                <div>DRUG NAME</div>
                <div>RANK</div>
                <div>PKG SIZE</div>
                <div>ORDERED</div>
                <div>BILLED</div>
                <div>SHORTAGE</div>
                <div>OPTUM</div>
                <div>EXPRESS SCRIPTS</div>
                <div>EXPRESS SCRIPTS</div>
              </div>

              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-10 gap-2 px-4 py-3 text-sm border-b border-border/50"
                >
                  {[...Array(10)].map((_, j) => (
                    <div
                      key={j}
                      className="h-3 bg-muted rounded"
                      style={{ width: `${60 + Math.random() * 40}%` }}
                    />
                  ))}
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
