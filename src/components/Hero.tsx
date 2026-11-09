"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Clock3, Hand } from "lucide-react";
import { useEffect, useState } from "react";
import { useIntroDone } from "./Intro";
import { PhoneDemo, SCENES } from "./PhoneDemo";
import { WaitlistForm } from "./WaitlistForm";
import { EASE_OUT } from "./ui";

const TOPICS = ["career", "exams", "startup", "money", "next move"];

function RotatingWord({ ready }: { ready: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => setI((v) => (v + 1) % TOPICS.length), 2200);
    return () => clearInterval(t);
  }, [ready]);
  return (
    <span className="relative block h-[1.08em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={TOPICS[i]}
          className="serif-accent absolute left-0 top-0 block whitespace-nowrap text-lavender"
          initial={{ y: "100%", rotate: 4, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          exit={{ y: "-100%", rotate: -4, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {TOPICS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const ready = useIntroDone();
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 18 });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 18 });

  const enter = (d: number) => ({
    initial: { opacity: 0, y: 22, filter: "blur(8px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 0.9, ease: EASE_OUT, delay: d },
  });

  const line = (text: string, d: number) => (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={ready ? { y: 0 } : {}}
        transition={{ duration: 1, ease: EASE_OUT, delay: d }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <section id="top" className="relative isolate overflow-hidden bg-night text-white" aria-label="SAATHYAKI mentorship">
      {/* stage */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[10%] h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(closest-side,rgba(107,78,255,0.45),transparent)] max-lg:left-1/2 max-lg:top-[58%] max-lg:-translate-x-1/2" />
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-14 px-4 pb-20 pt-28 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-10 lg:pt-24">
        {/* ── message ── */}
        <div className="relative z-10">
          <motion.div {...enter(0.05)}>
            <p className="flex items-center gap-2 text-sm text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              Consoling and problem solving, opening 26 January 2027
            </p>
          </motion.div>

          <h1 className="mt-6 text-[clamp(2.7rem,min(11vw,9svh),5.4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
            <span>
              {line("Talk to a mentor", 0.15)}
              {line("about your", 0.25)}
              <motion.span
                className="block"
                initial={{ opacity: 0 }}
                animate={ready ? { opacity: 1 } : {}}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <RotatingWord ready={ready} />
              </motion.span>
            </span>
          </h1>

          <motion.p {...enter(0.55)} className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/70 sm:text-lg">
            SAATHYAKI is one-on-one consoling and problem solving for whatever&apos;s on your mind. Talk it
            through on video or chat with a mentor who&apos;s been there, and pay only for the minutes you talk.
          </motion.p>

          <motion.div {...enter(0.7)} className="mt-7" id="join-hero">
            <WaitlistForm dark />
          </motion.div>

          {/* steps — kept in sync with the phone (desktop) */}
          <motion.ol {...enter(0.85)} className="mt-8 hidden max-w-xl grid-cols-5 gap-2 lg:grid" aria-label="How a session works">
            {SCENES.map((s, k) => (
              <li key={s.key} className="flex flex-col gap-2">
                <span className="h-[3px] overflow-hidden rounded-full bg-white/10">
                  <motion.span
                    className="block h-full bg-lime"
                    animate={{ width: k < step ? "100%" : k === step ? "100%" : "0%" }}
                    transition={{ duration: k === step ? s.ms / 1000 : 0.3, ease: "linear" }}
                    key={k === step ? `on-${step}` : `off-${k}`}
                    initial={{ width: k < step ? "100%" : "0%" }}
                  />
                </span>
                <span className={`text-[12px] leading-tight transition-colors duration-300 ${k === step ? "text-white" : "text-white/40"}`}>
                  <span className="font-mono text-[10px] text-lavender">0{k + 1}</span>
                  <br />
                  {s.label}
                </span>
              </li>
            ))}
          </motion.ol>
        </div>

        {/* ── product in motion ── */}
        <motion.div
          className="relative flex justify-center"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          initial={{ opacity: 0, y: 60, rotate: -4 }}
          animate={ready ? { opacity: 1, y: 0, rotate: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.35 }}
        >

          <motion.div style={reduce ? {} : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }}>
            <PhoneDemo onStep={setStep} />
          </motion.div>

          {/* annotations (desktop) */}
          <motion.div
            {...enter(1.1)}
            className="absolute right-[calc(50%+132px)] top-[24%] hidden whitespace-nowrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-[13px] backdrop-blur-md xl:flex"
          >
            <Clock3 className="h-4 w-4 text-lime" />
            Rate shown up front
          </motion.div>
          <motion.div
            {...enter(1.25)}
            className="absolute bottom-[20%] left-[calc(50%+132px)] hidden whitespace-nowrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-3.5 py-2.5 text-[13px] backdrop-blur-md xl:flex"
          >
            <Hand className="h-4 w-4 text-lavender" />
            End anytime
          </motion.div>

          {/* current step label (mobile) */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 lg:hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm"
              >
                <span className="font-mono text-xs text-lime">0{step + 1}/05</span>
                {SCENES[step].label}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
