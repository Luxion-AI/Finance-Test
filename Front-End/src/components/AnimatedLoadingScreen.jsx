import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedLoadingScreen = ({ onFinish }) => {
  const [phase, setPhase] = useState(0);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setShowUI(true);
    setTimeout(onFinish, 350);
  }, [onFinish]);

  useEffect(() => {
    if (phase === 4) {
      const t = setTimeout(handleAnimationComplete, 500);
      return () => clearTimeout(t);
    }
  }, [phase, handleAnimationComplete]);

  return (
    <AnimatePresence>
      {!showUI && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            {/* Orbits & Logo Container */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0"
                initial={{ rotate: 0, opacity: 0, scale: 0.8 }}
                animate={
                  phase < 2
                    ? { rotate: 360, opacity: [0, 1, 1], scale: [0.8, 1, 1] }
                    : phase === 2
                      ? { rotate: 720, opacity: [1, 0.6, 0], scale: [1, 1.2, 0.5] }
                      : { opacity: 0, scale: 0 }
                }
                transition={
                  phase < 2
                    ? { repeat: Infinity, duration: 1.5, ease: "linear" }
                    : { duration: 0.6, ease: "easeInOut" }
                }
              >
                <div className="w-full h-full rounded-full border-2 border-transparent"
                  style={{
                    borderImage: "linear-gradient(135deg, #3B82F6, #10B981) 1",
                    WebkitMaskImage: "linear-gradient(135deg, #3B82F6, #10B981)",
                  }}
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
              </motion.div>

              {/* Inner counter-rotating ring */}
              <motion.div
                className="absolute inset-5 rounded-full border border-primary/40"
                initial={{ rotate: 0, opacity: 0 }}
                animate={
                  phase < 2
                    ? { rotate: -360, opacity: [0, 0.5, 0.5] }
                    : phase === 2
                      ? { rotate: -540, opacity: [0.5, 0.2, 0], scale: [1, 1.1, 0.3] }
                      : { opacity: 0, scale: 0 }
                }
                transition={
                  phase < 2
                    ? { repeat: Infinity, duration: 2, ease: "linear" }
                    : { duration: 0.5, ease: "easeInOut" }
                }
              />

              {/* Logo Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3, filter: "blur(8px)" }}
                animate={
                  phase < 2
                    ? { opacity: 0, scale: 0.3, filter: "blur(8px)" }
                    : phase === 2
                      ? {
                          opacity: [0, 0.3, 0.8, 1],
                          scale: [0.3, 0.6, 0.9, 1],
                          filter: ["blur(8px)", "blur(4px)", "blur(1px)", "blur(0px)"],
                        }
                      : phase === 3
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : {
                            scale: [1, 1.4, 1],
                            opacity: [1, 0.7, 1],
                          }
                }
                transition={
                  phase < 2
                    ? { duration: 0.01 }
                    : phase === 2
                      ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
                      : phase === 3
                        ? { duration: 0.6, ease: "easeInOut" }
                        : { duration: 1.2, ease: "easeInOut", repeat: Infinity }
                }
                className="z-10"
              >
                <img
                  src="/FTacker.png"
                  alt="FinTrack"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                />
              </motion.div>

              {/* Glow behind logo */}
              <AnimatePresence>
                {phase >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.08, 1] }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-emerald-500/20 to-primary/20 blur-xl"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-white/60 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {phase < 2 ? "Memuat" : phase === 2 ? "Hampir siap" : phase === 3 ? "Siap" : ""}
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedLoadingScreen;