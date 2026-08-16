"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
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
import { PhilosophyMobileSection } from "./PhilosophyMobileSection";

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
  // CLUSTER_CENTER_Y is a Figma-frame-relative constant (476.5 out of the
  // 982-tall reference), but the sticky box's actual rendered height is
  // width-derived (982/1512 of its own width) and essentially never
  // matches the real browser viewport height the user is looking at — so
  // positioning the cluster at a fixed % of the Figma frame's height
  // lands it slightly off the visual center of the actual screen (a ~26px
  // offset measured at 1512x900). Converting the true on-screen center
  // (half the real viewport height) back into Figma-space px — by
  // dividing by the same pxScale already used to convert Figma px to
  // screen px everywhere else — lets the existing math in
  // PhilosophyImage.tsx work unchanged while actually landing on center.
  const [clusterCenterY, setClusterCenterY] = useState(CLUSTER_CENTER_Y);
  // Confirmed by decomposing the reference site's live computed styles
  // across its full scroll range: the quote isn't static-and-revealed —
  // it fades from opacity 0 to 1 and grows from scale(0.9) to scale(1),
  // driven by the exact same progress value as the images. The ramp
  // isn't 0-to-1 across the whole range either — opacity/scale stay flat
  // at their start values until progress reaches ~0.3, then interpolate
  // linearly the rest of the way (fit confirmed against 5 sampled points,
  // matching to within measurement noise). useTransform clamps outside
  // its input range by default, so progress below 0.3 just holds at 0.
  const quoteOpacity = useTransform(progress, [0.3, 1], [0, 1]);
  const quoteScale = useTransform(progress, [0.3, 1], [0.9, 1]);

  useEffect(() => {
    function update() {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;

      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const raw = (window.scrollY - wrapperTop) / PIN_SCROLL_DISTANCE;
      progress.set(Math.min(1, Math.max(0, raw)));

      const scale = container.getBoundingClientRect().width / FIGMA_WIDTH;
      setPxScale(scale);
      setClusterCenterY(window.innerHeight / 2 / scale);
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
    <>
      <PhilosophyMobileSection />
      <div
        ref={wrapperRef}
        data-nav-theme="light"
        style={{ height: `calc(100vh + ${PIN_SCROLL_DISTANCE}px)` }}
        className="relative hidden bg-white lg:block"
      >
        <div className="sticky top-0 overflow-hidden">
          <div
            ref={containerRef}
            className="relative mx-auto w-full"
            style={{ aspectRatio: `${FIGMA_WIDTH} / ${FIGMA_HEIGHT}` }}
          >
            {/* Static positioning/centering lives on this plain wrapper —
                motion.p below needs its own transform (opacity/scale) free
                of the -50%/-50% centering translate, since a motion
                component's animated transform props replace its element's
                whole CSS transform rather than composing with a className
                like -translate-x-1/2. */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(CLUSTER_CENTER_X / FIGMA_WIDTH) * 100}%`,
                top: `${(clusterCenterY / FIGMA_HEIGHT) * 100}%`,
                width: `${(QUOTE_WIDTH / FIGMA_WIDTH) * 100}%`,
              }}
            >
              <motion.p
                className="text-center font-serif text-black"
                style={{
                  fontSize: "clamp(1.35rem, 1.9vw, 1.9rem)",
                  fontWeight: 700,
                  opacity: quoteOpacity,
                  scale: quoteScale,
                }}
              >
                {/* Opening/closing marks hang outside the centered text
                    block via a negative margin, instead of sitting flush
                    with the first/last line — the classic "hanging
                    punctuation" look, implemented by hand since CSS's own
                    hanging-punctuation property only has Safari support. */}
                <span style={{ marginLeft: "-0.45em" }}>{QUOTE_OPEN}</span>
                {QUOTE_LINES.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < QUOTE_LINES.length - 1 && <br />}
                  </span>
                ))}
                <span style={{ marginRight: "-0.45em" }}>{QUOTE_CLOSE}</span>
              </motion.p>
            </div>

            {PHILOSOPHY_IMAGES.map((image, i) => (
              <PhilosophyImage
                key={i}
                {...image}
                progress={progress}
                pxScale={pxScale}
                clusterCenterY={clusterCenterY}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
