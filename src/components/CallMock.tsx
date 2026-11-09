"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageSquare, Mic, PhoneOff, Video, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { CURRENCY, EXAMPLE_RATES } from "@/lib/site";
import { EASE_OUT } from "./ui";

const CHAT = [
  { me: true, text: "I have 3 years in QA. Can I move into product management?" },
  { me: false, text: "Yes — I made the same switch. Let's map your QA wins to PM skills first." },
  { me: true, text: "That would help a lot" },
  { me: false, text: "Share your resume here, I'll mark what to rewrite." },
];

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Live product UI: a mentorship video call with a running per-minute meter. */
export function CallMock() {
  const [secs, setSecs] = useState(272);
  const [msgs, setMsgs] = useState(1);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    const c = setInterval(() => setMsgs((m) => (m >= CHAT.length ? 1 : m + 1)), 2800);
    return () => {
      clearInterval(t);
      clearInterval(c);
    };
  }, []);

  const cost = ((secs / 60) * EXAMPLE_RATES.video).toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#120c1f] p-2 text-white shadow-[0_50px_120px_-40px_rgba(62,42,158,0.6)] sm:p-3">
      {/* window bar */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1 sm:px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="relative h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="font-mono tabular-nums">{fmt(secs)}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-violet/25 px-2.5 py-1 text-lavender">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono tabular-nums">
              {CURRENCY}
              {EXAMPLE_RATES.video}/min · {CURRENCY}
              {cost}
            </span>
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 md:grid-cols-[1fr_300px]">
        {/* mentor video tile */}
        <div className="relative aspect-[16/11] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2a1d55] via-[#1a1236] to-[#0e0918] md:aspect-auto md:min-h-[380px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(107,78,255,0.5),transparent_55%)]" />
          {/* mentor avatar */}
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative grid h-24 w-24 place-items-center sm:h-32 sm:w-32">
              <span className="relative grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-[#c8b8ff] to-[#6b4eff] font-display text-3xl font-medium text-white sm:text-4xl">
                AR
              </span>
            </div>
          </div>
          {/* waveform */}
          <div className="absolute bottom-16 left-1/2 flex h-8 -translate-x-1/2 items-end gap-[3px]">
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-white/70"
                animate={{ height: [6, 8 + ((i * 37) % 22), 6] }}
                transition={{ duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
              />
            ))}
          </div>
          <div className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1.5 text-xs backdrop-blur sm:bottom-3 sm:top-auto sm:text-sm">
            Ananya · Product mentor
          </div>
          {/* self tile */}
          <div className="absolute right-3 top-3 grid h-20 w-28 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-[#2c3a10] to-[#151d07] sm:h-24 sm:w-36">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-sm font-semibold text-ink">
              You
            </span>
          </div>
          {/* controls */}
          <div className="absolute bottom-3 right-3 flex gap-1.5 sm:gap-2">
            {[Mic, Video, MessageSquare].map((Icon, i) => (
              <span key={i} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur">
                <Icon className="h-4 w-4" />
              </span>
            ))}
            <span className="grid h-9 w-11 place-items-center rounded-full bg-red-500">
              <PhoneOff className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* chat side panel */}
        <div className="hidden flex-col rounded-[20px] bg-white/[0.04] p-4 md:flex">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium">Session chat</span>
            <span className="text-xs text-white/40">Saved after call</span>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden">
            <AnimatePresence initial={false}>
              {CHAT.slice(0, msgs).map((m) => (
                <motion.div
                  key={m.text}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className={`max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                    m.me ? "self-end rounded-br-md bg-violet text-white" : "self-start rounded-bl-md bg-white/10"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-3 rounded-full bg-white/5 px-4 py-2.5 text-[13px] text-white/35">Type a message…</div>
        </div>
      </div>
    </div>
  );
}
