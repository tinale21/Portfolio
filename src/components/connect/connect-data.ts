import { StaticImageData } from "next/image";
import photo1 from "@/assets/connect/photo1.png";
import photo2 from "@/assets/connect/photo2.png";
import photo3 from "@/assets/connect/photo3.png";
import photo4 from "@/assets/connect/photo4.png";
import photo5 from "@/assets/connect/photo5.png";
import photo6 from "@/assets/connect/photo6.png";

// Figma dev-mode inspect: "Frame 4" is 1512x982, dark background constant
// across the whole section. Each photo's width/height came straight off
// its own Layout panel; x was cross-checked via left + width = frameWidth
// - right and matched exactly for every photo. y had only one usable
// distance reading for photo2 and photo3 (Figma's "Layer properties"
// diagram didn't disclose whether it was measured from the top or bottom
// edge for those two) — both readings were arithmetically valid on their
// own. photo2's was resolved by rendering both: y=97 put it directly on
// top of the heading (unreadable), so y=476 is the one that actually
// matches a plausible design. photo3 had no such tiebreaker either way,
// so it's still a best guess pending a closer look against the visual
// reference.
export const FIGMA_WIDTH = 1512;
export const FIGMA_HEIGHT = 982;

export type ConnectPhotoData = {
  src: StaticImageData;
  alt: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  arrival: number;
};

// `arrival` is the single scroll-progress point (0-1) at which a photo is
// exactly at its Figma resting position — before that it's still rising
// from below, after it keeps rising and exits above the frame. This is a
// judgment call, not Figma data (the layout screenshots only gave static
// end positions; timing came from prose ("staggered naturally") plus the
// motion reference). Evenly spread, in the order the photos were sent.
export const CONNECT_PHOTOS: ConnectPhotoData[] = [
  { src: photo1, alt: "", x: 1098, y: 139, w: 248, h: 349, z: 10, arrival: 0.15 },
  { src: photo2, alt: "", x: 68, y: 476, w: 264, h: 409, z: 20, arrival: 0.29 },
  { src: photo3, alt: "", x: 463, y: 484, w: 218, h: 269, z: 30, arrival: 0.43 },
  { src: photo4, alt: "", x: 1210, y: 369, w: 232, h: 458, z: 40, arrival: 0.57 },
  { src: photo5, alt: "", x: 145, y: 400, w: 249, h: 348, z: 50, arrival: 0.71 },
  { src: photo6, alt: "", x: 955, y: 557, w: 152, h: 191, z: 60, arrival: 0.85 },
];

// Motion doesn't stop once a photo reaches its resting spot — confirmed by
// scrolling the live reference and watching photos keep rising and exit
// above the frame rather than freezing in place, and by sampling its DOM
// across the full scroll range (each photo's `top` changed continuously
// through the whole range, never plateauing). So each photo's vertical
// offset is a straight, unclamped line through 3 points: comfortably below
// the frame at progress 0, exactly at rest at its own `arrival`, and
// comfortably above (exited) at progress 1 — sized off the actual photo
// positions so every photo, regardless of where it sits, starts fully
// hidden below the frame and fully clears the top by the end.
// (Motion is vertical-only, no horizontal drift — confirmed the same two
// ways: the video shows every photo entering low/exiting high with no
// diagonal component, and the live site's own DOM had `left` completely
// constant while `top` changed continuously.)
export const ENTRY_BEFORE = Math.max(...CONNECT_PHOTOS.map((p) => FIGMA_HEIGHT - p.y)) + 150;
export const ENTRY_AFTER = Math.max(...CONNECT_PHOTOS.map((p) => p.y + p.h)) + 150;

// Figma dev-mode inspect: Inria Serif, 48px, Bold, white. No dev-mode
// position was given for the heading itself — and per direct feedback
// plus the same DOM sampling above, it isn't part of the Figma-frame
// layout at all. On the live reference, the heading (and its two flanking
// icons) sit in their own truly `position: sticky` layer with a
// completely constant transform across the whole scroll range — dead
// center in the viewport, never moving — while the photos animate in a
// separate layer underneath. Rendered centered here the same way, fully
// decoupled from the FIGMA_WIDTH/HEIGHT photo-positioning system.
export const HEADING = "Let's Connect";
export const HEADING_FONT_SIZE_VW = (48 / FIGMA_WIDTH) * 100;

// Shared by ConnectSection (which uses `hold`) and ExperiencesSection
// (which uses `pull`) to produce the "heading scrolls behind the next
// section" exit effect. Both used to be fixed px constants tuned against
// one 1512x900 test viewport — that broke the moment the heading's own
// centering was fixed to track the *real* viewport height (a shorter
// browser window moves the heading up on screen, which changes how much
// pull is actually needed to reach it). Deriving both from the live
// viewport dimensions instead keeps the effect correct at any window
// size.
//
// Derivation: `pull` needs to be big enough that Experiences' rising
// white background reaches the heading's on-screen y-position
// (viewportHeight/2) no later than the moment Connect's pin releases —
// working through the same wrapper-height/sticky-release algebra as
// ConnectSection's own comments, that threshold is
// `stickyHeight - viewportHeight/2`, plus PULL_MARGIN so it happens
// clearly before release rather than right at the edge. Clamped to stay
// under ExperiencesSection's own natural content height (~780px measured)
// so the pull can never overshoot into whatever comes after it (see
// ExperiencesSection's own comment for what happens if it does).
//
// `hold` then needs to buy enough *extra* pinned scroll distance that the
// reveal (which always takes exactly one viewport height to go from "just
// touching the bottom edge" to "fully covers") doesn't start until
// REVEAL_MARGIN past progress reaching 1 (all photos exited). Derived
// directly from the actual (possibly clamped) `pull` above, not
// re-approximated, so it stays correct even at the extremes where the
// clamp kicks in. Both margins were 100px originally — tightened to 20px
// after feedback that the stretch of plain dark background between
// "photos gone" and "next section visibly arriving" felt too long. Below
// ~15-20px risks the reveal starting while the last photo (per its
// ENTRY_AFTER exit cushion) hasn't fully cleared the frame.
const PULL_MARGIN = 20;
const REVEAL_MARGIN = 20;

export function getConnectExitTiming(viewportWidth: number, viewportHeight: number) {
  const stickyHeight = viewportWidth * (FIGMA_HEIGHT / FIGMA_WIDTH);
  const pull = Math.min(750, Math.max(300, stickyHeight - viewportHeight / 2 + PULL_MARGIN));
  const hold = Math.max(100, REVEAL_MARGIN + pull + viewportHeight - stickyHeight);
  return { pull, hold };
}
