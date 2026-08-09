import { StaticImageData } from "next/image";
import about1 from "@/assets/about/about1.png";
import about2 from "@/assets/about/about2.png";
import about3 from "@/assets/about/about3.png";
import about4 from "@/assets/about/about4.png";

// Motion reference (video + justharshal/parashux-style live sites) confirmed
// via direct Puppeteer measurement that this "case study list" pattern is
// NOT a pinned/sticky reveal despite superficially looking like one — each
// entry is a plain block exactly one viewport tall, stacked in normal
// document flow with no scroll-linked opacity/transform animation at all.
// The "porthole" look is purely an artifact of full-viewport-height blocks.
// So unlike Connect/Philosophy, nothing here needs FIGMA_WIDTH/HEIGHT
// pixel-for-pixel mapping — each entry's internal layout (name stack /
// photo / tagline stack) is built as a responsive flex row instead.
export type AboutEntry = {
  // Each of these is an explicit array of lines, not a wrapped string — per
  // direct feedback the line count needs to match Figma exactly rather than
  // wrap naturally at whatever width the responsive column happens to be.
  // Figma dev-mode's own line counts were derived from each text box's
  // H-Fixed value, which matches fontSize * 1.2 (normal line-height) *
  // number of lines exactly for every element checked (e.g. "finding good
  // experiences" at 32px font measured H:117 = 32*1.2*3 — a hard 3-line
  // break, not 1 or 2).
  traitLines: string[];
  taglineLines: string[];
  captionLines: string[];
  image: StaticImageData;
  alt: string;
  // Extra zoom + horizontal pan for the photo, on top of the shared
  // PARALLAX_RANGE_PX-driven scale in AboutEntry.tsx. object-position
  // turned out to have no visible effect here: the actual about4.png file
  // is 1460x2052, which already almost exactly matches the 365:513 photo
  // box's own aspect ratio, so object-fit: cover has essentially zero
  // overflow to pan within regardless of position value. Panning for real
  // requires first zooming in (creating overflow) and then shifting via
  // translateX — photoZoom multiplies onto the base scale, photoPanX
  // shifts right by that % of the (already zoomed) image's own width,
  // revealing more of the source photo's left side.
  photoZoom?: number;
  photoPanX?: number;
};

// Signature name above every trait word — same literal text and same
// italic-300 style in all four Figma dev-mode entries.
export const SIGNATURE = "Tina Le";

// Figma dev-mode inspect: "led by curosity" — kept the rest of the copy
// verbatim, but this one reads as an unintentional typo (missing "i")
// rather than a deliberate spelling, so it's corrected to "curiosity" here.
//
// All four captions' line breaks are now the literal Figma breaks (given
// directly), not inferred/balanced guesses — Foodie and Potterhead's
// wrap points differ from the earlier balanced-guess version.
export const ABOUT_ENTRIES: AboutEntry[] = [
  {
    traitLines: ["Explorer"],
    taglineLines: ["led by", "curiosity"],
    captionLines: ["Checking the Washington", "Monument off my list."],
    image: about1,
    alt: "Tina Le and a friend pointing at the top of the Washington Monument across the reflecting pool",
  },
  {
    traitLines: ["Foodie"],
    taglineLines: ["finding", "good", "experiences"],
    captionLines: ["Good food makes every", "day better."],
    image: about2,
    alt: "Tina Le eating a breakfast sandwich at an outdoor cafe table",
  },
  {
    traitLines: ["Potterhead"],
    taglineLines: ["living for", "the magic"],
    captionLines: ["Butterbeer is always worth", "the trip."],
    image: about3,
    alt: "Tina Le holding a butterbeer at Universal Studios' Diagon Alley at night",
  },
  {
    traitLines: ["Animal", "Friend"],
    taglineLines: ["guided by", "empathy"],
    captionLines: ["Probably saying hi to", "every cat."],
    image: about4,
    alt: "Four cats piled together on a carpet",
    photoZoom: 1.2,
    photoPanX: 14,
  },
];

// Figma mockup's own mission-quote styling wasn't captured in dev-mode
// inspect — styled here to match PhilosophySection's quote treatment
// (hanging punctuation, italic serif) for visual consistency with the rest
// of the site rather than guessing new values.
export const MISSION_QUOTE_OPEN = "“";
export const MISSION_QUOTE_CLOSE = "”";
export const MISSION_QUOTE =
  "My mission is to use research, empathy, and visual design to create solutions that support real people in practical ways.";
