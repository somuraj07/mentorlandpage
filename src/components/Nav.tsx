"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { EASE_OUT, Logo } from "./ui";

const LINKS = [
  ["How it works", "#how"],
  ["Video & chat", "#modes"],
  ["Pricing", "#pricing"],
  ["Mentors", "#mentors"],
  ["FAQ", "#faq"],
] as const;

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const vh = window.innerHeight;
    setScrolled(y > 20);
    // which ground is under the bar: the dark hero or a dark band marked data-dark
    requestAnimationFrame(() => {
      const probe = document.elementsFromPoint(window.innerWidth / 2, 40).find((el) => el.closest("[data-dark], #top"));
      setOnDark(!!probe);
    });
    setHidden(y > vh && y > prev + 2 && !open);
    const join = document.getElementById("join");
    const nearJoin = join ? join.getBoundingClientRect().top < vh : false;
    setShowBar(y > vh * 0.85 && !nearJoin);
  });

  const dark = onDark;

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <nav
          className={`flex w-full max-w-[1400px] items-center justify-between rounded-full border py-1.5 pl-4 pr-1.5 transition-[background-color,border-color,color] duration-300 sm:pl-5 ${
            dark ? "text-white" : "text-ink"
          } ${
            scrolled
              ? dark
                ? "border-white/10 bg-night/60 backdrop-blur-xl"
                : "border-line bg-white/75 shadow-[0_10px_30px_-20px_rgba(40,20,90,0.35)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
          aria-label="Main"
        >
          <Logo light={dark} />
          <ul className="hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
            {LINKS.map(([label, href]) => (
              <li key={href} className="relative">
                <a
                  href={href}
                  onMouseEnter={() => setHovered(href)}
                  className={`relative z-10 block px-4 py-2 text-sm transition-colors ${dark ? "text-white/75 hover:text-white" : "text-ink-2 hover:text-ink"}`}
                >
                  {label}
                </a>
                {hovered === href && (
                  <motion.span
                    layoutId="nav-hover"
                    className={`absolute inset-0 rounded-full ${dark ? "bg-white/10" : "bg-lavender-soft"}`}
                    transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                  />
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="#join" className={`btn hidden px-5 text-sm sm:inline-flex ${dark ? "btn-lime" : "btn-dark"}`}>
              Join the waitlist
            </a>
            <button
              className={`btn relative h-11 w-11 lg:hidden ${dark ? "bg-white/10" : "bg-ink text-white"}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-5">
                <motion.span
                  className="absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current"
                  animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] w-5 rounded-full bg-current"
                  animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* full-screen mobile menu: a purple curtain */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-violet px-5 pb-8 pt-28 text-white lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          >
            <ul className="flex flex-col">
              {LINKS.map(([label, href], i) => (
                <li key={href} className="overflow-hidden border-b border-white/20">
                  <motion.a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 font-display text-[2.6rem] font-semibold leading-none tracking-tight"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 + i * 0.05 }}
                  >
                    {label}
                    <span className="font-mono text-xs text-white/60">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.p
              className="serif-accent mt-8 text-3xl text-lavender-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              a saathi for every problem.
            </motion.p>
            <a href="#join" onClick={() => setOpen(false)} className="btn btn-lime mt-auto w-full py-3.5 text-base">
              Join the waitlist <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile sticky action bar */}
      <AnimatePresence>
        {showBar && !open && (
          <motion.div
            className="fixed inset-x-3 bottom-3 z-40 sm:hidden"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          >
            <a
              href="#join"
              className="flex items-center justify-between rounded-full bg-night py-2 pl-5 pr-2 text-white shadow-[0_20px_40px_-12px_rgba(40,20,90,0.6)]"
            >
              <span className="text-sm">
                <span className="text-lime">●</span> Early access is open
              </span>
              <span className="btn btn-lime px-4 text-sm">
                Join <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
