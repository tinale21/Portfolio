import { BASE_PATH } from "@/lib/base-path";

// Source: Group 1000013359.svg (Figma export), 1396x288 viewBox. That
// file embedded 5 full-resolution photos directly as base64 (15MB total)
// inside a <pattern>/<use> structure driving 5 flat-left/round-right
// "D"-shaped paths, plus 4 small white "notch" paths layered between them
// to create the pinched, scalloped seams where adjacent photos meet, plus
// ~15 more paths (in #4A25A9/#895FCF) that turned out — once inspected via
// getBBox() in a real browser rather than guessed from raw path data — to
// be layered/overlapping shapes, not readable digit glyphs. Rather than
// risk misreproducing an ambiguous flattened effect, the "01"-"05" numbers
// here are built as plain live text instead, matching how every other
// numbered section in this codebase (Key Findings, Exploration &
// Iterations) already handles numerals — same #4A25A9 dark purple as
// this file's own dominant color, which is also this Wayve case study's
// established accent (WayveExplorationIterations' ACTIVE_COLOR). The
// description color, #895FCF, is the file's other real color, reused
// directly rather than guessed.
//
// The photo band itself IS reproduced pixel-for-pixel from the original:
// the 9 relevant paths (5 photo shapes + 4 white notches) are used
// verbatim below, in their original document order (which sets z-stack —
// the leftmost/Technology segment is drawn last, on top of everything to
// its right, exactly as in the source). Each photo swaps the original's
// embedded base64 for an external, optimized JPEG (extracted from the
// source SVG, longest side capped at 900px, ~90% smaller per file) and
// uses a plain SVG <image preserveAspectRatio="xMidYMid slice">, the
// native SVG equivalent of CSS object-fit:cover — this sidesteps having
// to hand-derive the original's objectBoundingBox pattern-matrix math for
// resized images, while still cropping/centering correctly regardless of
// each source photo's own aspect ratio.
//
// This is a new section format (no prior AIG or Wayve section uses this
// layout) with no separate dev-mode redlines provided for it — spacing
// and type sizes below are approximated directly from the reference
// screenshot's proportions (screenshot dated 2026-08-13 5:06:23 PM) and
// verified by side-by-side comparison against a rendered screenshot,
// same approach used for other un-redlined sections in this codebase.
//
// Layout: photo band spans the standard page padding (lg:px-[68px]),
// same as every section except Exploration & Iterations. The 5 items'
// text sits in a 5-column grid above (odd items) or below (even items)
// the shared photo band — matching the source SVG's own item ordering,
// where odd items' numbers sit just above the band and even items' just
// below.
const PHOTOS = {
  technology: `${BASE_PATH}/case-studies/wayve/scales/technology.jpg`,
  venueActivation: `${BASE_PATH}/case-studies/wayve/scales/venue-activation.jpg`,
  digitalOwnership: `${BASE_PATH}/case-studies/wayve/scales/digital-ownership.jpg`,
  socialSharing: `${BASE_PATH}/case-studies/wayve/scales/social-sharing.jpg`,
  newUsers: `${BASE_PATH}/case-studies/wayve/scales/new-users.jpg`,
};

const ITEMS = [
  {
    number: "01",
    heading: "Technology",
    description: "A digitally curated app that tracks user engagement.",
    position: "top",
  },
  {
    number: "02",
    heading: "Venue Activation",
    description: "Launch pop-ups to create engagement and revenue.",
    position: "bottom",
  },
  {
    number: "03",
    heading: "Digital Ownership",
    description: "Companion app drives global growth and engagement.",
    position: "top",
  },
  {
    number: "04",
    heading: "Social Sharing",
    description: "Expand the community through users sharing.",
    position: "bottom",
  },
  {
    number: "05",
    heading: "New Users",
    description: "Personalized discovery drives return visits.",
    position: "top",
  },
] as const;

function ItemText({ item }: { item: (typeof ITEMS)[number] }) {
  return (
    <div className="flex flex-col">
      {item.position === "top" && (
        <>
          <p className="font-sans text-2xl font-bold text-[#4A25A9]">{item.heading}</p>
          <p className="mt-2 font-sans text-[15px] text-[#895FCF]">{item.description}</p>
          <p className="mt-4 font-sans text-6xl font-bold leading-none text-[#4A25A9]">
            {item.number}
          </p>
        </>
      )}
      {item.position === "bottom" && (
        <>
          <p className="font-sans text-6xl font-bold leading-none text-[#4A25A9]">
            {item.number}
          </p>
          <p className="mt-4 font-sans text-2xl font-bold text-[#4A25A9]">{item.heading}</p>
          <p className="mt-2 font-sans text-[15px] text-[#895FCF]">{item.description}</p>
        </>
      )}
    </div>
  );
}

export function WayveHowWayveScales() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-16 pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">How Wayve Scales</p>
      <p className="mt-4 font-sans text-2xl font-bold text-black">From Event to Ecosystem</p>

      <div className="mt-16 grid grid-cols-5 items-end gap-4">
        {ITEMS.map((item) => (
          <div key={item.number} className="flex">
            {item.position === "top" ? <ItemText item={item} /> : <div className="h-full" />}
          </div>
        ))}
      </div>

      <svg viewBox="0 0 1396 288" className="mt-4 w-full">
        <defs>
          <clipPath id="wayve-scales-clip-0">
            <path d="M1084.76 89.4751H1311.01C1338.26 89.4751 1360.35 111.565 1360.35 138.815V138.815C1360.35 166.065 1338.26 188.155 1311.01 188.155H1084.76V89.4751Z" />
          </clipPath>
          <clipPath id="wayve-scales-clip-2">
            <path d="M814.501 89.4751H1040.75C1068 89.4751 1090.09 111.565 1090.09 138.815V138.815C1090.09 166.065 1068 188.155 1040.75 188.155H814.501V89.4751Z" />
          </clipPath>
          <clipPath id="wayve-scales-clip-4">
            <path d="M544.242 89.4751H770.495C797.745 89.4751 819.835 111.565 819.835 138.815V138.815C819.835 166.065 797.745 188.155 770.495 188.155H544.242V89.4751Z" />
          </clipPath>
          <clipPath id="wayve-scales-clip-6">
            <path d="M274.873 89.4751H501.125C528.375 89.4751 550.466 111.565 550.466 138.815V138.815C550.466 166.065 528.375 188.155 501.125 188.155H274.873V89.4751Z" />
          </clipPath>
          <clipPath id="wayve-scales-clip-8">
            <path d="M4 90H231C258.062 90 280 111.938 280 139V139C280 166.062 258.062 188 231 188H4V90Z" />
          </clipPath>
        </defs>

        <image
          href={PHOTOS.newUsers}
          x="1084.76"
          y="89.4751"
          width="275.6"
          height="98.68"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#wayve-scales-clip-0)"
        />
        <path d="M1073.2 89.4751H1076.31C1103.56 89.4751 1125.65 111.565 1125.65 138.815V138.815C1125.65 166.065 1103.56 188.155 1076.31 188.155H1073.2V89.4751Z" fill="white" />

        <image
          href={PHOTOS.socialSharing}
          x="814.501"
          y="89.4751"
          width="275.6"
          height="98.68"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#wayve-scales-clip-2)"
        />
        <path d="M802.944 89.4751H806.055C833.305 89.4751 855.395 111.565 855.395 138.815V138.815C855.395 166.065 833.305 188.155 806.055 188.155H802.944V89.4751Z" fill="white" />

        <image
          href={PHOTOS.digitalOwnership}
          x="544.242"
          y="89.4751"
          width="275.6"
          height="98.68"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#wayve-scales-clip-4)"
        />
        <path d="M532.685 89.4751H535.797C563.046 89.4751 585.137 111.565 585.137 138.815V138.815C585.137 166.065 563.046 188.155 535.797 188.155H532.685V89.4751Z" fill="white" />

        <image
          href={PHOTOS.venueActivation}
          x="274.873"
          y="89.4751"
          width="275.6"
          height="98.68"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#wayve-scales-clip-6)"
        />
        <path d="M263.315 89.4751H266.427C293.677 89.4751 315.767 111.565 315.767 138.815V138.815C315.767 166.065 293.677 188.155 266.427 188.155H263.315V89.4751Z" fill="white" />

        <image
          href={PHOTOS.technology}
          x="4"
          y="90"
          width="276"
          height="98"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#wayve-scales-clip-8)"
        />
      </svg>

      <div className="mt-4 grid grid-cols-5 items-start gap-4">
        {ITEMS.map((item) => (
          <div key={item.number} className="flex">
            {item.position === "bottom" ? <ItemText item={item} /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
