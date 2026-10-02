"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AboutEntry as AboutEntryData } from "./about-data";

// Cross-correlating the motion-reference video frame-by-frame (image ROI vs
// adjacent text ROI) mostly showed them moving at the identical rate — i.e.
// no clearly-provable parallax there. But per direct feedback the photos do
// read as drifting a little relative to the rest of each entry, so this
// adds a plain scroll-linked parallax (image translates within its own box
// as the entry crosses the viewport, text stays in normal flow) rather than
// static images — a common, tasteful default rather than an exact reference
// measurement.
//
// The image itself is scaled up 60% (see BASE_PHOTO_SCALE below) so
// translating it by the full +/-PARALLAX_RANGE_PX range never reveals
// empty space past its edges — needed at the smallest box size (now
// 205x288 on mobile, 8% bigger than the original 190x267), where this
// range is a bigger fraction of the box than at desktop's 335x470. 60px
// (120px total travel) read fine but per direct feedback wanted a bit
// more; 80px (160px total travel) needed the scale bumped from 1.4 to 1.6
// to keep covering the smallest box with margin to spare.
const PARALLAX_RANGE_PX = 80;
// Moved from a Tailwind scale-[1.6] class to a JS constant so a per-photo
// photoZoom multiplier (see about-data.ts) can combine with it — needed
// once object-position turned out to have no room to pan for photos whose
// source aspect ratio already nearly matches the 365:513 box.
const BASE_PHOTO_SCALE = 1.6;

// Matches NavBar's height — each entry pins just below the nav.
const NAV_HEIGHT = 64;

// Per direct instruction, each trait entry (Foodie / Wanderer / Potterhead /
// Animal Friend) gets a sticky pin-hold like HeroSection's "Hi, I'm Tina!"
// intro — it sticks in place for this many px of extra scroll before
// releasing — but noticeably shorter than the Hero's (INTRO_HOLD = 1050).
// Same mechanism: a wrapper sized to (pinned content height) + ENTRY_HOLD,
// with the content sticky at top: NAV_HEIGHT. Kept very short per direct
// feedback — just a brief catch before the entry releases.
const ENTRY_HOLD = 40;

// Below lg, the entry shows the SAME side-by-side composition as desktop,
// scaled down to fit (per direct instruction — not the stacked, one-by-one
// layout), the same approach as the Secondary Research collage. The
// composition is laid out at this fixed design size and transform-scaled to
// the available width. Fixed px font sizes (the clamp() maxes desktop hits on
// a big screen) are used instead of the desktop's vw-based clamps, since vw
// resolves against the tiny mobile viewport, not the design stage — so they'd
// come out wrong once scaled. 1046 = the two 300px text columns + the 318px
// photo + two 64px (gap-16) gaps.
const MOBILE_DESIGN_W = 1046;
const MOBILE_DESIGN_H = 480;

// Renders each array entry on its own line via an explicit <br/> rather
// than letting the browser wrap — see the traitLines/taglineLines/
// captionLines comment in about-data.ts for why the line count needs to be
// forced rather than left to whatever width the responsive column has.
function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export function AboutEntry({
  traitLines,
  taglineLines,
  captionLines,
  image,
  alt,
  photoZoom = 1,
  photoPanX = 0,
}: AboutEntryData) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [PARALLAX_RANGE_PX, -PARALLAX_RANGE_PX]);
  const photoScale = BASE_PHOTO_SCALE * photoZoom;

  // Pin wrapper sized to (sticky content height) + ENTRY_HOLD so the content
  // stays stuck for ENTRY_HOLD px before releasing — same pattern as
  // HeroSection's intro. Falls back to a plain height before the first
  // measurement so there's no zero-height flash on load.
  const [pinWrapperHeightPx, setPinWrapperHeightPx] = useState<number | null>(null);

  useEffect(() => {
    function updatePinHeight() {
      const sticky = stickyRef.current;
      if (!sticky) return;
      setPinWrapperHeightPx(sticky.getBoundingClientRect().height + ENTRY_HOLD);
    }

    updatePinHeight();
    window.addEventListener("resize", updatePinHeight);
    return () => window.removeEventListener("resize", updatePinHeight);
  }, []);

  // Scale factor for the below-lg scaled composition (available width ÷ design
  // width). Measured via ResizeObserver on the mobile box.
  const mobileRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState(0.33);

  useEffect(() => {
    const el = mobileRef.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth) setMobileScale(el.clientWidth / MOBILE_DESIGN_W);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-nav-theme="light"
      style={pinWrapperHeightPx !== null ? { height: pinWrapperHeightPx } : undefined}
      className="relative bg-white"
    >
      <div
        ref={stickyRef}
        className="sticky flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-16 sm:px-8 lg:px-[68px]"
        style={{ top: NAV_HEIGHT }}
      >
      {/* Below lg: the same side-by-side composition as desktop, scaled down
          to fit the viewport width (per direct instruction — not a stacked,
          one-by-one layout). The scaled stage is absolutely positioned inside
          an overflow-hidden box so its MOBILE_DESIGN_W layout width can't
          cause page horizontal overflow; the box's height is the scaled
          design height, and the sticky's items-center keeps it vertically
          centered like desktop. */}
      <div className="w-full lg:hidden">
        <div
          ref={mobileRef}
          className="relative mx-auto overflow-hidden"
          style={{ height: MOBILE_DESIGN_H * mobileScale }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: MOBILE_DESIGN_W, height: MOBILE_DESIGN_H, transform: `scale(${mobileScale})` }}
          >
            <div className="flex h-full w-full items-center justify-center gap-16">
              <div className="flex w-[300px] shrink-0 flex-col items-end text-right">
                <p className="font-serif italic text-black" style={{ fontSize: "3.25rem", fontWeight: 400 }}>
                  <Lines lines={traitLines} />
                </p>
              </div>

              <div className="relative h-[471px] w-[318px] shrink-0 overflow-hidden">
                <motion.div className="absolute inset-0" style={{ y }}>
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="318px"
                    className="object-cover"
                    style={{ transform: `scale(${photoScale}) translateX(${photoPanX}%)` }}
                  />
                </motion.div>
              </div>

              <div className="flex w-[300px] shrink-0 flex-col items-start gap-[112px] text-left">
                <p className="font-sans text-black" style={{ fontSize: "1.5rem" }}>
                  <Lines lines={taglineLines} />
                </p>
                <p className="font-sans text-black" style={{ fontSize: "0.95rem" }}>
                  <Lines lines={captionLines} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop (lg+): unchanged. Row is vertically centered as a group (name
          column / photo / tagline column share the same center line). Side-by-
          side (flex-row) turns on at xl; at lg-xl it stacks (the two 300px
          text columns + 318px photo need ~1180px, which lg widths don't have).
          Hidden below lg, where the scaled composition above takes over. */}
      <div
        className="hidden w-full max-w-[1100px] flex-col items-center gap-8 lg:flex xl:flex-row xl:items-center xl:justify-center xl:gap-16"
        style={{ transform: "translateY(-10px)" }}
      >
        {/* The "Tina Le" signature line above each trait was removed per
            direct instruction — just the trait word remains in this column. */}
        <div className="flex flex-col items-center gap-2 text-center xl:w-[300px] xl:shrink-0 xl:items-end xl:gap-[44px] xl:text-right">
          <p
            className="relative z-10 font-serif text-black italic xl:translate-x-[10px] xl:-translate-y-[55px]"
            style={{
              fontSize: "clamp(2rem, 3.75vw, 3.25rem)",
              fontWeight: 400,
            }}
          >
            <Lines lines={traitLines} />
          </p>
        </div>

        <div
          className="relative h-[288px] w-[195px] shrink-0 overflow-hidden sm:h-[364px] sm:w-[246px] lg:h-[471px] lg:w-[318px]"
        >
          <motion.div className="absolute inset-0" style={{ y }}>
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 318px, (min-width: 640px) 246px, 195px"
              className="object-cover"
              style={{ transform: `scale(${photoScale}) translateX(${photoPanX}%)` }}
            />
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center xl:w-[300px] xl:shrink-0 xl:items-start xl:gap-[112px] xl:text-left">
          <p
            className="font-sans text-black xl:-translate-x-[35px]"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.5rem)" }}
          >
            <Lines lines={taglineLines} />
          </p>
          <p
            className="font-sans text-black xl:-translate-x-[50px] xl:translate-y-[25px]"
            style={{ fontSize: "clamp(0.85rem, 1vw, 0.95rem)" }}
          >
            <Lines lines={captionLines} />
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
