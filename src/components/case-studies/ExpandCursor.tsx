"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

// A Figma-style label shown next to the pointer while hovering an
// expandable (Lightbox-wrapped) photo/video: an orange-red rounded pill
// reading "Click to expand!" sitting just below-right of the cursor.
//
// Deliberately does NOT draw its own arrow and does NOT hide the native
// cursor. Reason: when a visitor has customized their OS pointer (e.g.
// macOS Accessibility > Pointer color/outline), the browser IGNORES CSS
// `cursor: none`, so an earlier version that drew its own arrow + hid the
// native one produced TWO cursors for those users. Riding on the real
// system cursor (which is already an arrow) and only attaching the label
// guarantees exactly one cursor + the label for everyone, and still
// matches the Figma reference (arrow + pill).
//
// Position is driven by writing `transform` directly on the DOM node in a
// mousemove handler (a ref, not React state) so following the pointer never
// triggers a re-render. `initialX/Y` come from the host's mouseenter event
// so the label appears at the pointer immediately, with no flash at 0,0.
// pointer-events-none so it never intercepts the click.
//
// The label text types out character by character with a blinking caret,
// matching the Figma reference recording (a text field being typed into).
// Typing restarts on every hover, since the host remounts this per hover.
const TYPE_MS_PER_CHAR = 55;

export function ExpandCursor({
  initialX,
  initialY,
  label = "Click to expand!",
}: {
  initialX: number;
  initialY: number;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const node = ref.current;
      if (node) node.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Typewriter: reveal one more character every TYPE_MS_PER_CHAR until done.
  useEffect(() => {
    if (count >= label.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), TYPE_MS_PER_CHAR);
    return () => clearTimeout(id);
  }, [count, label]);

  return createPortal(
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ transform: `translate3d(${initialX}px, ${initialY}px, 0)` }}
    >
      {/* Offset just below-right of the pointer tip so it sits alongside the
          native arrow like the Figma reference. whitespace-nowrap so the
          pill grows as the text types in. */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="absolute left-[18px] top-[20px] flex items-center whitespace-nowrap rounded-[14px] rounded-tl-[4px] bg-[#EF3F1E] px-3 py-1.5 font-sans text-sm font-medium text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
      >
        {label.slice(0, count)}
        {/* Thin blinking caret, like a text-field cursor. */}
        <motion.span
          aria-hidden="true"
          className="ml-[2px] inline-block h-[1.05em] w-[1.5px] bg-white"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.9, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
        />
      </motion.span>
    </div>,
    document.body,
  );
}
