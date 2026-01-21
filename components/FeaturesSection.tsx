"use client";

import { motion } from "framer-motion";
import { FileText, ClipboardList, BarChart3, AlertTriangle, Building2, MapPin, Monitor, Search } from "lucide-react";

const features = [
  { icon: FileText, title: "Inventory", subtitle: "Report", color: "bg-emerald-100 text-emerald-600" },
  { icon: ClipboardList, title: "PBM", subtitle: "Report", color: "bg-emerald-100 text-emerald-600" },
  { icon: BarChart3, title: "Billed", subtitle: "Report", color: "bg-pink-100 text-pink-600" },
  { icon: AlertTriangle, title: "Aberrant", subtitle: "Report", color: "bg-purple-100 text-purple-600" },
  { icon: Building2, title: "CMS", subtitle: "Audit", color: "bg-slate-100 text-slate-600" },
  { icon: MapPin, title: "OnSite", subtitle: "Audit", color: "bg-emerald-100 text-emerald-600" },
  { icon: Monitor, title: "Desktop", subtitle: "Audit", color: "bg-pink-100 text-pink-600" },
  { icon: Search, title: "Investigative", subtitle: "Audit", color: "bg-purple-100 text-purple-600" },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background px-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            One Tool to Pass All Your Pharmacy Audits
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg"
          >
            Features that streamline your pharmacy audit compliance.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="feature-card flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{feature.title}</p>
                <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;