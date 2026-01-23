import React from "react";
import { Shield, CheckCircle } from "lucide-react";


export default function BookNowSection() {
  return (
    <section className="py-8 sm:py-8 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* Main Compact Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0D0D0D] border border-[#262626] p-1 shadow-2xl">
          
          {/* Subtle Glow Effect */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#404040] opacity-20 blur-[60px]" />
          
          <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 text-center">
            
            {/* Minimal Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#262626] px-3 py-1 border border-[#404040]/50">
              <p className="text-[10px] font-bold tracking-widest text-[#A6A6A6] uppercase">
                Book Now
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Dedicated Support. <span className="text-[#737373]">Every Time.</span>
            </h2>

            <p className="text-[#A6A6A6] text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Expert support committed to your success. We handle the complexity so you can focus on the vision.
            </p>

            {/* Primary Action */}
            <button className="bg-white px-8 py-3 rounded-full text-[#0D0D0D] font-bold text-sm hover:bg-[#A6A6A6] transition-all duration-300 transform hover:scale-105 active:scale-95">
              Request Demo
            </button>

            {/* Integrated "Small" Secondary Card */}
            <div className="mt-10 pt-8 border-t border-[#262626]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#262626]/40 rounded-2xl p-4 sm:p-5 border border-[#404040]/30">
                <div className="text-center sm:text-left">
                  <h3 className="text-white font-semibold text-sm">Ready to know more?</h3>
                  <p className="text-[#737373] text-xs">Get in touch for a personalized tour.</p>
                </div>

                <button className="text-white text-xs font-bold border-b border-[#737373] hover:text-[#A6A6A6] hover:border-[#A6A6A6] transition-colors pb-1 px-1">
                  Contact Us →
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );

}
