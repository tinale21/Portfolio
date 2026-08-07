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

// Figma spec: a uniform 116px gap between every logo. (An earlier version
// tightened the two gaps around AIG's lighter-weight mark for optical
// balance — reverted per request for uniform spacing everywhere.)
const GAP = 170;

// One copy's total width (sum of logo widths + one gap after each) is the
// exact seamless-loop distance — see the logo-marquee keyframe comment in
// globals.css. Derived from GAP rather than hardcoded, so it can't drift
// out of sync if the gap changes.
const COPY_WIDTH_PX = CLIENT_LOGOS.reduce((sum, logo) => sum + logo.src.width + GAP, 0);
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
      {/* This section's own horizontal padding (lg:px-[114px]) is wider
          than the Projects section's (lg:px-[68px]) — the negative margin
          at lg cancels that difference so this heading lines up with
          Projects' heading instead of inheriting the marquee's own inset.
          Below lg both sections already share the same padding (px-5,
          sm:px-8), so no correction is needed there. */}
      <p className="mb-[26px] text-left font-serif text-[24px] font-bold text-black sm:mb-[34px] lg:-ml-[46px]">
        Companies I&apos;ve Worked For
      </p>

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
              columnGap: GAP * LOGO_SCALE,
              // @ts-expect-error -- custom property, not a known CSS key
              "--logo-marquee-distance": `-${MARQUEE_DISTANCE_PX}px`,
            }}
          >
            {/* Rendered REPEAT_COUNT times back-to-back for the seamless
                loop (see the logo-marquee keyframe comment in globals.css)
                — only the first copy is real content; the rest are purely
                visual repeats, hidden from assistive tech so screen
                readers don't announce every logo REPEAT_COUNT times. */}
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
