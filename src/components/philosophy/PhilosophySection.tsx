"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";
import {
  CLUSTER_CENTER_X,
  CLUSTER_CENTER_Y,
  FIGMA_HEIGHT,
  FIGMA_WIDTH,
  PHILOSOPHY_IMAGES,
  QUOTE_CLOSE,
  QUOTE_LINES,
  QUOTE_OPEN,
  QUOTE_WIDTH,
} from "./philosophy-data";
import { PhilosophyImage } from "./PhilosophyImage";

// How much scroll distance (px) the section stays pinned for while the
// images spread apart — confirmed via inspecting the motion reference
// site's own implementation (a position:sticky wrapper ~1339px taller
// than its sticky viewport). Not pinning at all would force the same
// amount of visual travel into whatever this section's natural in-flow
// height happens to be, which is too little room for the spread to read
// as smooth and deliberate rather than abrupt.
const PIN_SCROLL_DISTANCE = 1200;

export function PhilosophySection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [pxScale, setPxScale] = useState(1);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - wrapperTop) / PIN_SCROLL_DISTANCE;
      progress.set(Math.min(1, Math.max(0, raw)));

      setPxScale(container.getBoundingClientRect().width / FIGMA_WIDTH);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progress]);

  return (
    <div
      ref={wrapperRef}
      data-nav-theme="light"
      style={{ height: `calc(100vh + ${PIN_SCROLL_DISTANCE}px)` }}
      className="relative bg-white"
    >
      <div className="sticky top-0 overflow-hidden">
        <div
          ref={containerRef}
          className="relative mx-auto w-full"
          style={{ aspectRatio: `${FIGMA_WIDTH} / ${FIGMA_HEIGHT}` }}
        >
          <p
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center font-serif text-black"
            style={{
              left: `${(CLUSTER_CENTER_X / FIGMA_WIDTH) * 100}%`,
              top: `${(CLUSTER_CENTER_Y / FIGMA_HEIGHT) * 100}%`,
              width: `${(QUOTE_WIDTH / FIGMA_WIDTH) * 100}%`,
              fontSize: "clamp(1.2rem, 1.65vw, 1.65rem)",
              fontWeight: 700,
            }}
          >
            {/* Opening/closing marks hang outside the centered text block
                via a negative margin, instead of sitting flush with the
                first/last line — the classic "hanging punctuation" look,
                implemented by hand since CSS's own hanging-punctuation
                property only has Safari support. */}
            <span style={{ marginLeft: "-0.45em" }}>{QUOTE_OPEN}</span>
            {QUOTE_LINES.map((line, i) => (
              <span key={line}>
                {line}
                {i < QUOTE_LINES.length - 1 && <br />}
              </span>
            ))}
            <span style={{ marginRight: "-0.45em" }}>{QUOTE_CLOSE}</span>
          </p>

          {PHILOSOPHY_IMAGES.map((image, i) => (
            <PhilosophyImage key={i} {...image} progress={progress} pxScale={pxScale} />
          ))}
        </div>
      </div>
    </div>
  );
}
