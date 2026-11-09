"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Mic, MicOff, Video, MonitorUp, PhoneOff, Captions, Signal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CURRENCY, EXAMPLE_RATES } from "@/lib/site";
import { EASE_OUT } from "./ui";

// Stand-in photographs from Unsplash (free licence). Swap for real mentor footage later.
const MENTOR = {
  name: "Ananya",
  role: "Product mentor",
  src: "https://images.unsplash.com/photo-1770626899426-baed57609a30?w=1200&h=900&fit=crop&crop=faces&q=75",
};
const YOU = {
  name: "Rahul",
  role: "You",
  src: "https://images.unsplash.com/photo-1761980958548-7babac83ef3d?w=400&h=300&fit=crop&crop=faces&q=75",
};

const LINES = [
  { who: 0, text: "So tell me about the last release you tested." },
  { who: 1, text: "Umm, I caught a payment bug two days before launch." },
  { who: 0, text: "That's a product story, honestly. Lead with what it saved." },
  { who: 1, text: "Oh. So not just what I did, but why it mattered?" },
  { who: 0, text: "Exactly. Let's rewrite your first answer together." },
];

function Bars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0, 1, 2].map((k) => (
        <motion.span
          key={k}
          className="w-[3px] rounded-full bg-lime"
          animate={{ height: [3, 12, 5, 10, 3] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.13 }}
        />
      ))}
    </span>
  );
}

/** A real-looking 1-on-1 video call: mentor on the main stage, your camera in the corner, live captions. */
export function Meeting() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [n, setN] = useState(0);
  const [secs, setSecs] = useState(12 * 60 + 41);

  useEffect(() => {
    if (!inView) return;
    // natural pacing: longer lines stay longer
    const t = setTimeout(() => setN((v) => (v + 1) % LINES.length), 1400 + LINES[n].text.length * 38);
    return () => clearTimeout(t);
  }, [n, inView]);

  useEffect(() => {
    if (!inView) return;
    const c = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(c);
  }, [inView]);

  const line = LINES[n];
  const mentorTalking = line.who === 0;
  const cost = Math.round((secs / 60) * EXAMPLE_RATES.video);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0816]">
      {/* main stage */}
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
        {/* slow drift so the frame feels like live video, not a still */}
        <motion.div
          className="absolute inset-0"
          animate={reduce ? { scale: 1.3 } : { scale: [1.3, 1.36, 1.32], x: [0, -6, 4], y: [0, 3, -2] }}
          style={{ transformOrigin: "52% 42%" }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          <Image src={MENTOR.src} alt="Mentor on a video call" fill sizes="(min-width: 768px) 560px, 92vw" className="object-cover object-[52%_42%]" />
        </motion.div>
        {/* lens vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))]" />

        {/* speaking outline */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-[3px] ring-inset ring-lime"
          animate={{ opacity: mentorTalking ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />

        {/* top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/55 to-transparent px-3 pb-6 pt-2.5 text-[11px] text-white sm:text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="font-mono tabular-nums">
              {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
            </span>
            <Signal className="ml-1 h-3 w-3 text-white/70" />
          </span>
          <span className="rounded-md bg-lime px-1.5 py-0.5 font-mono font-medium tabular-nums text-ink">
            {CURRENCY}
            {cost} · {CURRENCY}
            {EXAMPLE_RATES.video}/min
          </span>
        </div>

        {/* name tag */}
        <div className="absolute bottom-[58px] left-3 flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-black/50 px-2 py-1 text-[11px] text-white backdrop-blur-sm sm:text-xs">
          {mentorTalking ? <Bars /> : <Mic className="h-3 w-3 text-white/70" />}
          {MENTOR.name}
          <span className="hidden text-white/55 sm:inline">· {MENTOR.role}</span>
        </div>

        {/* self view (picture in picture) */}
        <div className="absolute right-3 top-10 aspect-[4/3] w-[34%] overflow-hidden rounded-xl border border-white/20 shadow-lg sm:top-11 sm:w-[30%]">
          <Image src={YOU.src} alt="Learner's camera" fill sizes="200px" className="object-cover object-[50%_25%]" />
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-inset ring-lime"
            animate={{ opacity: mentorTalking ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          />
          <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
            {mentorTalking ? <MicOff className="h-2.5 w-2.5 text-white/60" /> : <Bars />}
            {YOU.role}
          </span>
        </div>

        {/* live captions */}
        <div className="absolute inset-x-3 bottom-3 h-[42px] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={n}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="line-clamp-2 rounded-lg bg-black/65 px-2.5 py-1.5 text-[12px] leading-snug text-white sm:text-[13px]"
            >
              <span className={mentorTalking ? "text-lavender" : "text-lime"}>{mentorTalking ? MENTOR.name : YOU.name}: </span>
              {line.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <span className="hidden items-center gap-1.5 text-[12px] text-white/50 sm:flex">
          <Captions className="h-3.5 w-3.5" /> Captions on
        </span>
        <div className="mx-auto flex gap-2 sm:mx-0">
          {[Mic, Video, MonitorUp].map((Icon, k) => (
            <span key={k} className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white">
              <Icon className="h-4 w-4" />
            </span>
          ))}
          <span className="grid h-9 w-11 place-items-center rounded-xl bg-red-500 text-white">
            <PhoneOff className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
