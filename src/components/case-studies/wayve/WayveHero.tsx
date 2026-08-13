import Image from "next/image";
import wayveLogo from "@/assets/logos/wayve.svg";
import { BASE_PATH } from "@/lib/base-path";

// Per direct instruction, reuses the exact text and spacing rules
// already established for the AIG hero (AigHero.tsx) rather than
// re-deriving new values — logo height, h1 size, meta row typography/
// gaps, and the video's own spacing are all identical classes.
//
// The one thing that IS specific to Wayve: precisely measured the
// hero video box directly off the provided high-res mockup (pixel
// color-boundary scan, not eyeballed) — left edge at 245px / right
// edge at 5282px in a 5528px-wide export. 5528/1512 = 3.6561, and
// 245/3.6561 = 67.0, 5282/3.6561 = 1444.9 — confirming this mockup's
// own reference width is the same 1512px used throughout the AIG case
// study, and the video's inset matches the same 67/68px page padding
// convention exactly. The box itself measured 5037x2010px, which
// converts to 1378x550 at the 1512 reference — the same *original*
// (pre-feedback) dimensions AIG's own hero redline had, before several
// rounds of "make it bigger/smaller" tuned it down to a final 500px
// display height. Per "same spacing rule as AIG hero," this reuses
// that already-tuned 500px value directly rather than shipping 550 and
// risking the same multi-round resize conversation again.
//
// Video processing: same technique as AIG's hero — the source
// recording (3456x1934, no audio) doesn't natively match the target
// 1378:500 (2.756:1) aspect, so it's center-cropped to 2.505:1
// (matching AIG's own encode aspect) and encoded at 1378x550, CRF 18,
// no audio. The CSS box then displays it at 1378:500 via aspect-ratio
// + object-cover, identical to AIG's approach of encoding slightly
// taller than the final display box and letting object-cover
// reconcile the difference.
const META = [
  { label: "Timeline", value: "Jan - Mar 2026" },
  { label: "Role", value: "UX Design Lead" },
  { label: "Platform", value: "Ecosystem" },
  { label: "Team Size", value: "16" },
];

export function WayveHero() {
  return (
    <section data-nav-theme="light" className="px-5 pt-24 sm:px-8 lg:px-[68px]">
      <Image src={wayveLogo} alt="Wayve" className="h-[34px] w-auto" />

      <h1 className="mt-6 font-sans text-[32px] font-normal text-black">Wayve</h1>

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
          src={`${BASE_PATH}/projects/wayve-hero.mp4`}
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
