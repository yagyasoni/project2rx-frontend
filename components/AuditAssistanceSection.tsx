"use client";

import { motion } from "framer-motion";

const auditTypes = ["CMS", "ONSITE", "DESKTOP", "INVESTIGATIVE"];

const AuditAssistanceSection = () => {
  return (
    <section className="py-20 bg-muted/30 px-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Audit Assistance
            </h2>
            <p className="text-muted-foreground mb-6">
              We provide one on one assistance with every audit.
            </p>
            <div className="flex flex-wrap gap-3">
              {auditTypes.map((type, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="badge-outline"
                >
                  {type}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right mockup - Document viewer card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-border">
              {/* Header bar - Teal gradient */}
              <div className="bg-gradient-to-r from-primary via-primary to-accent px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm" />
                  </div>
                  <div>
                    <span className="text-primary-foreground text-xs font-semibold tracking-widest">AUDIT VERIFICATION</span>
                    <p className="text-primary-foreground/80 text-xs mt-0.5">Real-time Prescription Audit Report</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-primary-foreground text-xs font-bold">Live</span>
                </div>
              </div>

              {/* Content area with grid layout */}
              <div className="p-6">
                {/* Left column - Issues/Findings */}
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-3 border-r-2 border-accent/20 pr-4">
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Issues Found</p>
                    <div className="space-y-2.5">
                      {[
                        { label: "Qty Mismatch", severity: "high" },
                        { label: "Price Variance", severity: "medium" },
                        { label: "NDC Discrepancy", severity: "high" },
                        { label: "Dosage Alert", severity: "medium" },
                        { label: "Date Flag", severity: "low" },
                        { label: "Billing Error", severity: "high" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${
                            item.severity === 'high' ? 'bg-red-500' :
                            item.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                          <div className="flex-1 h-1.5 bg-gradient-to-r from-accent/40 to-transparent rounded" />
                          <span className="text-xs text-muted-foreground font-medium">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right column - Detailed Report */}
                  <div className="col-span-9 space-y-5">
                    {/* Top Row - Prescription Info */}
                    <div className="pb-4 border-b border-border">
                      <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Prescription Details</p>
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1.5">Rx #</p>
                          <div className="h-7 bg-gradient-to-r from-primary/15 to-accent/10 rounded border-l-2 border-accent flex items-center px-2">
                            <span className="text-xs font-semibold text-primary">RX4582901</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1.5">Drug Name</p>
                          <div className="h-7 bg-gradient-to-r from-primary/15 to-accent/10 rounded border-l-2 border-accent flex items-center px-2">
                            <span className="text-xs font-semibold text-primary">Metformin</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1.5">Qty Ordered</p>
                          <div className="h-7 bg-gradient-to-r from-primary/15 to-accent/10 rounded border-l-2 border-accent flex items-center px-2">
                            <span className="text-xs font-semibold text-primary">500</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1.5">Discrepancy</p>
                          <div className="h-7 bg-gradient-to-r from-red-100 to-red-50 rounded border-l-2 border-red-500 flex items-center px-2">
                            <span className="text-xs font-bold text-red-600">-45 Units</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Audit Info Row */}
                    <div className="pb-4 border-b border-border">
                      <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Audit Information</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg border border-primary/30 hover:border-primary/60 transition">
                          <p className="text-xs text-muted-foreground font-medium mb-1">PBM Audit Date</p>
                          <span className="text-sm font-bold text-primary">01/15/2026</span>
                          <p className="text-xs text-muted-foreground mt-1">30 days remaining</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-accent/15 to-accent/5 rounded-lg border border-accent/30 hover:border-accent/60 transition">
                          <p className="text-xs text-muted-foreground font-medium mb-1">Status</p>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-sm font-bold text-accent">Pending Review</span>
                          </div>
                          <p className="text-xs text-muted-foreground">In Progress</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-red-100/50 to-red-50/50 rounded-lg border border-red-300/50 hover:border-red-400 transition">
                          <p className="text-xs text-muted-foreground font-medium mb-1">Amount at Risk</p>
                          <span className="text-sm font-bold text-red-600">$2,745.00</span>
                          <p className="text-xs text-red-500 mt-1">High Priority</p>
                        </div>
                      </div>
                    </div>


                    {/* Footer Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                      <div className="px-3 py-1.5 bg-primary/10 rounded-full border border-primary/30 flex items-center gap-2 cursor-pointer hover:bg-primary/20 transition">
                        <span className="text-xs font-semibold text-primary">📋 Review</span>
                      </div>
                      <div className="px-3 py-1.5 bg-accent/10 rounded-full border border-accent/30 flex items-center gap-2 cursor-pointer hover:bg-accent/20 transition">
                        <span className="text-xs font-semibold text-accent">⬇️ Export</span>
                      </div>
                    </div>
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

export default AuditAssistanceSection;