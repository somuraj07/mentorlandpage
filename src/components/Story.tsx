"use client";

import {
  AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity,
  type MotionValue,
} from "motion/react";
import { Search, Video, MessageCircle, ShieldCheck, Timer, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CURRENCY, EXAMPLE_RATES } from "@/lib/site";
import { CallMock } from "./CallMock";
import { Meeting } from "./Meeting";
import { EASE_OUT, FadeUp, RevealText, Stagger, StaggerItem, Tag } from "./ui";

/* ───────────── Crossing bands ───────────── */

const TOPICS_A = ["Career switch", "Interview prep", "UPSC strategy", "Startup pitch", "Salary talks", "Study abroad", "First job", "Freelancing"];
const TOPICS_B = ["Exam anxiety", "Coding doubts", "Personal finance", "Burnout", "Side business", "Public speaking", "College choice", "Portfolio review"];

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Sticker band that drifts on its own and speeds up with the scroll (Framer Motion). */
function Band({ items, className, speed = 3 }: { items: string[]; className: string; speed?: number }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    const move = dir.current * speed * (delta / 1000) * (1 + Math.abs(b));
    baseX.set(baseX.get() - move);
  });

  return (
    <div className={`flex overflow-hidden py-4 sm:py-5 ${className}`}>
      <motion.div className="flex shrink-0 items-center will-change-transform" style={{ x }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-display text-2xl font-semibold tracking-tight sm:text-4xl">
            <span className="px-5 sm:px-8">{t}</span>
            <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-current opacity-60" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Bands() {
  return (
    <section aria-label="Problems people bring" className="relative overflow-hidden bg-paper py-16 sm:py-24">
      <div className="relative -mx-8">
        <Band items={TOPICS_A} speed={3} className="-rotate-[4deg] bg-violet text-white shadow-[0_20px_50px_-20px_rgba(107,78,255,0.6)]" />
        <Band items={TOPICS_B} speed={-2.4} className="relative -mt-3 rotate-[3deg] bg-lime text-ink" />
      </div>
    </section>
  );
}

/* ───────────── Product showcase ───────────── */

export function Showcase() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-24 pt-8 sm:px-8 sm:pb-32">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Tag n="01">The product</Tag>
          <RevealText className="mt-5 max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            A real conversation, a fair meter
          </RevealText>
        </div>
        <FadeUp>
          <p className="max-w-xs text-muted lg:text-right">
            See the rate before you start. Watch the minutes as you talk. Hang up and you&apos;re done.
          </p>
        </FadeUp>
      </div>
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 60, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <CallMock />
      </motion.div>
    </section>
  );
}

/* ───────────── How it works: stacking cards ───────────── */

function TypingSearch() {
  const text = "How do I switch from QA to product?";
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v > text.length + 18 ? 0 : v + 1)), 70);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="rounded-3xl bg-white p-4 shadow-[0_20px_50px_-30px_rgba(40,20,90,0.5)]">
      <div className="flex items-center gap-2 rounded-2xl border border-line px-3 py-3.5 text-sm">
        <Search className="h-4 w-4 shrink-0 text-faint" />
        <span className="truncate">{text.slice(0, n)}</span>
        <span className="-ml-1.5 h-4 w-px shrink-0 animate-pulse bg-ink" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["Career", "Product", "Tech"].map((t, i) => (
          <motion.span
            key={t}
            animate={{ opacity: n > 12 + i * 6 ? 1 : 0.25, scale: n > 12 + i * 6 ? 1 : 0.92 }}
            className="rounded-full bg-violet px-3 py-1 text-xs font-medium text-white"
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

const PEOPLE = [
  { i: "AR", name: "Ananya", role: "Product · 9 yrs", rate: 15, c: "from-[#c8b8ff] to-[#6b4eff]" },
  { i: "VK", name: "Vikram", role: "Engineering · 12 yrs", rate: 20, c: "from-[#e6ffa0] to-[#9cc22e]" },
  { i: "MS", name: "Meera", role: "Careers · 7 yrs", rate: 12, c: "from-[#ffd0e8] to-[#d0559b]" },
];

function MentorPick() {
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSel((s) => (s + 1) % PEOPLE.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-1.5 rounded-3xl bg-white/[0.08] p-2.5 ring-1 ring-white/15">
      {PEOPLE.map((p, i) => (
        <div key={p.i} className="relative flex items-center gap-3 rounded-2xl px-3 py-2.5">
          {sel === i && (
            <motion.span
              layoutId="mentor-sel"
              className="absolute inset-0 rounded-2xl bg-white"
              transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            />
          )}
          <span className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${p.c} text-xs font-medium text-ink`}>
            {p.i}
          </span>
          <div className={`relative flex-1 text-sm transition-colors duration-300 ${sel === i ? "text-ink" : "text-white"}`}>
            <p className="font-semibold">{p.name}</p>
            <p className={`text-xs ${sel === i ? "text-muted" : "text-white/60"}`}>{p.role}</p>
          </div>
          <span className={`relative font-mono text-xs transition-colors duration-300 ${sel === i ? "text-violet" : "text-white/60"}`}>
            {CURRENCY}
            {p.rate}/min
          </span>
        </div>
      ))}
    </div>
  );
}

function MeterCard() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s >= 40 ? 0 : s + 1)), 120);
    return () => clearInterval(t);
  }, []);
  const mins = Math.floor((secs / 40) * 25);
  return (
    <div className="rounded-3xl bg-ink p-5 text-white">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="relative h-2 w-2 rounded-full bg-lime" />
          </span>
          Live with Ananya
        </span>
        <span className="font-mono tabular-nums text-white/60">{String(mins).padStart(2, "0")}:00</span>
      </div>
      <div className="mt-5 flex h-10 items-end gap-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm transition-colors duration-150 ${i < mins ? "bg-lime" : "bg-white/10"}`}
            style={{ height: `${40 + ((i * 37) % 60)}%` }}
          />
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between">
        <span className="text-xs text-white/50">You pay</span>
        <span className="font-display text-4xl font-medium tabular-nums">
          {CURRENCY}
          {mins * EXAMPLE_RATES.video}
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Say what's going on",
    body: "Describe the problem in your own words. We match it to mentors who've handled the same thing.",
    visual: <TypingSearch />,
    theme: "bg-lavender-soft text-ink",
    sub: "text-muted",
  },
  {
    n: "02",
    title: "Pick your saathi",
    body: "See each mentor's background and per-minute rate up front. Choose the one who fits.",
    visual: <MentorPick />,
    theme: "bg-violet text-white",
    sub: "text-white/75",
  },
  {
    n: "03",
    title: "Talk, then pay for minutes",
    body: "Start a video call or a chat. The meter runs only while you talk — end anytime.",
    visual: <MeterCard />,
    theme: "bg-lime text-ink",
    sub: "text-ink/70",
  },
];

function StepCard({ s, i, progress }: { s: (typeof STEPS)[number]; i: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const start = i / STEPS.length;
  const scale = useTransform(progress, [start, 1], [1, 1 - (STEPS.length - 1 - i) * 0.05]);
  return (
    <div className="sticky" style={{ top: `calc(84px + ${i * 22}px)` }}>
      <motion.article
        style={reduce ? {} : { scale, transformOrigin: "50% 0%" }}
        className={`grid gap-8 overflow-hidden rounded-3xl p-6 sm:rounded-3xl sm:p-10 md:min-h-[460px] md:grid-cols-[1.1fr_1fr] md:items-center md:p-14 ${s.theme}`}
      >
        <div className="flex h-full flex-col">
          <span className="font-display text-[5.5rem] font-medium leading-none tracking-[-0.03em] opacity-90 sm:text-[8rem]">{s.n}</span>
          <h3 className="mt-6 text-[2rem] font-medium leading-[1] tracking-[-0.025em] sm:text-5xl">{s.title}</h3>
          <p className={`mt-4 max-w-md text-base sm:text-lg ${s.sub}`}>{s.body}</p>
        </div>
        <div>{s.visual}</div>
      </motion.article>
    </div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="how" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
        <div>
          <Tag n="02">How it works</Tag>
          <RevealText className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            Stuck to sorted in three moves
          </RevealText>
        </div>
        <FadeUp>
          <p className="max-w-md text-lg text-muted lg:ml-auto">
            No subscriptions and no long packages. Find someone who gets it, talk for as long as you need,
            and that&apos;s the whole bill.
          </p>
        </FadeUp>
      </div>
      <div ref={ref} className="flex flex-col gap-6 pb-[6vh]">
        {STEPS.map((s, i) => (
          <StepCard key={s.n} s={s} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

/* ───────────── Modes (bento) ───────────── */

const THREAD = [
  { me: true, t: "Got rejected after the final round again" },
  { me: false, t: "That's frustrating. Send me the questions they asked?" },
  { me: true, t: "Sure — sending now" },
  { me: false, t: "Your answers are strong. The gap is how you end. Let's fix that." },
];

function ChatLoop() {
  const [n, setN] = useState(1);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    let inner: ReturnType<typeof setTimeout>;
    const t = setInterval(() => {
      setTyping(true);
      inner = setTimeout(() => {
        setTyping(false);
        setN((v) => (v >= THREAD.length ? 1 : v + 1));
      }, 900);
    }, 2600);
    return () => {
      clearInterval(t);
      clearTimeout(inner);
    };
  }, []);
  return (
    <div className="flex h-[250px] flex-col justify-end gap-2 overflow-hidden">
      <AnimatePresence initial={false}>
        {THREAD.slice(0, n).map((m) => (
          <motion.div
            key={m.t}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-sm ${
              m.me ? "self-end rounded-br-md bg-violet text-white" : "self-start rounded-bl-md bg-white text-ink"
            }`}
          >
            {m.t}
          </motion.div>
        ))}
        {typing && (
          <motion.div
            key="typing"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex gap-1 self-start rounded-3xl bg-white px-4 py-3"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-faint"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Modes() {
  return (
    <section id="modes" className="mx-auto max-w-[1400px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
        <div>
          <Tag n="03">Video or message</Tag>
          <RevealText className="mt-5 text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            Face to face, or at your own pace
          </RevealText>
        </div>
        <FadeUp>
          <p className="max-w-sm text-lg text-muted lg:ml-auto">
            Some problems need a real conversation. Others need a thoughtful reply you can read twice.
            Choose per session.
          </p>
        </FadeUp>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <FadeUp className="md:col-span-3">
          <div data-dark className="relative h-full overflow-hidden rounded-3xl bg-night p-7 text-white sm:p-10">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(107,78,255,0.7),transparent)]" />
            <div className="relative">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet">
                <Video className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-3xl font-medium tracking-tight sm:text-4xl">Video calls</h3>
              <p className="mt-2 max-w-sm text-white/60">
                One-on-one HD calls with screen share, for mock interviews, code reviews and talks that need
                a face.
              </p>
            </div>
            <div className="relative mt-8">
              <Meeting />
            </div>
          </div>
        </FadeUp>

        <FadeUp className="md:col-span-3" delay={0.08}>
          <div className="h-full rounded-3xl bg-lavender-soft p-7 sm:p-10">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h3 className="mt-6 text-3xl font-medium tracking-tight sm:text-4xl">Messages</h3>
            <p className="mt-2 max-w-sm text-muted">
              Write when it suits you, attach files, and get replies you can come back to. Billed by session
              length.
            </p>
            <div className="mt-6">
              <ChatLoop />
            </div>
          </div>
        </FadeUp>

        <Stagger className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:col-span-6 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
          {[
            { icon: Timer, title: "Per-minute billing", body: "The meter runs only while the session is live." },
            { icon: Wallet, title: "No subscription", body: "Top up a wallet and spend it on any mentor." },
            { icon: ShieldCheck, title: "Private sessions", body: "What you share stays between you and your mentor." },
          ].map((f) => (
            <StaggerItem
              key={f.title}
              lift
              className="group min-w-[78%] snap-start rounded-2xl border border-line bg-card p-6 md:min-w-0"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lavender-soft text-violet transition-transform duration-300">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
