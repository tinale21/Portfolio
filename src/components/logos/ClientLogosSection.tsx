import Image from "next/image";
import { CLIENT_LOGOS } from "./logos-data";

// Figma dev-mode inspect: the two vertical rules ("Rectangle 13"/"Rectangle
// 16") marking the loop's clip boundary are 2px wide, 61px tall, #C2C2C3,
// sitting at x=114 and x=1395 on the 1512px reference frame — i.e. inset
// ~114px from each edge. Reused as fixed padding here rather than a
// percentage, matching the rest of this section's fixed-px sizing (native
// logo dimensions, fixed gaps) instead of the Hero collage's fluid
// percentage-based approach.
const LINE_HEIGHT_PX = 61;
const LINE_COLOR = "#C2C2C3";

export function ClientLogosSection() {
  return (
    <section
      data-nav-theme="light"
      className="bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-[114px] lg:py-20"
    >
      <div className="flex items-center">
        <span
          aria-hidden="true"
          className="w-[2px] shrink-0"
          style={{ height: LINE_HEIGHT_PX, backgroundColor: LINE_COLOR }}
        />

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex w-max items-center gap-x-[116px] motion-safe:animate-[logo-marquee_28s_linear_infinite]"
          >
            {/* Rendered twice back-to-back for the seamless loop (see the
                logo-marquee keyframe comment in globals.css) — the second
                copy is a purely visual repeat, so it's hidden from
                assistive tech to avoid announcing every logo twice. */}
            {CLIENT_LOGOS.map((logo) => (
              <Image
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                className="h-auto w-auto shrink-0"
                priority
              />
            ))}
            {CLIENT_LOGOS.map((logo) => (
              <Image
                key={`${logo.name}-repeat`}
                src={logo.src}
                alt=""
                aria-hidden="true"
                className="h-auto w-auto shrink-0"
              />
            ))}
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
