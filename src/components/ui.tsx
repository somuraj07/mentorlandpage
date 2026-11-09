"use client";

import { motion, useInView, animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LAUNCH_DATE } from "@/lib/site";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Logo mark: two linked rings — a mentor and a learner, held together. */
export function LogoMark({ className = "h-7 w-7", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-hidden fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="#6b4eff" strokeWidth="4" />
      <circle cx="24" cy="12" r="8.5" stroke={light ? "#e4dbff" : "#150e22"} strokeWidth="4" />
      {/* re-draw the top arc of the first ring so the two interlock */}
      <path d="M 18.2 5.9 A 8.5 8.5 0 0 1 20.5 12" stroke="#6b4eff" strokeWidth="4" strokeLinecap="butt" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="SAATHYAKI home">
      <LogoMark className="h-6 w-9" light={light} />
      <span className="font-display text-[17px] font-medium tracking-[0.08em]">SAATHYAKI</span>
    </a>
  );
}

/** Section tag in the editorial style: (03) — How it works */
export function Tag({ n, children, dark = false }: { n: string; children: ReactNode; dark?: boolean }) {
  return (
    <span className={`label inline-flex items-center gap-3 ${dark ? "!text-white/60" : ""}`}>
      <span className={dark ? "text-lavender" : "text-violet"}>({n})</span>
      <span className={`h-px w-8 ${dark ? "bg-white/25" : "bg-ink/20"}`} />
      {children}
    </span>
  );
}

/** Headline reveal: words rise from a mask, once, when in view. */
export function RevealText({
  children,
  className = "",
  delay = 0,
  as: Tag = "h2",
}: {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = children.split(" ");
  return (
    <Tag ref={ref} className={className}>
      <span>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "105%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: delay + i * 0.045 }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

export function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 label ${
        dark ? "border-white/15 bg-white/5 text-white/70" : "border-line bg-card"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-violet" />
      {children}
    </span>
  );
}

/** Number that tweens to its new value. */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString("en-IN"),
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = format(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.5,
      ease: EASE_OUT,
      onUpdate: (v) => (el.textContent = format(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, format, reduce]);
  return <span ref={ref}>{format(value)}</span>;
}

function diff() {
  const ms = Math.max(0, new Date(LAUNCH_DATE).getTime() - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export function Countdown({ dark = false, size = "sm" }: { dark?: boolean; size?: "sm" | "lg" }) {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);
  useEffect(() => {
    const tick = () => setT(diff());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const units: [string, number | undefined][] = [
    ["Days", t?.days],
    ["Hours", t?.hours],
    ["Mins", t?.minutes],
    ["Secs", t?.seconds],
  ];
  const big = size === "lg";
  return (
    <div className="flex items-stretch gap-2 sm:gap-3" role="timer" aria-label="Time until launch">
      {units.map(([label, v]) => (
        <div
          key={label}
          className={`flex flex-col items-center rounded-2xl border ${
            dark ? "border-white/10 bg-white/5 text-white" : "border-line bg-card"
          } ${big ? "min-w-[72px] px-3 py-3 sm:min-w-[96px] sm:py-4" : "min-w-[58px] px-2.5 py-2"}`}
        >
          <span
            className={`font-display tabular-nums font-semibold overflow-hidden ${
              big ? "text-3xl sm:text-5xl" : "text-lg"
            }`}
          >
            <motion.span
              key={v ?? "x"}
              className="inline-block"
              initial={{ y: "-60%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              {v === undefined ? "--" : String(v).padStart(2, "0")}
            </motion.span>
          </span>
          <span className={`label ${dark ? "!text-white/50" : ""} !text-[10px]`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ───────── Framer Motion helpers ───────── */

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const staggerChild = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Children marked with StaggerItem cascade in when the group scrolls into view. */
export function Stagger({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const Comp = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Comp className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10% 0px" }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className = "",
  as = "div",
  lift = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
  lift?: boolean;
}) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      variants={staggerChild}
      whileHover={lift ? { y: -6, transition: { type: "spring", stiffness: 400, damping: 28 } } : undefined}
      whileTap={lift ? { scale: 0.98 } : undefined}
    >
      {children}
    </Comp>
  );
}

/** Button/link that leans toward the cursor and springs back. */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      className={className || "inline-flex"}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={pos}
      transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
