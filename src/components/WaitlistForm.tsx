"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { EASE_OUT } from "./ui";

type Role = "learner" | "mentor";

export function WaitlistForm({ dark = false, showRole = true }: { dark?: boolean; showRole?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("learner");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <div className="w-full max-w-md">
      {showRole && state !== "done" && (
        <div
          role="radiogroup"
          aria-label="I want to"
          className={`mb-3 inline-flex rounded-xl p-1 text-sm ${
            dark ? "border border-white/10 bg-white/[0.06]" : "border border-line bg-card"
          }`}
        >
          {(
            [
              ["learner", "Get help"],
              ["mentor", "Mentor others"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={role === value}
              onClick={() => setRole(value)}
              className={`relative min-h-[36px] rounded-lg px-4 transition-colors duration-200 ${
                role === value ? (dark ? "text-ink" : "text-white") : dark ? "text-white/70" : "text-muted"
              }`}
            >
              {role === value && (
                <motion.span
                  layoutId={`role-pill-${id}`}
                  className={`absolute inset-0 rounded-lg ${dark ? "bg-lavender" : "bg-ink"}`}
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className={`flex items-center gap-3 rounded-2xl border p-4 ${
              dark ? "border-white/15 bg-white/5 text-white" : "border-line bg-card"
            }`}
            role="status"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-live text-white">
              <Check className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium">You&apos;re on the list.</p>
              <p className={`text-sm ${dark ? "text-white/60" : "text-muted"}`}>
                We&apos;ll email {email} the day SAATHYAKI opens.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.2 }}
          >
            <label htmlFor={`email-${id}`} className="sr-only">
              Email address
            </label>
            <div
              className={`flex items-center gap-1.5 rounded-2xl p-1.5 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-violet/50 ${
                dark ? "border border-white/15 bg-white/[0.07] backdrop-blur-md" : "border border-line bg-card shadow-[0_10px_30px_-18px_rgba(40,20,90,0.35)]"
              }`}
            >
              <input
                id={`email-${id}`}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                aria-invalid={state === "error"}
                aria-describedby={state === "error" ? `err-${id}` : undefined}
                className={`min-w-0 flex-1 bg-transparent px-4 py-2 text-[15px] outline-none ${
                  dark ? "text-white placeholder:text-white/40" : "placeholder:text-faint"
                }`}
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className={`btn group shrink-0 px-5 text-[15px] ${dark ? "btn-lime" : "btn-dark"}`}
              >
                {state === "sending" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Join the waitlist</span>
                    <span className="sm:hidden">Join</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
            <AnimatePresence>
              {state === "error" && (
                <motion.p
                  id={`err-${id}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-2 pl-4 text-sm ${dark ? "text-red-300" : "text-red-600"}`}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
