import { StaticImageData } from "next/image";

import aigKiosk from "@/assets/hero/aig-kiosk.jpg";
import constructionSite from "@/assets/hero/construction-site.jpg";
import lobbyWalk from "@/assets/hero/lobby-walk.jpg";
import officeMeeting from "@/assets/hero/office-meeting.jpg";
import portrait from "@/assets/hero/portrait.jpg";
import presentationRoom from "@/assets/hero/presentation-room.jpg";
import scadproGroup from "@/assets/hero/scadpro-group.jpg";
import wallCritique from "@/assets/hero/wall-critique.jpg";
import workshopTable from "@/assets/hero/workshop-table.jpg";

export type CollagePhotoConfig = {
  src: StaticImageData;
  alt: string;
  top: string;
  left: string;
  width: string;
  height: string;
  rotate?: number;
  z: number;
  depth?: number;
  priority?: boolean;
};

// Source of truth: Figma dev-mode inspect values (Rectangle 39-47), read
// directly off the design file — not estimated from the exported PNG.
// Frame is 1512 x 898 (includes the 84px nav), border-radius 10px on every
// photo, no rotation. Each rectangle's width/height matched its production
// asset's aspect ratio exactly (0.0000 diff), confirming the mapping below.
//
//   name              left  top  width height
//   portrait           584  168   363   507
//   scadproGroup        359  266   376   253
//   lobbyWalk           441  400   175   223
//   aigKiosk            699  124   154   200
//   workshopTable       907  211   159   215
//   wallCritique        889  381   264   262
//   constructionSite    379  526   258   239
//   presentationRoom    873  623   184   151
//   officeMeeting       675  572   168   151
//
// Percentages below convert those px values to % of the 1512-wide frame
// (left/width) and % of the 650px container height (top/height). Container
// height is tight-cropped to the content's own bounding box — from the
// topmost photo edge to the bottommost — after subtracting nav height
// (64px, matching NavBar's current height) from each "top". Earlier this
// used the *bottom* edge as the container height with no adjustment for
// the top, which left a 60px gap baked into the container above the
// content but none below — centering the container then wasn't the same
// as centering the actual visible content. If NavBar's height changes
// again, these need to be recomputed (top/height denominators shift).
export const desktopCollageAspect = "1512 / 650";

// "depth" is a translateZ offset (px) used only by the desktop collage's
// scroll-linked rotateX effect (see HeroSection) — it gives each photo its
// own position in 3D space so they foreshorten at different rates as the
// group tilts, rather than the whole collage reading as one flat plane.
//
// IMPORTANT: depth must stay monotonic with z-index (higher z ⇒ depth must
// be >= the depth of everything below it in z-order). The collage uses
// transform-style: preserve-3d, so the browser sorts overlapping siblings
// by *actual* 3D depth, which can override CSS z-index outright. Wall
// critique (z:16, depth:40) and presentationRoom (z:21) briefly had
// presentationRoom's depth *below* wallCritique's (35 vs 40) — that
// contradiction made presentationRoom render behind wallCritique during
// scroll despite its higher z-index. Keep new depth values consistent
// with the z column below, especially for photos that spatially overlap.
export const desktopCollageLayout: CollagePhotoConfig[] = [
  // Background layers — intentionally covered for depth. z-order confirmed
  // by tracing which photo wins at each overlap in the Figma composition.
  {
    src: officeMeeting,
    alt: "",
    top: "68.923%",
    left: "44.643%",
    width: "11.111%",
    height: "23.231%",
    z: 3,
    depth: -55,
  },
  {
    src: aigKiosk,
    alt: "",
    top: "0.000%",
    left: "46.230%",
    width: "10.185%",
    height: "30.769%",
    z: 5,
    depth: -45,
  },
  {
    src: workshopTable,
    alt: "",
    top: "13.385%",
    left: "59.987%",
    width: "10.516%",
    height: "33.077%",
    z: 8,
    depth: -40,
  },
  // Visible photos
  {
    src: scadproGroup,
    alt: "Group photo in front of a screen reading Georgia International Convention Center and SCADpro",
    top: "21.846%",
    left: "23.743%",
    width: "24.868%",
    height: "38.923%",
    z: 12,
    depth: -38,
  },
  {
    src: lobbyWalk,
    alt: "Group walking through a glass-walled room overlooking the skyline",
    top: "42.462%",
    left: "29.167%",
    width: "11.574%",
    height: "34.308%",
    z: 15,
    depth: 50,
  },
  {
    src: wallCritique,
    alt: "Students reviewing pinned-up research boards on a gallery wall",
    top: "39.538%",
    left: "58.796%",
    width: "17.460%",
    height: "40.308%",
    z: 16,
    depth: 25,
  },
  {
    src: constructionSite,
    alt: "Group in hard hats reviewing plans on a construction site",
    top: "61.846%",
    left: "25.066%",
    width: "17.063%",
    height: "36.769%",
    z: 45,
    depth: 230,
  },
  {
    src: presentationRoom,
    alt: "Audience seated for a presentation in a lounge space",
    top: "76.769%",
    left: "57.738%",
    width: "12.169%",
    height: "23.231%",
    z: 21,
    depth: 75,
  },
  // Portrait — largest, centered, topmost
  {
    src: portrait,
    alt: "Portrait of Tina Le",
    top: "6.769%",
    left: "38.624%",
    width: "24.008%",
    height: "78.000%",
    z: 40,
    depth: 170,
    priority: true,
  },
];

// Simplified arrangement for narrow viewports: fewer overlapping layers,
// no hidden depth photos, sized to stay legible on small screens. Not
// sourced from Figma (no mobile design exists) — adapted per design intent,
// mobile reference (Screen Recording 2026-08-15 19-09-45, campione.framer.website)
// showed a tight, mostly-overlapping stack — a large center photo with
// smaller photos tucked mostly *behind* it, peeking out only at the
// corners — rather than spread across the full viewport with photos
// reaching the screen edges.
//
// Previous version's positions (left 2%–98%) were computed as if
// percentages resolved against the container's own *content* box (inside
// its px-6 padding), but CSS resolves an absolutely-positioned child's
// percentages against the containing block's *padding* box — so px-6
// never actually inset anything, and the cluster rendered edge-to-edge,
// overflowing past the visual padding entirely on real phones. Fixed at
// the container level (see HeroCollage.tsx): the mobile composition box
// itself is now a narrower, centered box (w-[78%] max-w-[300px] mx-auto,
// no padding) rather than a full-width box with padding — every percentage
// below is relative to that already-inset box, so there's no separate
// padding layer left to fight with.
export const mobileCollageAspect = "4 / 5";

// Re-measured directly off a gridded reference frame (frame_0_grid.jpg,
// 1170x2532 native, 50px grid) rather than eyeballed, per direct feedback
// that the first pass didn't match the reference's size/position — the
// first pass sized the portrait too small (56% width) and let the top two
// photos sit mostly *beside* the portrait rather than *behind* it, so they
// read as their own fully-visible photos instead of a peeking sliver.
//
// Reference composition bounding box measured at (35,335)-(855,1390) px
// (820x1055) — every ratio below is that photo's box as a % of this
// bounding box:
//   portrait   left 17.7% top 11.8% width 68.9% height 77.3% (dominant,
//     front-most in the reference too, but NOT frontmost of everything —
//     see z-order note below)
//   top-center photo (bottle): left 33.5% top 0% width 39.0% — entirely
//     within the portrait's own horizontal span (17.7%-86.6%), so it's
//     fully hidden behind the portrait except for a sliver at the very
//     top where the portrait hasn't started yet (top 0%-11.8%).
//   bottom-left photo (shirt): left 3.3% top 71.1% width 36.3% height
//     27.0% — DOES horizontally overlap the portrait's left edge, but
//     renders fully in front of it, not behind: the bottom two photos are
//     stacked above the portrait, covering its bottom corners, while the
//     top photo is stacked below it. Reproduced here with explicit z
//     values (30/31 for the bottom pair, 20 for the portrait, 10/11 for
//     the top pair) rather than relying on array order.
//   bottom-right photo (glass square): left 65.9% top 75.4% width 34.1%
//     height 24.6%.
//
// We only have 5 curated mobile photos (vs. the reference's 7-8), so the
// two "top" slots and two "bottom" slots here each stand in for one side
// of the reference's roughly-mirrored top/bottom pairs, sized and
// positioned to match those measured ratios rather than the reference's
// exact photo-by-photo layout.
export const mobileCollageLayout: CollagePhotoConfig[] = [
  {
    src: scadproGroup,
    alt: "Group photo in front of a screen reading Georgia International Convention Center and SCADpro",
    top: "0%",
    left: "20%",
    width: "34%",
    height: "26%",
    rotate: -5,
    z: 10,
  },
  {
    src: wallCritique,
    alt: "Students reviewing pinned-up research boards on a gallery wall",
    top: "0%",
    left: "50%",
    width: "34%",
    height: "28%",
    rotate: 4,
    z: 11,
  },
  {
    src: portrait,
    alt: "Portrait of Tina Le",
    top: "12%",
    left: "16%",
    width: "68%",
    height: "77%",
    z: 20,
    priority: true,
  },
  {
    src: constructionSite,
    alt: "Group in hard hats reviewing plans on a construction site",
    top: "68%",
    left: "0%",
    width: "40%",
    height: "30%",
    rotate: -5,
    z: 30,
  },
  {
    src: presentationRoom,
    alt: "Audience seated for a presentation in a lounge space",
    top: "70%",
    left: "60%",
    width: "36%",
    height: "28%",
    rotate: 4,
    z: 31,
  },
];
