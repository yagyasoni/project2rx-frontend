"use client";

import { motion } from "framer-motion";

const pmsSystems = ["PRIMERX", "PIONEER", "DATASCAN", "DIGITALRX", "BESTRX", "LIBERTY"];

const PMSSection = () => {
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
            <p className="section-label text-gray-600 mb-4">SEAMLESS INTEGRATION</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              PMS Systems Supported
            </h2>
            <p className="text-muted-foreground mb-6">
              BatchRx works with all your existing PMS systems.
            </p>
            <div className="flex flex-wrap gap-3">
              {pmsSystems.map((system, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="badge-outline"
                >
                  {system}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right mockup - Upload interface */}
       <motion.div
  initial={{ opacity: 0, x: 30 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  viewport={{ once: true }}
  className="relative"
>
  <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
    
    {/* macOS window dots */}
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
      <span className="w-3 h-3 rounded-full bg-red-500" />
      <span className="w-3 h-3 rounded-full bg-yellow-500" />
      <span className="w-3 h-3 rounded-full bg-green-500" />
    </div>

    <div className="flex">
      {/* Sidebar */}
      <div className="w-14 border-r border-gray-200 px-3 py-4">
        <div className="h-2 w-full bg-[#A6A6A6] rounded mb-4" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-full bg-gray-200 rounded mb-3"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  step <= 4 ? "bg-green-500" : "border border-[#A6A6A6]"
                }`}
              />
              {step < 5 && (
                <div
                  className={`w-10 h-0.5 ${
                    step < 4 ? "bg-[#A6A6A6]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <p className="text-center text-sm font-medium text-gray-900 mb-6">
          Upload your inventory files
        </p>

        {/* PMS Card */}
        <div className="max-w-md mx-auto border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-900">
                PRIMERX
              </span>
            </div>
            <span className="text-xs font-medium text-green-600">
              STATUS: COMPLETED
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div className="h-full w-full bg-green-500 rounded-full" />
          </div>

          {/* Helper text */}
          <p className="text-[11px] text-[#737373] text-center mt-3">
            Please check the boxes below to continue
          </p>

          {/* Checkboxes */}
          <div className="flex justify-center gap-3 mt-3">
            <span className="w-3 h-3 border border-[#A6A6A6] rounded-sm" />
            <span className="w-3 h-3 border border-[#A6A6A6] rounded-sm" />
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-center mt-4">
          <button className="px-6 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</motion.div>


        </div>
      </div>
    </section>
  );
};

export default PMSSection;