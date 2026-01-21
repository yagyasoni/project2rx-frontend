"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Audit Recoupments Saved", value: "$12,000,000+" },
  { label: "Audits Generated", value: "3,200+" },
  { label: "Active Pharmacies", value: "250+" },
  { label: "HIPAA- Compliant", value: "100%" },
];

const StatsSection = () => {
  return (
    <section className="stats-gradient py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;