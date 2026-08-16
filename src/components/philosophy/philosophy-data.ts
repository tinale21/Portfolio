import { StaticImageData } from "next/image";
import rect19 from "@/assets/philosophy/rect-19.png";
import rect20 from "@/assets/philosophy/rect-20.png";
import rect21 from "@/assets/philosophy/rect-21.png";
import rect22 from "@/assets/philosophy/rect-22.png";
import rect23 from "@/assets/philosophy/rect-23.png";
import rect24 from "@/assets/philosophy/rect-24.png";
import rect25 from "@/assets/philosophy/rect-25.png";
import rect26 from "@/assets/philosophy/rect-26.png";

// Figma dev-mode inspect: "Frame 3" is 1512x982. Every image rectangle's
// position was read as its distance to all 4 frame edges (top/left/right/
// bottom) and converted here to (x, y, w, h) — cross-checked two ways per
// rectangle (e.g. left + width should equal frameWidth - right) and every
// one matched exactly. The exported PNGs are each exactly 4x these
// dimensions (retina export), confirming the mapping.
export const FIGMA_WIDTH = 1512;
export const FIGMA_HEIGHT = 982;

export type PhilosophyImage = {
  src: StaticImageData;
  alt: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
};

// z ordering: within each of the 4 spatial pairs, the smaller rectangle
// sits in front of the larger one (matches the one pair I could directly
// confirm visually — the AIG dashboard mockup rendering in front of its
// backdrop — and is a reasonable default for the other 3 pairs).
export const PHILOSOPHY_IMAGES: PhilosophyImage[] = [
  { src: rect23, alt: "", x: 132, y: 38, w: 355, h: 231, z: 10 },
  {
    src: rect24,
    alt: "AIG Innovation Hub dashboard screen",
    x: 307,
    y: -34,
    w: 321,
    h: 209,
    z: 15,
  },
  { src: rect21, alt: "", x: 1108, y: 62, w: 335, h: 231, z: 20 },
  {
    src: rect22,
    alt: "Smoky Chipotle Chicken Bowl recipe page",
    x: 851,
    y: -38,
    w: 288,
    h: 201,
    z: 25,
  },
  { src: rect25, alt: "", x: 69, y: 660, w: 403, h: 288, z: 30 },
  {
    src: rect26,
    alt: "Delivery app phone mockups",
    x: 472,
    y: 854,
    w: 250,
    h: 174,
    z: 35,
  },
  { src: rect19, alt: "", x: 1100, y: 690, w: 351, h: 228, z: 40 },
  {
    src: rect20,
    alt: "AIG Explore ATL screen",
    x: 1147,
    y: 894,
    w: 254,
    h: 173,
    z: 45,
  },
];

// Every image starts centered on this exact same point — vertically the
// midpoint of the gap between the top image row (bottom edge at y=293,
// the max of the 4 top rectangles' bottom edges) and the bottom image row
// (top edge at y=660, the min of the 4 bottom rectangles' top edges).
// Deliberately identical for every card (no per-image offset) so the
// starting composition is a true deck-of-cards stack — all cards exactly
// overlapping, nothing peeking out — rather than a scattered cluster.
export const CLUSTER_CENTER_X = FIGMA_WIDTH / 2;
export const CLUSTER_CENTER_Y = 476.5;

// Uniform card size (Figma px) every image is stretched to during the
// clustered starting state — independent scaleX/scaleY per image (rather
// than one aspect-preserving scale factor based on each image's own max
// dimension) so every card in the stack is actually the same size, not
// just the same max dimension. Each image still returns to its own true
// aspect ratio by the end of the animation (scaleX/scaleY both -> 1).
// Base 460x310 bumped up by the same 10% on both axes, rather than two
// independently-chosen numbers, per request to scale both dimensions by
// an identical amount.
const CLUSTER_CARD_SCALE_UP = 1.1;
export const CLUSTER_CARD_WIDTH = 460 * CLUSTER_CARD_SCALE_UP;
export const CLUSTER_CARD_HEIGHT = 310 * CLUSTER_CARD_SCALE_UP;

// Opening/closing marks are rendered separately from the body so they can
// hang outside the centered text block (see PhilosophySection) instead of
// sitting flush with the rest of the first/last line. Line breaks are
// explicit rather than left to natural wrapping, per design feedback that
// the first line should read longer than the second.
export const QUOTE_OPEN = "“";
export const QUOTE_CLOSE = "”";
export const QUOTE_LINES = [
  "Design is not just what we make, but how",
  "thoughtfully we make it.",
];

// Figma dev-mode inspect specified 955px/32px. Since the quote is hidden
// at the start via opacity (see PhilosophySection's quoteOpacity), not by
// being physically covered by the image cluster, this width is no longer
// tied to the cluster's own size — it's set purely to fit the QUOTE_LINES
// split as exactly 2 lines at the current font size.
export const QUOTE_WIDTH = 570;

// Mobile version of the same cluster-then-spread mechanism, per direct
// feedback ("the logic of the motion should work like how it is on
// desktop where all the images start off at the same scale and one
// behind another, then when users scroll the images move out and adjust
// in scale, the quotes also fades in") — a request to replicate the
// *mechanism* (shared cluster, one scroll-linked progress driving every
// image plus the quote), not just the general vibe. A first mobile pass
// used a single tall vertical column with a per-pair scroll progress
// instead — closer to the *feel* than the actual logic, and rejected for
// exactly that reason.
//
// Desktop's mechanism only works at all because its position:sticky pin
// is *shorter* than the viewport it pins against (see this file's other
// mobile-related comments in PhilosophySection.tsx/PhilosophyMobile-
// Section.tsx for the fuller "why not just port it directly" reasoning).
// A single-column stack of 8 images tall enough to read comfortably is
// necessarily taller than a phone viewport, which is exactly why the
// first pass abandoned pinning. The fix here isn't abandoning pinning —
// it's making the composition itself compact enough that pinning works:
// a 2x2 grid of pairs (mirroring desktop's own spatial structure — 2
// pairs above the quote, 2 below) using *uniform* box sizes for every
// large/small photo (rather than each photo's true native w/h, which is
// what let desktop's frame sprawl wide) keeps the whole thing under one
// typical mobile viewport height even at a comfortable image size.
//
// MOBILE_FIGMA_WIDTH/HEIGHT is this composition's own reference frame
// (360x620, an aspect ratio close to 0.58 — genuinely portrait, unlike
// desktop's 1512x982 landscape frame) — small enough in practice that at
// a ~380-390px rendered width, the whole thing lands around 650-670px
// tall, comfortably inside one mobile viewport's available height.
export const MOBILE_FIGMA_WIDTH = 360;
export const MOBILE_FIGMA_HEIGHT = 620;

// Uniform box per role (not each photo's own native w/h — see comment
// above) so every "large" photo shares one box and every "small" photo
// shares another; object-cover crops each source photo to fit. z mirrors
// the same "smaller rect sits in front of the larger one" rule desktop's
// own PHILOSOPHY_IMAGES comment describes.
export const MOBILE_PHILOSOPHY_IMAGES: PhilosophyImage[] = [
  { src: rect23, alt: "", x: 12, y: 45, w: 150, h: 105, z: 10 },
  { src: rect24, alt: "AIG Innovation Hub dashboard screen", x: 2, y: 20, w: 88, h: 62, z: 15 },
  { src: rect21, alt: "", x: 198, y: 45, w: 150, h: 105, z: 20 },
  { src: rect22, alt: "Smoky Chipotle Chicken Bowl recipe page", x: 270, y: 20, w: 88, h: 62, z: 25 },
  { src: rect25, alt: "", x: 12, y: 470, w: 150, h: 105, z: 30 },
  { src: rect26, alt: "Delivery app phone mockups", x: 2, y: 445, w: 88, h: 62, z: 35 },
  { src: rect19, alt: "", x: 198, y: 470, w: 150, h: 105, z: 40 },
  { src: rect20, alt: "AIG Explore ATL screen", x: 270, y: 445, w: 88, h: 62, z: 45 },
];

// Vertical midpoint of the gap between the top row's bottom edge (150,
// the max of the top two large photos' bottom edges) and the bottom
// row's top edge (445, the min of the bottom two small photos' top
// edges) — same "midpoint of the gap between the halves" rule as
// desktop's own CLUSTER_CENTER_Y, just computed against this frame's own
// numbers.
export const MOBILE_CLUSTER_CENTER_X = MOBILE_FIGMA_WIDTH / 2;
export const MOBILE_CLUSTER_CENTER_Y = (150 + 445) / 2;

// One shared starting size for every photo regardless of its final
// large/small role — same reasoning as desktop's own CLUSTER_CARD_WIDTH/
// HEIGHT (a true deck-of-cards stack, nothing peeking out at rest),
// just sized down to fit this frame's own scale.
export const MOBILE_CLUSTER_CARD_WIDTH = 130;
export const MOBILE_CLUSTER_CARD_HEIGHT = 90;
