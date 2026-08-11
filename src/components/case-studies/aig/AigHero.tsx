import Image from "next/image";
import aigLogo from "@/assets/logos/aig.svg";

// Figma dev-mode inspect (all values read directly, not approximated):
// - Page horizontal inset is 67px at the 1512px reference width — matches
//   the site's existing lg:px-[68px] convention closely enough to reuse
//   that instead of introducing a one-off 67px value.
// - "American International Group": Inter 32px/400, #000.
// - Each meta column (Timeline/Role/Platform/Team Size): label Inter
//   14px/400 #707682, value Inter 14px/400 #000, 12px gap between them.
//   The row itself is an inline-flex with a 203px gap between columns
//   (not evenly distributed across the full width — confirmed via the
//   row's own measured 921px content width: the 4 columns' natural
//   content widths + three 203px gaps sums to exactly 921).
// - Hero video: 1378px wide, rounded-[10px], 1px solid #F4F4F5 border —
//   sized symmetrically within the same 67px page inset on both sides
//   (1512 - 67 - 67 = 1378), so it's implemented as w-full within the
//   section's own padded content area rather than a separately-tracked
//   fixed width. Height was tuned down from Figma's own 656px via direct
//   feedback across a few rounds (550 -> 450 -> 480 -> 510 -> 500).
// - No bottom padding here — the gap to the next section (Project
//   Overview) is owned by that section's own pt-[87px], measured directly
//   with Figma's ruler tool.
const META = [
  { label: "Timeline", value: "Sep - Nov 2025" },
  { label: "Role", value: "UX Designer" },
  { label: "Platform", value: "Kiosk" },
  { label: "Team Size", value: "15" },
];

export function AigHero() {
  return (
    <section data-nav-theme="light" className="px-5 pt-24 sm:px-8 lg:px-[68px]">
      <Image src={aigLogo} alt="AIG" className="h-[34px] w-auto" />

      <h1 className="mt-6 font-sans text-[32px] font-normal text-black">
        American International Group
      </h1>

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
          src="/projects/aig-hero.mp4"
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
