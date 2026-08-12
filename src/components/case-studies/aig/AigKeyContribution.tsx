import Image from "next/image";
import competitorResearchIcon from "@/assets/case-studies/aig/icons/competitor-research.svg";
import prototypesIcon from "@/assets/case-studies/aig/icons/prototypes.svg";
import userManualIcon from "@/assets/case-studies/aig/icons/user-manual.svg";

// Figma dev-mode inspect. All the following are direct, cross-validated
// redline reads (each pair of numbers below sums exactly to a known
// container dimension, with zero rounding error):
// - Section background #F7F7F7, full width, 380px tall.
// - "Key Contribution" eyebrow: Inter 16px/400, #6C727D (a different gray
//   than Project Overview's eyebrow, #707682 — read directly off this
//   element, not assumed to match).
// - Top padding (section top to eyebrow top): 59px.
// - Icon row's top offset from the section top: 145px, and its own frame
//   is 267x157 in Figma (72px icon + 31px gap + hugged text height —
//   read directly off the item frame's padding box). 145 + 157 = 302,
//   and 380 - 302 = 78 — giving a clean pb-[78px] with zero error. Text
//   height itself is left as auto/hug here rather than hard-coded, since
//   it naturally wraps to the same 3 lines per item as Figma's own
//   redlines show at this 267px width.
// - The gap between the eyebrow and the icon row (67px) isn't a single
//   direct reading — it's 145 (icon row top) minus 59 (eyebrow top) minus
//   the eyebrow's own ~19px line height, i.e. arithmetic, not a redline.
// - Icon: 72x72px in Figma (the exported SVGs are already sized exactly
//   to that) — scaled down to 64px per direct feedback, to match the
//   text's reduction from 15px to 14px.
// - Item text: Inter, #000, self-stretch'd to the item's full 267px
//   width (left-aligned), while the icon itself stays centered in that
//   same 267px column (hence the icon and its text don't share a left
//   edge — visible in the Figma screenshots). Figma's own redline read
//   15px/500, changed to 14px per direct feedback.
// - The first item's left edge sits 216px in from the section's left
//   edge (216 + 267 + 1029 = 1512, exact) — i.e. the icon row is inset
//   well beyond the eyebrow's own 68px page-padding, not flush with it.
//   Only item 1's position was directly measured; items 2/3 and the
//   gaps between all three assume a symmetric 216px right margin and
//   equal spacing (via justify-between) — reasonable given how exact
//   the confirmed numbers are, but not itself independently confirmed.
const ITEMS = [
  {
    icon: competitorResearchIcon,
    text: "Conducted competitor research on kiosk experiences and AIG to inform design decisions.",
  },
  {
    icon: prototypesIcon,
    text: "Designed high-fidelity Figma prototypes for the Explore ATL and About AIG features.",
  },
  {
    icon: userManualIcon,
    text: "Created a user manual explaining how to navigate and interact with the Figma prototype.",
  },
];

export function AigKeyContribution() {
  return (
    <section data-nav-theme="light" className="bg-[#F7F7F7] pt-[59px] pb-[78px]">
      <p className="px-5 font-sans text-base text-[#6C727D] sm:px-8 lg:px-[68px]">
        Key Contribution
      </p>

      <div className="mt-[67px] flex flex-col gap-8 px-5 sm:flex-row sm:justify-between sm:px-8 lg:px-[216px]">
        {ITEMS.map((item) => (
          <div
            key={item.text}
            className="flex w-full flex-col items-center gap-[31px] sm:w-[267px]"
          >
            <Image src={item.icon} alt="" className="h-[64px] w-[64px]" />
            <p className="self-stretch font-sans text-sm font-medium text-black">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
