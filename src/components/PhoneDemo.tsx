"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import {
  Search, Mic, Video, PhoneOff, MessageSquare, Check, Star, Briefcase, GraduationCap, Rocket, Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CURRENCY, EXAMPLE_RATES } from "@/lib/site";
import { EASE_OUT } from "./ui";

/** The five beats of a SAATHYAKI session, played on a phone in a loop. */
export const SCENES = [
  { key: "ask", label: "Describe your problem", ms: 3600 },
  { key: "match", label: "Pick a mentor", ms: 3400 },
  { key: "call", label: "Talk on video", ms: 3800 },
  { key: "chat", label: "Or chat", ms: 3600 },
  { key: "pay", label: "Pay only for minutes", ms: 3200 },
] as const;

const PROBLEM = "I have 3 years in QA. How do I move into product management?";

function AskScene() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => Math.min(PROBLEM.length, v + 2)), 45);
    return () => clearInterval(t);
  }, []);
  const done = n >= PROBLEM.length;
  return (
    <div className="flex h-full flex-col px-4 pt-3 text-ink">
      <p className="text-[11px] text-muted">Hi Rahul 👋</p>
      <h4 className="mt-1 font-display text-[22px] font-bold leading-[1.1] tracking-tight">What&apos;s on your mind today?</h4>
      <div className="mt-4 min-h-[92px] rounded-2xl border border-line bg-white p-3 text-[13px] leading-snug text-ink shadow-sm">
        {PROBLEM.slice(0, n)}
        {!done && <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-ink align-middle" />}
      </div>
      <p className="mt-4 text-[10px] font-medium uppercase tracking-wider text-faint">Topics</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {[
          [Briefcase, "Career"],
          [GraduationCap, "Skills"],
          [Rocket, "Product"],
        ].map(([Icon, t], i) => {
          const I = Icon as typeof Briefcase;
          return (
            <motion.span
              key={t as string}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={done ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="inline-flex items-center gap-1 rounded-full bg-violet px-2.5 py-1 text-[11px] font-medium text-white"
            >
              <I className="h-3 w-3" />
              {t as string}
            </motion.span>
          );
        })}
      </div>
      <motion.div
        animate={done ? { scale: [1, 0.96, 1] } : {}}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="mt-auto mb-4 flex items-center justify-center gap-2 rounded-2xl bg-ink py-3 text-[13px] font-medium text-white"
      >
        <Search className="h-3.5 w-3.5" /> Find mentors
      </motion.div>
    </div>
  );
}

const MENTORS = [
  { i: "AR", name: "Ananya R.", role: "Product Lead · ex-QA", yrs: "9 yrs", rate: 15, c: "from-[#c8b8ff] to-[#6b4eff]" },
  { i: "VK", name: "Vikram K.", role: "Senior PM", yrs: "12 yrs", rate: 20, c: "from-[#e6ffa0] to-[#9cc22e]" },
  { i: "MS", name: "Meera S.", role: "Career coach", yrs: "7 yrs", rate: 12, c: "from-[#ffd0e8] to-[#d0559b]" },
];

function MatchScene() {
  const [sel, setSel] = useState(-1);
  useEffect(() => {
    const t = setTimeout(() => setSel(0), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex h-full flex-col px-4 pt-3 text-ink">
      <p className="text-[11px] text-muted">3 mentors have solved this</p>
      <h4 className="mt-1 font-display text-[22px] font-bold leading-[1.1] tracking-tight">Matched for you</h4>
      <div className="mt-4 flex flex-col gap-2">
        {MENTORS.map((m, i) => (
          <motion.div
            key={m.i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0, scale: sel === i ? 1.02 : 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.12 }}
            className={`flex items-center gap-2.5 rounded-2xl border bg-white p-2.5 transition-colors duration-300 ${
              sel === i ? "border-violet ring-2 ring-violet/20" : "border-line"
            }`}
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${m.c} text-[11px] font-bold text-ink`}>
              {m.i}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[13px] font-semibold">
                {m.name}
                {i === 0 && <Star className="h-3 w-3 fill-violet text-violet" />}
              </p>
              <p className="truncate text-[11px] text-muted">
                {m.role} · {m.yrs}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-[13px] font-bold">
                {CURRENCY}
                {m.rate}
              </p>
              <p className="text-[9px] text-muted">/min</p>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {sel === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-auto mb-4 grid grid-cols-2 gap-2 text-[12px] font-medium"
          >
            <span className="flex items-center justify-center gap-1.5 rounded-2xl bg-violet py-3 text-white">
              <Video className="h-3.5 w-3.5" /> Video call
            </span>
            <span className="flex items-center justify-center gap-1.5 rounded-2xl border border-line bg-white py-3">
              <MessageSquare className="h-3.5 w-3.5" /> Chat
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CallScene() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 60);
    return () => clearInterval(t);
  }, []);
  // fast-forward clock: one tick = 4 seconds of call
  const secs = 14 * 60 + s * 4;
  const cost = ((secs / 60) * EXAMPLE_RATES.video).toFixed(0);
  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-[#2a1d55] via-[#1a1236] to-[#0e0918] text-white">
      <div className="absolute left-1/2 top-[34%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(107,78,255,0.55),transparent)]" />
      <div className="relative flex items-center justify-between px-4 pt-3 text-[11px]">
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 font-mono tabular-nums">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
        </span>
        <span className="rounded-full bg-lime px-2 py-1 font-mono font-semibold tabular-nums text-ink">
          {CURRENCY}
          {cost}
        </span>
      </div>
      <div className="relative mt-10 flex flex-col items-center">
        <div className="relative grid h-28 w-28 place-items-center">
          <span className="pulse-ring absolute inset-0 rounded-full bg-lavender/40" />
          <span className="relative grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-[#c8b8ff] to-[#6b4eff] font-display text-3xl font-bold">
            AR
          </span>
        </div>
        <p className="mt-4 font-display text-lg font-semibold">Ananya R.</p>
        <p className="text-[11px] text-white/60">Product Lead · {CURRENCY}15/min</p>
        <div className="mt-5 flex h-7 items-end gap-[3px]">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-white/70"
              animate={{ height: [4, 6 + ((i * 37) % 20), 4] }}
              transition={{ duration: 0.8 + (i % 4) * 0.12, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 }}
            />
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative mx-4 mt-6 rounded-2xl bg-white/10 px-3 py-2 text-[11px] text-white/85 backdrop-blur"
      >
        “Let&apos;s map your QA wins to PM skills first…”
      </motion.div>
      <div className="absolute right-3 top-12 grid h-20 w-14 place-items-center rounded-xl border border-white/15 bg-gradient-to-b from-[#2c3a10] to-[#151d07]">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-lime text-[9px] font-bold text-ink">You</span>
      </div>
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-3">
        {[Mic, Video, MessageSquare].map((Icon, i) => (
          <span key={i} className="grid h-10 w-10 place-items-center rounded-full bg-white/12 bg-white/10">
            <Icon className="h-4 w-4" />
          </span>
        ))}
        <span className="grid h-10 w-12 place-items-center rounded-full bg-red-500">
          <PhoneOff className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

const MSGS = [
  { me: true, t: "Here's my resume 📄" },
  { me: false, t: "Rewrite these 3 bullets as product outcomes." },
  { me: false, t: "Then message me — I'll review tonight." },
  { me: true, t: "On it. Thank you! 🙏" },
];

function ChatScene() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setN((v) => Math.min(MSGS.length, v + 1)), 750);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex h-full flex-col text-ink">
      <div className="flex items-center gap-2.5 border-b border-line px-4 pb-2.5 pt-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#c8b8ff] to-[#6b4eff] text-[10px] font-bold text-white">AR</span>
        <div className="flex-1">
          <p className="text-[13px] font-semibold">Ananya R.</p>
          <p className="text-[10px] text-live">● Online · {CURRENCY}8/min chat</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1.5 px-3 pb-2">
        <AnimatePresence initial={false}>
          {MSGS.slice(0, n).map((m) => (
            <motion.div
              key={m.t}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className={`max-w-[82%] rounded-2xl px-3 py-2 text-[12px] leading-snug ${
                m.me ? "self-end rounded-br-md bg-violet text-white" : "self-start rounded-bl-md bg-white shadow-sm"
              }`}
            >
              {m.t}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mx-3 mb-4 flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-3.5 pr-1.5 text-[12px] text-faint">
        <span className="flex-1">Message…</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-violet text-white">
          <Send className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

function PayScene() {
  const mins = 18;
  return (
    <div className="flex h-full flex-col items-center px-5 pt-8 text-center text-ink">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-lime"
      >
        <Check className="h-8 w-8 text-ink" strokeWidth={3} />
      </motion.span>
      <h4 className="mt-4 font-display text-[22px] font-bold leading-tight tracking-tight">Session complete</h4>
      <p className="mt-1 text-[12px] text-muted">with Ananya R.</p>
      <div className="mt-6 w-full rounded-2xl border border-line bg-white p-4 text-left text-[13px]">
        {[
          ["Video call", `${mins} min`],
          ["Rate", `${CURRENCY}${EXAMPLE_RATES.video}/min`],
        ].map(([k, v], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="flex justify-between py-1.5 text-muted"
          >
            <span>{k}</span>
            <span className="font-mono text-ink">{v}</span>
          </motion.div>
        ))}
        <div className="my-2 border-t border-dashed border-line" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-baseline justify-between"
        >
          <span className="font-semibold">You paid</span>
          <span className="font-display text-2xl font-bold">
            {CURRENCY}
            {mins * EXAMPLE_RATES.video}
          </span>
        </motion.div>
      </div>
      <p className="mt-4 text-[11px] text-muted">No subscription. Just the minutes you used.</p>
    </div>
  );
}

const VIEWS = { ask: AskScene, match: MatchScene, call: CallScene, chat: ChatScene, pay: PayScene };

/** iPhone-style frame running the session story. Pauses off screen. */
export function PhoneDemo({ onStep }: { onStep?: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SCENES.length), SCENES[i].ms);
    return () => clearTimeout(t);
  }, [i, inView]);

  useEffect(() => onStep?.(i), [i, onStep]);

  const scene = SCENES[i];
  const View = VIEWS[scene.key];
  const darkScreen = scene.key === "call";

  return (
    <div ref={ref} className="relative mx-auto w-[272px] sm:w-[300px]">
      <div className="relative rounded-[48px] bg-[#0b0712] p-[9px] shadow-[0_60px_120px_-40px_rgba(62,42,158,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]">
        <div className={`relative h-[560px] overflow-hidden rounded-[40px] sm:h-[580px] ${darkScreen ? "bg-night text-white" : "bg-paper text-ink"} transition-colors duration-300`}>
          {/* status bar + island */}
          <div className={`relative z-20 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold ${darkScreen ? "text-white" : "text-ink"}`}>
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
            <span className="flex items-center gap-1">
              <span className="h-2 w-3.5 rounded-[3px] border border-current" />
            </span>
          </div>
          {/* story progress */}
          <div className="relative z-20 mt-4 flex gap-1 px-4">
            {SCENES.map((s, k) => (
              <span key={s.key} className={`h-[3px] flex-1 overflow-hidden rounded-full ${darkScreen ? "bg-white/20" : "bg-ink/10"}`}>
                {k < i && <span className={`block h-full w-full ${darkScreen ? "bg-white" : "bg-violet"}`} />}
                {k === i && (
                  <motion.span
                    key={`${i}-${inView}`}
                    className={`block h-full ${darkScreen ? "bg-white" : "bg-violet"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: inView ? "100%" : "0%" }}
                    transition={{ duration: scene.ms / 1000, ease: "linear" }}
                  />
                )}
              </span>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 top-[58px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={scene.key}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -40, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <View />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
