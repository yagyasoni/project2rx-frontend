"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";

const BenefitsSection = () => {
  const [prescriptions, setPrescriptions] = useState([4450]);

  const discrepancies = Math.round(prescriptions[0] * 0.035);
  const amountSaved = Math.round(prescriptions[0] * 6.12);

  return (
    <section className="py-20 bg-background px-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="section-label text-gray-600 mb-4">BENEFITS OF USING BATCHRX</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              See How Much You Can Save from Audits
            </h2>
            <p className="text-muted-foreground mb-4">
              BatchRx automatically identifies and flags prescription discrepancies before they trigger costly PBM audits.
            </p>
            <p className="text-muted-foreground">
              By proactively monitoring your pharmacy&apos;s data, BatchRx reduces compliance risks and prevents revenue loss—saving you thousands each month while improving operational accuracy.
            </p>
          </motion.div>

          {/* Right calculator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {/* Slider section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-muted-foreground tracking-wide">
                    MONTHLY PRESCRIPTIONS
                  </span>
                  <span className="text-2xl font-bold text-accent">{prescriptions[0].toLocaleString()}</span>
                </div>
                <Slider
                  value={prescriptions}
                  onValueChange={setPrescriptions}
                  max={10000}
                  min={100}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>100</span>
                  <span>5,000</span>
                  <span>10,000+</span>
                </div>
              </div>

              {/* Results card */}
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-lg font-semibold text-foreground mb-4">Estimated monthly impact</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#FBF5F4] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-2xl font-bold text-accent mb-1">
                      {discrepancies.toFixed(1)}
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">Discrepancies Caught</p>
                  </div>
                  
                  <div className="bg-[#FBF5F4] rounded-xl p-4">
                    <div className="flex items-center gap-2 text-2xl font-bold text-accent mb-1">
                      ${amountSaved.toLocaleString()}
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">Amount Saved</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Based on industry average of 3.5% discrepancy rate in PBM audits.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;