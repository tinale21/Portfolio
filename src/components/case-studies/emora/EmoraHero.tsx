import Image from "next/image";
import emoraLogo from "@/assets/logos/emora.svg";
import { BASE_PATH } from "@/lib/base-path";

// Per direct instruction, reuses the exact text and spacing rules
// already established for the AIG hero (AigHero.tsx) — logo height,
// h1 size, meta row typography/gaps, and the video box's own sizing
// are all identical classes.
//
// Meta values (Timeline/Role/Platform/Team Size) transcribed directly
// from the provided reference screen recording (Screen Recording
// 2026-08-13 at 6.29.35 PM.mov) of the live reference design, not
// guessed.
//
// Per direct instruction, the hero video reuses the same emora.mp4
// already established as this project's thumbnail video elsewhere on
// the site (homepage/Work grid) — confirmed by extracting a frame from
// that existing file and comparing it directly against the reference
// recording's own hero video content: identical (the app-icon reveal
// animation). No new video needed. That source is 1280x720 (16:9),
// narrower than AIG/Wayve's wide 1378:500 hero box, so object-cover
// crops its top/bottom margins — checked the icon graphic's own
// vertical bounds within the source frame first to confirm this crop
// doesn't clip it (the icon sits centered with generous margin above
// and below, well inside the resulting crop window).
const META = [
  { label: "Timeline", value: "Feb - Feb 2026" },
  { label: "Role", value: "UX Designer" },
  { label: "Platform", value: "Wearables + Mobile" },
  { label: "Team Size", value: "4" },
];

export function EmoraHero() {
  return (
    <section data-nav-theme="light" className="px-5 pt-24 sm:px-8 lg:px-[68px]">
      <Image src={emoraLogo} alt="Emora" className="h-[34px] w-auto" />

      <h1 className="mt-6 font-sans text-[32px] font-normal text-black">Emora</h1>

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
          src={`${BASE_PATH}/projects/emora.mp4`}
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
