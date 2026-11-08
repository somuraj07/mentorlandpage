"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  Briefcase, GraduationCap, HeartHandshake, IndianRupee, Rocket, Code2, Brain, Plane,
  Plus, Video, MessageCircle, ArrowUpRight, ArrowRight, Clock, Coins, CalendarCheck,
} from "lucide-react";
import { useRef, useState } from "react";
import { CURRENCY, EXAMPLE_RATES } from "@/lib/site";
import { WaitlistForm } from "./WaitlistForm";
import { AnimatedNumber, Countdown, EASE_OUT, FadeUp, Logo, RevealText, Tag } from "./ui";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

/* ───────────── Pricing calculator ───────────── */

export function Pricing() {
  const [mode, setMode] = useState<"video" | "message">("video");
  const [mins, setMins] = useState(20);
  const rate = EXAMPLE_RATES[mode];
  const total = rate * mins;
  const pct = ((mins - 5) / (90 - 5)) * 100;

  return (
    <section id="pricing" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Tag n="04">Pay by duration</Tag>
          <RevealText className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            Only pay for the minutes you talk.
          </RevealText>
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Every mentor shows a per-minute rate before you start. A quick 10-minute doubt costs a
              10-minute fee. A deep 60-minute session costs exactly that.
            </p>
            <ul className="mt-8 flex flex-col gap-3 text-[15px]">
              {(
                [
                  [Clock, "Billed by the minute, never by the hour"],
                  [Coins, "Rate shown up front — no hidden charges"],
                  [CalendarCheck, "End the session whenever you're done"],
                ] as const
              ).map(([Icon, t]) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-lavender-soft text-violet">
                    <Icon className="h-4 w-4" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <div className="relative overflow-hidden rounded-[36px] bg-card p-6 shadow-[0_40px_100px_-50px_rgba(62,42,158,0.55)] ring-1 ring-line sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-bold">Estimate a session</h3>
              <div role="radiogroup" aria-label="Session type" className="inline-flex rounded-full bg-paper p-1 text-sm">
                {(
                  [
                    ["video", "Video", Video],
                    ["message", "Message", MessageCircle],
                  ] as const
                ).map(([v, label, Icon]) => (
                  <button
                    key={v}
                    role="radio"
                    aria-checked={mode === v}
                    onClick={() => setMode(v)}
                    className={`relative flex min-h-[40px] items-center gap-1.5 rounded-full px-4 transition-colors ${mode === v ? "text-white" : "text-muted"}`}
                  >
                    {mode === v && (
                      <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-full bg-violet" transition={{ type: "spring", duration: 0.4, bounce: 0.15 }} />
                    )}
                    <Icon className="relative h-3.5 w-3.5" />
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 flex items-end justify-between gap-4">
              <div>
                <p className="label">Estimated cost</p>
                <p className="mt-2 font-display text-[clamp(3.4rem,10vw,6rem)] font-bold leading-none tracking-[-0.05em] tabular-nums">
                  {CURRENCY}
                  <AnimatedNumber value={total} />
                </p>
              </div>
              <p className="pb-2 text-right font-mono text-sm text-muted">
                <AnimatedNumber value={mins} /> min
                <br />× {CURRENCY}
                {rate}
              </p>
            </div>

            <div className="mt-8">
              <label htmlFor="mins" className="sr-only">
                Session length in minutes
              </label>
              <div className="relative h-12">
                <div className="absolute top-1/2 h-3 w-full -translate-y-1/2 rounded-full bg-paper-2" />
                <motion.div
                  className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-lavender to-violet"
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                />
                <motion.div
                  className="pointer-events-none absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink shadow-lg ring-4 ring-white"
                  animate={{ left: `${pct}%` }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                >
                  <span className="h-2 w-2 rounded-full bg-lime" />
                </motion.div>
                <input
                  id="mins"
                  type="range"
                  min={5}
                  max={90}
                  step={5}
                  value={mins}
                  onChange={(e) => setMins(Number(e.target.value))}
                  className="absolute inset-0 w-full cursor-pointer opacity-0"
                />
              </div>
              <div className="mt-2 flex justify-between font-mono text-xs text-faint">
                <span>5 min</span>
                <span>90 min</span>
              </div>
            </div>
            <p className="mt-6 text-xs text-faint">Example rate. Each mentor sets their own price.</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ───────────── Categories ───────────── */

const CATS = [
  { icon: Briefcase, t: "Career & jobs", d: "Switching roles, interviews, resumes, salary talks.", c: "bg-violet text-white", s: "text-white/70" },
  { icon: GraduationCap, t: "Studies & exams", d: "Competitive exams, college choice, study plans.", c: "bg-card", s: "text-muted" },
  { icon: Code2, t: "Tech & coding", d: "Debugging, system design, learning paths.", c: "bg-night text-white", s: "text-white/60" },
  { icon: Rocket, t: "Startups & business", d: "Ideas, pitch decks, first customers, fundraising.", c: "bg-lime", s: "text-ink/70" },
  { icon: IndianRupee, t: "Money", d: "Budgeting, saving, taxes, first investments.", c: "bg-card", s: "text-muted" },
  { icon: HeartHandshake, t: "Relationships", d: "Family, friendships, tough conversations.", c: "bg-lavender", s: "text-ink/70" },
  { icon: Brain, t: "Wellbeing", d: "Stress, burnout, motivation, routines.", c: "bg-card", s: "text-muted" },
  { icon: Plane, t: "Study & work abroad", d: "Applications, visas, settling in.", c: "bg-violet-deep text-white", s: "text-white/65" },
];

export function Categories() {
  return (
    <section className="overflow-hidden bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-3xl">
            <Tag n="05">Every kind of problem</Tag>
            <RevealText className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.045em]">
              On your mind? There&apos;s a mentor for it.
            </RevealText>
          </div>
          <span className="label hidden items-center gap-2 max-sm:inline-flex">
            Swipe <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
      <div className="no-scrollbar mx-auto mt-12 flex max-w-[1400px] snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-8 lg:grid-cols-4">
        {CATS.map((c, i) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: (i % 4) * 0.06 }}
            className={`group relative flex min-h-[300px] min-w-[76%] snap-start flex-col justify-between overflow-hidden rounded-[32px] p-6 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[280px] sm:min-w-0 ${c.c}`}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs opacity-60">0{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-current/10 transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:scale-110">
                <c.icon className="h-5 w-5" />
              </span>
            </div>
            <div>
              <h3 className="text-[1.7rem] font-bold leading-[1.05] tracking-[-0.03em]">{c.t}</h3>
              <p className={`mt-2 text-sm ${c.s}`}>{c.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── For mentors ───────────── */

function SpinBadge() {
  const text = "BECOME A SAATHI • EARN BY THE MINUTE • ";
  return (
    <div className="relative h-36 w-36 sm:h-44 sm:w-44">
      <svg viewBox="0 0 200 200" className="spin-slow h-full w-full" aria-hidden>
        <defs>
          <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill="currentColor" fontSize="15.5" fontFamily="var(--font-mono)" letterSpacing="3.2">
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 m-auto grid h-14 w-14 place-items-center rounded-full bg-lime text-ink sm:h-16 sm:w-16">
        <ArrowUpRight className="h-6 w-6" />
      </span>
    </div>
  );
}

export function Mentors() {
  return (
    <section id="mentors" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 sm:py-28">
      <div data-dark className="relative overflow-hidden rounded-[40px] bg-violet px-6 py-12 text-white sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute -bottom-40 -right-20 h-[520px] w-[520px] rounded-full border-[60px] border-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-10 right-40 h-[300px] w-[300px] rounded-full border-[40px] border-lime/10" />
        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <div className="flex items-start justify-between gap-6">
              <Tag n="06" dark>
                For mentors
              </Tag>
              <a href="#join" aria-label="Apply as a mentor" className="-mt-4 shrink-0 text-white lg:hidden">
                <SpinBadge />
              </a>
            </div>
            <RevealText className="mt-6 text-[clamp(2.6rem,6.4vw,5.6rem)] font-bold leading-[0.92] tracking-[-0.05em]">
              Know something worth sharing?
            </RevealText>
            <FadeUp delay={0.15}>
              <p className="serif-accent mt-3 text-[clamp(2rem,4.6vw,3.6rem)] leading-none text-lime">Become a Saathi.</p>
              <p className="mt-6 max-w-lg text-lg text-white/75">
                Turn what you&apos;ve learned into income. Set your own per-minute rate, open the hours that
                suit you, and get paid for every minute you help.
              </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.2}>
            <div className="mb-8 hidden justify-end lg:flex">
              <a href="#join" aria-label="Apply as a mentor" className="text-white transition-transform duration-300 hover:scale-105">
                <SpinBadge />
              </a>
            </div>
            <ul className="flex flex-col gap-2.5">
              {["Set your own rate", "Choose your hours", "Paid for every minute"].map((t, i) => (
                <motion.li
                  key={t}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
                  className="flex items-center justify-between rounded-2xl bg-white/10 px-5 py-4 backdrop-blur"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/50">0{i + 1}</span>
                    {t}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-lime" />
                </motion.li>
              ))}
              <a href="#join" className="btn btn-lime mt-3 px-6 py-3.5 text-base">
                Apply as a mentor <ArrowRight className="h-4 w-4" />
              </a>
            </ul>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */

const FAQS = [
  ["When does SAATHYAKI launch?", "We're opening in early 2027. Join the waitlist and you'll be among the first to get access."],
  ["How does per-minute billing work?", "Each mentor shows their rate per minute. The meter starts when the session starts and stops when either of you ends it. You pay only for that time."],
  ["Can I choose between video and chat?", "Yes. Pick a video call when you want to talk face to face, or a message session when you'd rather write and read at your own pace."],
  ["What kinds of problems can I bring?", "Almost anything — careers, exams, coding, business, money, relationships, wellbeing. If someone has been through it, they can help."],
  ["Is SAATHYAKI a replacement for therapy or medical help?", "No. Mentors share lived experience and practical advice. For medical or mental-health emergencies, please contact a licensed professional or local helpline."],
  ["How do I become a mentor?", 'Pick "Mentor others" when you join the waitlist. We\'ll reach out with the application before launch.'],
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Tag n="07">FAQ</Tag>
          <RevealText className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            Questions, answered.
          </RevealText>
        </div>
        <div className="flex flex-col">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="border-b border-line">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex min-h-[72px] w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-violet">0{i + 1}</span>
                    <span className="font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">{q}</span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-200 ${isOpen ? "bg-violet text-white" : "bg-lavender-soft text-violet group-hover:bg-lavender"}`}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pl-9 pr-12 text-muted">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Final CTA + Footer ───────────── */

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const reduce = !!useReducedMotion();
  return (
    <section ref={ref} id="join" data-dark className="relative isolate overflow-hidden bg-night px-4 py-24 text-white sm:px-8 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(107,78,255,0.45),transparent)]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46%] opacity-90 sm:inset-y-0 sm:left-auto sm:right-[-12%] sm:h-full sm:w-[60%]">
        {inView && <Scene3D active={inView} reduce={reduce} />}
      </div>
      <div className="relative mx-auto max-w-[1400px] pt-[28vh] sm:pt-0">
        <Tag n="08" dark>
          Early access
        </Tag>
        <h2 className="mt-6 max-w-4xl text-[clamp(3rem,9vw,8.5rem)] font-bold leading-[0.88] tracking-[-0.055em]">
          <RevealText as="span" className="block">
            Your saathi is
          </RevealText>
          <RevealText as="span" delay={0.15} className="serif-accent block text-lavender">
            almost here.
          </RevealText>
        </h2>
        <FadeUp delay={0.2}>
          <p className="mt-6 max-w-lg text-lg text-white/65">
            Join the waitlist for first access, launch offers and a heads-up the moment mentors go live.
          </p>
        </FadeUp>
        <div className="mt-10 flex flex-col gap-8">
          <FadeUp delay={0.3}>
            <WaitlistForm dark />
          </FadeUp>
          <FadeUp delay={0.4}>
            <Countdown dark size="lg" />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["35%", "0%"]);
  return (
    <footer ref={ref} data-dark className="overflow-hidden bg-night text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 border-t border-white/10 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Logo light />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/60">
          {[
            ["How it works", "#how"],
            ["Pricing", "#pricing"],
            ["Mentors", "#mentors"],
            ["FAQ", "#faq"],
          ].map(([l, h]) => (
            <a key={h} href={h} className="py-2 transition-colors hover:text-lime">
              {l}
            </a>
          ))}
        </nav>
        <p className="text-sm text-white/40">© 2026 SAATHYAKI</p>
      </div>
      <motion.p
        style={{ y }}
        aria-hidden
        className="select-none pb-4 text-center font-display text-[20vw] font-bold leading-[0.8] tracking-[-0.06em] text-lavender/[0.16]"
      >
        SAATHYAKI
      </motion.p>
    </footer>
  );
}
