import Image from "next/image";
import { CLIENT_LOGOS } from "./logos-data";

// Figma dev-mode inspect gave this section's sizing in fixed px (native
// logo dimensions, 116px gaps, 61px-tall boundary lines) rather than
// percentages, so LOGO_SCALE is a single dial to size the whole thing
// down uniformly — logos, gaps, and lines all shrink together — instead
// of re-deriving each value by hand. 1 = exactly the inspected Figma size.
const LOGO_SCALE = 0.65;

const LINE_HEIGHT_PX = 61 * LOGO_SCALE;
const LINE_COLOR = "#C2C2C3";

// Figma spec gives a uniform 116px gap everywhere, but AIG's mark is a
// small navy-outlined box that's mostly white inside — much lighter than
// its neighbors (Ziora's mark fills its box edge-to-edge). At a uniform
// gap, the transitions on either side of AIG read as noticeably emptier
// than the rest, even though the measured spacing is identical. Tightened
// just those two gaps (optical spacing, same idea as kerning around a
// visually-light glyph) rather than changing the gap everywhere.
const NORMAL_GAP = 116;
const TIGHT_GAP = 70;
const GAP_AFTER_LOGO: Record<string, number> = {
  AIG: TIGHT_GAP,
  "Ronald McDonald House Atlanta": NORMAL_GAP,
  "Georgia International Convention Center": NORMAL_GAP,
  Delta: NORMAL_GAP,
  "Ziora Copilot": TIGHT_GAP,
};

// One copy's total width (sum of logo widths + sum of their trailing
// gaps) is the exact seamless-loop distance — see the logo-marquee
// keyframe comment in globals.css. Derived from GAP_AFTER_LOGO rather
// than hardcoded, so it can't drift out of sync if the gaps change.
const COPY_WIDTH_PX = CLIENT_LOGOS.reduce(
  (sum, logo) => sum + logo.src.width + GAP_AFTER_LOGO[logo.name],
  0,
);
const MARQUEE_DISTANCE_PX = COPY_WIDTH_PX * LOGO_SCALE;

// The track only needs to render 2 copies if a single copy is at least as
// wide as the visible marquee viewport — otherwise, once the track has
// scrolled by a bit less than one copy-width, the viewport's trailing
// edge runs past the end of the second copy and shows blank space (this
// actually happened here: at LOGO_SCALE 0.65 a scaled copy is ~815px,
// narrower than the ~1280px viewport, so 2 copies fell short by several
// hundred px). Rendering enough copies to comfortably outlast any
// realistic viewport width removes the dependency on that relationship
// entirely, rather than tuning the copy count to today's specific scale
// and viewport. Cost is negligible — these are small SVGs.
const REPEAT_COUNT = 8;

export function ClientLogosSection() {
  return (
    <section
      data-nav-theme="light"
      className="bg-white px-5 py-8 sm:px-8 sm:py-10 lg:px-[114px] lg:py-12"
    >
      <div className="flex items-center">
        <span
          aria-hidden="true"
          className="w-[2px] shrink-0"
          style={{ height: LINE_HEIGHT_PX, backgroundColor: LINE_COLOR }}
        />

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex w-max items-center motion-safe:animate-[logo-marquee_28s_linear_infinite]"
            style={{
              // @ts-expect-error -- custom property, not a known CSS key
              "--logo-marquee-distance": `-${MARQUEE_DISTANCE_PX}px`,
            }}
          >
            {/* Rendered REPEAT_COUNT times back-to-back for the seamless
                loop (see the logo-marquee keyframe comment in globals.css)
                — only the first copy is real content; the rest are purely
                visual repeats, hidden from assistive tech so screen
                readers don't announce every logo REPEAT_COUNT times. Each
                logo carries its own trailing gap as marginRight (see
                GAP_AFTER_LOGO) instead of a uniform container gap. */}
            {Array.from({ length: REPEAT_COUNT }, (_, copyIndex) =>
              CLIENT_LOGOS.map((logo) => (
                <Image
                  key={`${logo.name}-${copyIndex}`}
                  src={logo.src}
                  alt={copyIndex === 0 ? logo.name : ""}
                  aria-hidden={copyIndex === 0 ? undefined : "true"}
                  width={Math.round(logo.src.width * LOGO_SCALE)}
                  height={Math.round(logo.src.height * LOGO_SCALE)}
                  className="shrink-0"
                  style={{ marginRight: GAP_AFTER_LOGO[logo.name] * LOGO_SCALE }}
                  priority={copyIndex === 0}
                />
              )),
            )}
          </div>
        </div>

        <span
          aria-hidden="true"
          className="w-[2px] shrink-0"
          style={{ height: LINE_HEIGHT_PX, backgroundColor: LINE_COLOR }}
        />
      </div>
    </section>
  );
}
