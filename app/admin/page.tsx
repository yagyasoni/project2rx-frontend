"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const Welcome = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"intro" | "loading" | "exit">("intro");

  useEffect(() => {
    const content = async () => {
      try {
        const res = await api.get("/auth/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        console.log(res?.data);
      } catch (error: any) {
        console.error("Error fetching dashboard:", error);
        alert("Failed to load dashboard data. Please try again.");
        return;
      }
    };

    content();
  }, []);

  useEffect(() => {
    const introDuration = 1500;
    const loadDuration = 6000;

    const introTimer = setTimeout(() => setPhase("loading"), introDuration);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 100 / (loadDuration / 80);
      });
    }, 80);

    const exitTimer = setTimeout(
      () => setPhase("exit"),
      introDuration + loadDuration,
    );

    const navTimer = setTimeout(
      () => {
        // router.push("/reports");
      },
      introDuration + loadDuration + 800,
    );

    return () => {
      clearTimeout(introTimer);
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center overflow-hidden relative">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--brand)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--brand)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--brand) / 0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {phase !== "exit" ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center gap-10"
          >
            {/* Logo mark */}
            {/* <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 border-2 border-brand rounded-xl flex items-center justify-center"
            >
              <span className="text-brand font-bold text-2xl tracking-tighter">
                A
              </span>
            </motion.div> */}

            {/* Title */}
            <div className="text-center space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold tracking-tight text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(
      135deg,
      hsl(${210 + 0 * 20} 25% 40%),
      hsl(${210 + 0 * 20} 20% 25%)
    )`,
                }}
              >
                Welcome back,{" "}
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(
      135deg,
      hsl(${210 + 1 * 20} 25% 40%),
      hsl(${210 + 1 * 20} 20% 25%)
    )`,
                  }}
                >
                  {" "}
                  Admin
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-sm text-white/80 font-medium"
              >
                Preparing your dashboard…
              </motion.p>
            </div>

            {/* Progress bar */}
            <AnimatePresence>
              {phase === "loading" && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 240 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-60 h-1 bg-muted/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-clip-text text-transparent bg-gradient-to-r"
                      style={{
                        background:
                          "linear-gradient(90deg, hsl(var(--brand)), hsl(var(--brand-dark)))",
                        backgroundImage: `linear-gradient(
      135deg,
      hsl(${210 + 2 * 20} 25% 40%),
      hsl(${210 + 2 * 20} 20% 25%)
    )`,
                        width: `${Math.min(progress, 100)}%`,
                      }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-[11px] text-white/80 font-mono tabular-nums">
                    {Math.min(Math.round(progress), 100)}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulsing dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-brand"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Welcome;
