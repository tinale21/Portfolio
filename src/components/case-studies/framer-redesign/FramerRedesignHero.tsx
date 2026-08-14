import Image from "next/image";
import framerLogo from "@/assets/logos/framer-redesign.svg";
import { BASE_PATH } from "@/lib/base-path";

// Per direct instruction, reuses the exact text and spacing rules
// already established for the AIG hero (AigHero.tsx) — logo height,
// h1 size, meta row typography/gaps, and the video box's own sizing
// (1378:500 aspect, 10px radius, #F4F4F5 border) are all identical
// classes.
//
// Meta values (Timeline/Role/Platform/Team Size) transcribed directly
// from the provided reference screenshot (Screenshot 2026-08-14 at
// 10.16.55 AM.png) and confirmed against the motion reference
// recording (Screen Recording 2026-08-14 at 10.16.29 AM.mov), which
// also confirmed this hero has no special motion beyond the video
// itself autoplaying — same as every other case study hero.
//
// Video processing: source (Feature Animation.mp4, 1920x1080, 38.87s,
// had an audio track) is a Framer-editor screen recording, several
// stages wider/taller than the target 1378:500 box — center-cropped
// vertically (crop=1920:766:0:157, keeping full width, discarding
// ~157px off top and bottom). Initially also scaled down to AIG's
// literal 1378x550 encode size, matching AIG's own pixel dimensions —
// per direct feedback ("make the quality of the video higher"),
// dropped that final downscale and kept the crop at its native
// 1920x766 resolution instead (well above the 1378x500 CSS display
// size, so it renders sharp on retina displays), and lowered CRF from
// 18 to 15 for less compression loss. The box's own CSS sizing is
// still identical to AIG's — only the source encode's own resolution/
// quality changed, which was never something "same as AIG" was meant
// to constrain. Checked several frames across the
// full 38.87s duration first to confirm the crop doesn't cut into any
// frame's core content (each stage of the animation keeps its
// important elements roughly vertically centered). Audio stripped, no
// other trimming — the full animation is comparable in length to
// AIG's own 36.83s hero video, so no need to cut it down.
const META = [
  { label: "Timeline", value: "Mar - May 2026" },
  { label: "Role", value: "UX Designer" },
  { label: "Platform", value: "Web Application" },
  { label: "Team Size", value: "4" },
];

export function FramerRedesignHero() {
  return (
    <section data-nav-theme="light" className="px-5 pt-24 sm:px-8 lg:px-[68px]">
      <Image src={framerLogo} alt="Framer" className="h-[34px] w-auto" />

      <h1 className="mt-6 font-sans text-[32px] font-normal text-black">Framer Redesign</h1>

      <div className="mt-6 flex flex-wrap gap-x-[203px] gap-y-6">
        {META.map((item) => (
          <div key={item.label} className="flex flex-col gap-3">
            <span className="font-sans text-sm text-[#707682]">{item.label}</span>
            <span className="font-sans text-sm text-black">{item.value}</span>
          </div>
        ))}
      </div>

      <div
        className="relative mt-12 w-full overflow-hidden rounded-[10px] border border-[#F4F4F5]"
        style={{ aspectRatio: "1378 / 500" }}
      >
        <video
          src={`${BASE_PATH}/projects/framer-redesign-hero.mp4`}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
