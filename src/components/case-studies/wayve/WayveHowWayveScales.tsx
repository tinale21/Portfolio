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
// same as every section except Exploration & Iterations. Per direct
// feedback, an initial version stacked each item's number above/below
// its heading+description — the reference actually pairs them
// horizontally (number to the left, heading+description stacked to its
// right), matching the description block's own combined height. Each
// item's `left` is measured directly from the reference screenshot
// (color-thresholded to isolate the purple number/heading runs, then
// read as a fraction of image width) and lines up almost exactly with
// that item's own photo segment's flat left edge (not its center) in
// the 1396-wide source SVG — e.g. item 3 measured at 39.1% vs. its
// photo's 39.0%. Used the SVG's own left-edge fractions here since
// they're exact, rather than the screenshot's pixel-measured
// approximation. Positioned via absolute inset (not a 5-column grid,
// which forced 2-line wraps on headings like "Digital Ownership" —
// the reference keeps every heading on one line since it has the
// width of its unoccupied neighboring columns to grow into).
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
    descriptionLines: ["A digitally curated app that", "tracks user engagement."],
    position: "top",
    leftPercent: 0.29,
  },
  {
    number: "02",
    heading: "Venue Activation",
    descriptionLines: ["Launch pop-ups to create", "engagement and revenue."],
    position: "bottom",
    leftPercent: 19.69,
  },
  {
    number: "03",
    heading: "Digital Ownership",
    descriptionLines: ["Companion app drives global", "growth and engagement."],
    position: "top",
    leftPercent: 39.0,
  },
  {
    number: "04",
    heading: "Social Sharing",
    descriptionLines: ["Expand the community", "through users sharing."],
    position: "bottom",
    leftPercent: 58.35,
  },
  {
    number: "05",
    heading: "New Users",
    descriptionLines: ["Personalized discovery", "drives return visits."],
    position: "top",
    leftPercent: 77.71,
  },
] as const;

function ItemText({
  item,
  align,
}: {
  item: (typeof ITEMS)[number];
  align: "top" | "bottom";
}) {
  return (
    <div
      className={`absolute flex items-center gap-4 whitespace-nowrap ${align === "top" ? "top-0" : "bottom-0"}`}
      style={{ left: `${item.leftPercent}%` }}
    >
      <p className="font-sans text-[59px] font-bold leading-none text-black">{item.number}</p>
      <div className="flex flex-col">
        <p className="font-sans text-[23px] font-bold text-black">{item.heading}</p>
        <p className="mt-1 font-sans text-[14px] leading-snug text-black">
          {item.descriptionLines[0]}
          <br />
          {item.descriptionLines[1]}
        </p>
      </div>
    </div>
  );
}

export function WayveHowWayveScales() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-24 pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">How Wayve Scales</p>
      <p className="mt-4 font-sans text-[15px] font-medium text-black">From Event to Ecosystem</p>

      <div className="relative mt-24 h-16">
        {ITEMS.filter((item) => item.position === "top").map((item) => (
          <ItemText key={item.number} item={item} align="bottom" />
        ))}
      </div>

      <svg viewBox="0 89.4751 1396 98.68" className="mt-5 w-full">
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
          preserveAspectRatio="xMidYMin slice"
          clipPath="url(#wayve-scales-clip-8)"
        />
      </svg>

      <div className="relative mt-5 h-16">
        {ITEMS.filter((item) => item.position === "bottom").map((item) => (
          <ItemText key={item.number} item={item} align="top" />
        ))}
      </div>
    </section>
  );
}
