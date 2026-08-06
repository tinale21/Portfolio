"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 125;
const DELETE_MS = 125;
const HOLD_MS = 1800;
const BLINK_MS = 275;

// Every phrase starts with this literal prefix. Per Figma dev-mode
// inspect: "I'm " is Inter SemiBold (600), and everything after it is
// Inria Serif Bold (700) — confirmed for "Tina" and applied consistently
// across the other phrases too.
const PREFIX = "I'm ";

type Phase = "idle" | "typing" | "holding" | "deleting";

export function TypewriterHeadline({
  phrases,
  start,
}: {
  phrases: string[];
  start: boolean;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cursorOn, setCursorOn] = useState(true);

  // Kick off once the parent signals the headline has reached its final
  // scroll position. Never re-triggers or reverses after that.
  useEffect(() => {
    if (!start || phase !== "idle") return;
    const t = setTimeout(() => setPhase("typing"), 0);
    return () => clearTimeout(t);
  }, [start, phase]);

  useEffect(() => {
    if (phase === "idle" || phase === "holding") return;

    const currentPhrase = phrases[phraseIndex];

    if (phase === "typing") {
      if (length < currentPhrase.length) {
        const t = setTimeout(() => setLength((l) => l + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), 0);
      return () => clearTimeout(t);
    }

    // phase === "deleting"
    if (length > 0) {
      const t = setTimeout(() => setLength((l) => l - 1), DELETE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
      setPhase("typing");
    }, 0);
    return () => clearTimeout(t);
  }, [phase, length, phraseIndex, phrases]);

  useEffect(() => {
    if (phase !== "holding") return;
    const t = setTimeout(() => setPhase("deleting"), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Cursor blinks only during the hold; solid while actively typing/deleting.
  useEffect(() => {
    if (phase !== "holding") {
      const t = setTimeout(() => setCursorOn(true), 0);
      return () => clearTimeout(t);
    }
    const interval = setInterval(() => setCursorOn((v) => !v), BLINK_MS);
    return () => clearInterval(interval);
  }, [phase]);

  const visibleText = phase === "idle" ? "" : phrases[phraseIndex].slice(0, length);
  const prefixPart = visibleText.slice(0, PREFIX.length);
  const restPart = visibleText.slice(PREFIX.length);

  return (
    <>
      <span aria-hidden="true">
        <span className="font-sans font-semibold">{prefixPart}</span>
        <span className="font-serif font-bold">{restPart}</span>
        <span
          className="ml-1 inline-block w-[2px] translate-y-[0.1em] bg-current"
          style={{ height: "0.85em", opacity: cursorOn ? 1 : 0 }}
        />
      </span>
      <span className="sr-only">{phrases.join(", ")}</span>
    </>
  );
}
