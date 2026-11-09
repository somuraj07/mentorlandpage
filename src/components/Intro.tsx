"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { EASE_OUT, LogoMark } from "./ui";

const NAME = "SAATHYAKI".split("");

// Tiny shared flag so the hero can start its entrance as the curtain lifts.
let introDone = false;
const listeners = new Set<() => void>();
function markDone() {
  if (introDone) return;
  introDone = true;
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => void listeners.delete(l);
}
export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => introDone,
    () => false,
  );
}

/** One-time intro: the name assembles, then the curtain lifts. Skippable, once per session. */
export function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("saathyaki-intro") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!(seen || reduce)) document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), seen || reduce ? 0 : 2300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = "";
      try {
        sessionStorage.setItem("saathyaki-intro", "1");
      } catch {}
      markDone();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] grid place-items-center bg-night text-white"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.9, bounce: 0 }}
              className="rounded-full bg-white/5 p-3 ring-1 ring-white/10"
            >
              <LogoMark className="h-10 w-14" light />
            </motion.div>
            <div className="flex overflow-hidden font-display text-4xl font-medium tracking-[0.12em] sm:text-7xl">
              {NAME.map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 + i * 0.05 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="serif-accent text-2xl text-lavender"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.95 }}
            >
              a saathi for every problem
            </motion.p>
            <div className="h-px w-48 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-lime"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </div>
          <button
            onClick={() => setShow(false)}
            className="btn absolute bottom-6 right-6 border border-white/15 px-4 text-sm text-white/70 hover:text-white"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
