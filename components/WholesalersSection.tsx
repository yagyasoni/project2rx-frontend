"use client";

import { motion } from "framer-motion";

const wholesalers = [
  ["KINRAY", "MCKESSON", "AMERISOURCE BERGEN", "REAL VALUE", "TOPRX", "AXIA"],
  ["ALPINE HEALTH", "SMART SOURCE", "CITYMED", "DRUGZONE", "AKRON", "PARMED"],
  ["KEYSOURCE", "MASTERS", "SMITH DRUGS"],
];

const WholesalersSection = () => {
  return (
    <section className="py-20 bg-background px-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left mockup */}
       <motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="relative"
>
  <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lg overflow-hidden">
    
    {/* macOS dots */}
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E5E5E5]">
      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
      <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
    </div>

    <div className="flex">
      {/* Sidebar */}
      <div className="w-14 bg-white border-r border-[#E5E5E5] px-3 py-4 flex flex-col gap-3">
        <div className="h-2 w-full bg-[#A6A6A6] rounded-full mb-4" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-full rounded bg-[#E5E5E5]"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-5">
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
              {i < 4 && <div className="w-12 h-0.5 bg-[#A6A6A6]" />}
            </div>
          ))}
          {/* <div className="w-2.5 h-2.5 rounded-full border border-[#A6A6A6]" /> */}
        </div>

        <p className="text-center text-sm font-medium mb-6">
          Upload your wholesaler files
        </p>

        {/* File list */}
        <div className="space-y-3">
          {[
            { name: "AXIA", status: "completed" },
            { name: "TOPRX", status: "completed" },
            { name: "ALPINE HEALTH", status: "completed" },
            { name: "KINRAY", status: "processing" },
            { name: "MCKESSON", status: "idle" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 border border-[#E5E5E5] rounded-lg"
            >
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.status === "completed"
                      ? "bg-green-600"
                      : item.status === "processing"
                      ? "bg-amber-500"
                      : "bg-[#A6A6A6]"
                  }`}
                />
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Progress bar */}
                <div className="w-28 h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.status === "completed"
                        ? "bg-green-600 w-full"
                        : item.status === "processing"
                        ? "bg-amber-500 w-3/4"
                        : "w-0"
                    }`}
                  />
                </div>

                <span
                  className={`text-xs font-medium ${
                    item.status === "completed"
                      ? "text-green-600"
                      : item.status === "processing"
                      ? "text-amber-600"
                      : "text-[#A6A6A6]"
                  }`}
                >
                  {item.status === "completed"
                    ? "Completed"
                    : item.status === "processing"
                    ? "Processing"
                    : "Upload file"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <button className="mt-6 w-full border border-[#E5E5E5] text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition">
          + Add Supplier
        </button>
      </div>
    </div>
  </div>
</motion.div>


          {/* Right content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Wholesalers
            </h2>
            <p className="text-muted-foreground mb-6">
              We work with all primary and secondary wholesalers.
            </p>
            <div className="space-y-3 w-full">
              {wholesalers.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap gap-2">
                  {row.map((wholesaler, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (rowIndex * 5 + index) * 0.03 }}
                      viewport={{ once: true }}
                      className="badge-outline text-xs"
                    >
                      {wholesaler}
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">and many other wholesalers...</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WholesalersSection;