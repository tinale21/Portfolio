// Figma dev-mode inspect (colors/typography/radii kept as measured):
// - "Key Findings" eyebrow: Inter 16px/400, #707682 (matches Project
//   Overview's eyebrow exactly).
// - Card: 10px corner radius, 2px solid #F9FAFB border, white
//   background, 11px gap between the number and the body text. Vertical
//   padding bumped from 69px/70px to 90px/90px ("make the box a bit
//   more taller"), then eased back to 80px/80px ("reduce it a bit") —
//   horizontal padding (56px/55px) left as measured throughout.
// - The Figma box-shadow (2px 4px 13px 3px #E8E9EA — a positive 3px
//   spread plus a 13px blur) read as "mushy," a soft indistinct gray
//   halo, once rendered. Replaced with a tighter shadow using a
//   *negative* spread (-4px) to pull it back toward the card's edges
//   plus a translucent black (rgba(0,0,0,0.15)) instead of a flat light
//   gray, for a crisper, more contained elevation than a literal port
//   of the Figma value.
// - Number ("01"/"02"/"03"): Inter 20px/600, #5465DF — reduced to 16px
//   per direct feedback (20 -> 19 -> 18, then set directly to 16).
// - Body text: Inter 20px/400, #000 — reduced to 16px per direct
//   feedback (same steps), now the same size as the "Key Findings"
//   eyebrow above it, though still distinguished by weight/color.
//
// Per direct feedback, the cards don't need to match Figma's fixed
// 422px width / 59px gap — instead the row stretches to fill the
// section's own left/right padding (the standard site-wide
// lg:px-[68px], matching the eyebrow above it) via flex-1 on each
// card, rather than fixed widths with a specific gap value. Gap
// between cards later increased (gap-8 -> gap-12), then eased back
// (-> gap-10) alongside the height reduction above — still bounded by
// the same left/right padding throughout.
const FINDINGS = [
  {
    number: "01",
    text: "Employees shared that guests need quick, intuitive navigation upon arrival.",
  },
  {
    number: "02",
    text: "Research showed opportunities to extend wayfinding with AIG storytelling & local resources.",
  },
  {
    number: "03",
    text: "AIG's innovation should be communicated through usability, not complexity.",
  },
];

export function AigKeyFindings() {
  return (
    <section data-nav-theme="light" className="bg-white pt-16 pb-16">
      <p className="px-5 font-sans text-base text-[#707682] sm:px-8 lg:px-[68px]">
        Key Findings
      </p>

      <div className="mt-8 flex flex-col gap-8 px-5 sm:flex-row sm:gap-10 sm:px-8 lg:px-[68px]">
        {FINDINGS.map((item) => (
          <div
            key={item.number}
            className="flex w-full flex-1 flex-col items-start gap-[11px] rounded-[10px] border-2 border-[#F9FAFB] bg-white pt-[80px] pr-[56px] pb-[80px] pl-[55px] shadow-[0px_4px_10px_-4px_rgba(0,0,0,0.15)]"
          >
            <p className="font-sans text-base font-semibold text-[#5465DF]">{item.number}</p>
            <p className="font-sans text-base font-normal text-black">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
