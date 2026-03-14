// "use client";

// import React, { useState, useEffect } from "react";
// import { Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import Loading from "./loading";
// import Sidebar from "@/components/Sidebar";
// import { Layers, FileText, FileSymlink } from "lucide-react";
// import AuditWizard from "./AuditWizard";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import axios from "axios";

// export default function BatchRxDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedReport, setSelectedReport] = useState<string | null>(null);
//   const [activePanel, setActivePanel] = useState<string | null>(null);
//   const [view, setView] = useState(false);
//   const [initialStep, setInitialStep] = useState<number>(1);
//   const [initialAuditId, setInitialAuditId] = useState<string | null>(null);
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const auditId = searchParams.get("auditId");
//     const step = searchParams.get("step");
//     if (auditId && step === "inventory") {
//       setInitialAuditId(auditId);
//       setInitialStep(3);
//       setView(true);
//     }
//     if (auditId && step === "wholesaler") {
//       setInitialAuditId(auditId);
//       setInitialStep(4);
//       setView(true);
//     }
//   }, [searchParams]);

//   return (
//     <Suspense fallback={<Loading />}>
//       <div className="flex h-screen bg-background">
//         <Sidebar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//           activePanel={activePanel}
//           setActivePanel={setActivePanel}
//         />

//         <main className="flex-1 overflow-auto bg-gray-100 flex">
//           {/* Center Content */}
//           <div className="flex-1 flex flex-col items-center justify-center px-8 py-4">
//             {!view ? (
//               <div className="max-w-2xl w-full space-y-8">
//                 {/* Title */}
//                 <div className="text-center space-y-3">
//                   <h1 className="text-4xl md:text-4xl font-bold text-gray-900">
//                     Select a Report to Get Started
//                   </h1>
//                   <p className="text-lg text-gray-600">
//                     Features that streamline your pharmacy audit compliance.
//                   </p>
//                 </div>

//                 {/* Report Cards */}
//                 <div className="flex justify-center items-center w-full gap-6 pt-8">
//                   {/* Inventory */}
//                   <Card
//                     onClick={() => setSelectedReport("inventory")}
//                     className={`w-[30%] bg-white rounded-md border border-gray-200 group relative p-6 pb-0 transition-all duration-300 ${
//                       selectedReport === "inventory"
//                         ? "bg-white text-gray-600scale-105"
//                         : "bg-white text-gray-600"
//                     }`}
//                   >
//                     <div className="flex flex-col items-start space-y-4">
//                       <div className="w-20 h-20 border border-gray-200 bg-purple-200 rounded-lg flex items-center justify-center">
//                         <FileSymlink className="size-8 text-black font-xl" />
//                       </div>

//                       <div className="text-start">
//                         <h3 className="text-xl text-gray-700 font-semibold">
//                           INVENTORY
//                         </h3>
//                         <p className="text-lg opacity-90 text-gray-700 font-semibold">
//                           Report
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex justify-center pt-8">
//                       {/* <button onClick={() => setView(true)} className="px-10 py-3 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white font-semibold rounded-sm transition">
//                   Start
//                 </button> */}
//                     </div>
//                   </Card>

//                   {/* Aberrant */}
//                   {/* <button
//                   onClick={() => setSelectedReport('aberrant')}
//                   className={`group relative p-8 rounded-2xl transition-all duration-300 border-2 ${
//                     selectedReport === 'aberrant'
//                       ? 'border-purple-400 bg-white shadow-xl scale-105'
//                       : 'border-gray-200 bg-white hover:shadow-lg'
//                   }`}
//                 >
//                   <div className="flex flex-col items-center space-y-4">
//                     <div className="w-20 h-20 bg-purple-200 rounded-2xl flex items-center justify-center">
//                       <FileText className="w-10 h-10 text-purple-500" />
//                     </div>

//                     <div className="text-center">
//                       <h3 className="text-xl font-bold uppercase text-gray-900">
//                         Aberrant
//                       </h3>
//                       <p className="text-sm text-gray-600">Report</p>
//                     </div>
//                   </div>
//                 </button> */}
//                 </div>

//                 {/* Start Button */}
//                 <div className="flex justify-center pt-8">
//                   <Button
//                     onClick={() => setView(true)}
//                     className="px-10 py-2 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white font-semibold rounded-sm transition"
//                   >
//                     Start
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <AuditWizard
//                 initialStep={initialStep}
//                 initialAuditId={initialAuditId}
//               />
//             )}
//           </div>

//           {/* RIGHT PANEL (kept exactly same logic) */}
//           {activePanel && (
//             <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
//               {activePanel === "support" && (
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                     Customer Support
//                   </h2>
//                   <p className="text-sm text-gray-600">Call: 777-777-7777</p>
//                 </div>
//               )}

//               {activePanel === "account" && (
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                     Account Information
//                   </h2>
//                   <p className="text-sm text-gray-600">United Drugs Pharmacy</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </main>
//       </div>
//     </Suspense>
//   );
// }

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import AuditWizard from "./AuditWizard";
import Loading from "./loading";

import {
  ArrowRight,
  ArrowLeft,
  ClipboardList,
  BarChart3,
  FileSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";

const reportTypes = [
  {
    id: "inventory",
    label: "INVENTORY",
    sublabel: "Report",
    icon: ClipboardList,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    description:
      "Track and audit your pharmacy inventory with detailed compliance reports.",
  },
  {
    id: "aberrant",
    label: "ABERRANT",
    sublabel: "Report",
    icon: FileSearch,
    color: "bg-amber-100",
    iconColor: "text-amber-600",
    description:
      "Identify unusual patterns and flag aberrant dispensing activities.",
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    sublabel: "Report",
    icon: BarChart3,
    color: "bg-gray-200",
    iconColor: "text-gray-700",
    description:
      "Comprehensive analytics on pharmacy performance and compliance metrics.",
  },
];

export default function BatchRxDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [view, setView] = useState(false);
  const [initialStep, setInitialStep] = useState<number>(1);
  const [initialAuditId, setInitialAuditId] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const auditId = searchParams.get("auditId");
    const step = searchParams.get("step");

    if (auditId && step === "inventory") {
      setInitialAuditId(auditId);
      setInitialStep(3);
      setView(true);
    }

    if (auditId && step === "wholesaler") {
      setInitialAuditId(auditId);
      setInitialStep(4);
      setView(true);
    }
  }, [searchParams]);

  const selectedData = reportTypes.find((r) => r.id === selectedReport);

  const handleStart = () => {
    if (!selectedReport) return;
    setView(true);
  };

  return (
    <ProtectedRoute>
      <Suspense fallback={<Loading />}>
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />

          {/* MAIN */}
          <main className="flex-1 overflow-auto bg-muted/30 flex">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {!view ? (
                <>
                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                  >
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                      Select a Report to Get Started
                    </h1>

                    <p className="text-muted-foreground text-base">
                      Features that streamline your pharmacy audit compliance.
                    </p>
                  </motion.div>

                  {/* Report Cards */}
                  <div className="flex flex-wrap justify-center gap-6 mb-10 max-w-3xl">
                    {reportTypes.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Card
                          onClick={() =>
                            report.id === "inventory"
                              ? setSelectedReport(report.id)
                              : null
                          }
                          className={`w-48 relative overflow-hidden p-6 flex flex-col items-center gap-4 transition-all duration-300 border-2 ${
                            report.id !== "inventory"
                              ? "cursor-not-allowed opacity-70 border-border bg-card"
                              : selectedReport === report.id
                                ? "cursor-pointer shadow-lg scale-105 bg-card"
                                : "cursor-pointer border-border bg-card hover:border-gray-400 hover:shadow-lg"
                          }`}
                        >
                          {/* Coming Soon Overlay */}
                          {report.id !== "inventory" && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                              <span className="bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full border border-border">
                                Coming Soon
                              </span>
                            </div>
                          )}

                          <div
                            className={`w-14 h-14 ${report.color} rounded-xl flex items-center justify-center`}
                          >
                            <report.icon
                              className={`w-7 h-7 ${report.iconColor}`}
                            />
                          </div>

                          <div className="text-center">
                            <p className="font-bold text-sm text-foreground tracking-wide">
                              {report.label}
                            </p>

                            <p className="text-muted-foreground text-sm">
                              {report.sublabel}
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Description */}
                  <AnimatePresence mode="wait">
                    {selectedData && (
                      <motion.p
                        key={selectedData.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-muted-foreground text-sm text-center mb-8 max-w-md"
                      >
                        {selectedData.description}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Start Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={handleStart}
                      disabled={!selectedReport}
                      className="px-10 py-3 bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-lg gap-2 disabled:opacity-40"
                    >
                      Start
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </>
              ) : (
                <AuditWizard
                  initialStep={initialStep}
                  initialAuditId={initialAuditId}
                />
              )}
            </div>

            {/* RIGHT PANEL */}
            {activePanel && (
              <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                {activePanel === "support" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Customer Support
                    </h2>
                    <p className="text-sm text-gray-600">Call: 777-777-7777</p>
                  </div>
                )}

                {activePanel === "account" && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Account Information
                    </h2>
                    <p className="text-sm text-gray-600">
                      United Drugs Pharmacy
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}
