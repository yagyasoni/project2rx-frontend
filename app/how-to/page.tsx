"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  BookOpen,
  Building2,
  Pill,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

type Guide = {
  id: string;
  name: string;
  category: "wholesaler" | "pharmacy";
  folder: string;
  stepCount: number;
  color: string;
  accent: string;
  border: string;
};

const GUIDES: Guide[] = [
  {
    id: "anda",
    name: "Anda",
    category: "wholesaler",
    folder: "anda",
    stepCount: 2,
    color: "bg-blue-50",
    accent: "text-blue-600",
    border: "border-blue-100",
  },
  {
    id: "kinray",
    name: "Kinray",
    category: "wholesaler",
    folder: "kinray",
    stepCount: 5,
    color: "bg-emerald-50",
    accent: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    id: "kinray1",
    name: "Kinray 1",
    category: "wholesaler",
    folder: "kinray1",
    stepCount: 5,
    color: "bg-emerald-50",
    accent: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    id: "mckesson",
    name: "McKesson",
    category: "wholesaler",
    folder: "mckesson",
    stepCount: 6,
    color: "bg-violet-50",
    accent: "text-violet-600",
    border: "border-violet-100",
  },
  {
    id: "mckesson1",
    name: "McKesson 1",
    category: "wholesaler",
    folder: "mckesson1",
    stepCount: 6,
    color: "bg-violet-50",
    accent: "text-violet-600",
    border: "border-violet-100",
  },
  {
    id: "primerx",
    name: "PrimeRx",
    category: "pharmacy",
    folder: "primerx",
    stepCount: 3,
    color: "bg-orange-50",
    accent: "text-orange-600",
    border: "border-orange-100",
  },
  {
    id: "primerx1",
    name: "PrimeRx 1",
    category: "pharmacy",
    folder: "primerx1",
    stepCount: 3,
    color: "bg-orange-50",
    accent: "text-orange-600",
    border: "border-orange-100",
  },
];

// ── Guide Detail — scrollable all steps ───────────────────────────────────────

function GuideDetail({ guide, onBack }: { guide: Guide; onBack: () => void }) {
  const steps = Array.from({ length: guide.stepCount }, (_, i) => i + 1);

  return (
    <main className="flex-1 overflow-auto bg-slate-50">
      {/* Sticky header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${guide.color} ${guide.border} border flex items-center justify-center`}
            >
              {guide.category === "wholesaler" ? (
                <Building2 className={`w-4 h-4 ${guide.accent}`} />
              ) : (
                <Pill className={`w-4 h-4 ${guide.accent}`} />
              )}
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">
                {guide.name}
              </h1>
              <p className="text-xs text-slate-400">{guide.stepCount} steps</p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps — all loaded at once */}
      <div className="px-8 py-8 max-w-4xl space-y-10">
        {steps.map((step) => (
          <div key={step} className="space-y-3">
            {/* Step label row */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{step}</span>
              </div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                Step {step}
              </h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/how-to/${guide.folder}/${step}.png`}
                alt={`${guide.name} Step ${step}`}
                className="w-full h-auto object-contain"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".img-error-msg")) {
                    const msg = document.createElement("div");
                    msg.className =
                      "img-error-msg flex items-center justify-center py-12 text-xs text-slate-400";
                    msg.innerText = `⚠ Image not found — place file at: public/how-to/${guide.folder}/${step}.png`;
                    parent.appendChild(msg);
                  }
                }}
              />
            </div>
          </div>
        ))}

        {/* Done button at bottom */}
        <div className="flex justify-center pt-2 pb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            ✓ Done — Back to Guides
          </button>
        </div>
      </div>
    </main>
  );
}

// ── Guide Card ────────────────────────────────────────────────────────────────

function GuideCard({ guide, onClick }: { guide: Guide; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-2xl p-5 text-left hover:border-gray-400 hover:shadow-md transition-all duration-200 flex items-center gap-4"
    >
      <div
        className={`w-12 h-12 rounded-xl ${guide.color} ${guide.border} border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
      >
        {guide.category === "wholesaler" ? (
          <Building2 className={`w-5 h-5 ${guide.accent}`} />
        ) : (
          <Pill className={`w-5 h-5 ${guide.accent}`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{guide.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{guide.stepCount} steps</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HowToPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  const wholesalers = GUIDES.filter((g) => g.category === "wholesaler");
  const pharmacies = GUIDES.filter((g) => g.category === "pharmacy");

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-50">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        {activeGuide ? (
          <GuideDetail
            guide={activeGuide}
            onBack={() => setActiveGuide(null)}
          />
        ) : (
          <main className="flex-1 overflow-auto">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    How To
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Step-by-step guides for downloading audit files
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-8 space-y-10 max-w-4xl">
              {/* Wholesalers */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Wholesalers
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {wholesalers.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {wholesalers.map((guide) => (
                    <GuideCard
                      key={guide.id}
                      guide={guide}
                      onClick={() => setActiveGuide(guide)}
                    />
                  ))}
                </div>
              </section>

              {/* Pharmacies */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="w-4 h-4 text-slate-500" />
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Pharmacies
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {pharmacies.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pharmacies.map((guide) => (
                    <GuideCard
                      key={guide.id}
                      guide={guide}
                      onClick={() => setActiveGuide(guide)}
                    />
                  ))}
                </div>
              </section>
            </div>
          </main>
        )}
      </div>
    </ProtectedRoute>
  );
}
