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

// Sourced from an actual Figma mobile frame this time (iPhone 16, 393x852pt)
// the user built and inspected directly — not adapted/eyeballed like the
// two earlier passes. Per direct feedback ("on mobile i can only see 5
// images instead of all 9"), the Figma frame uses all 9 of the same
// photos desktopCollageLayout uses, not the smaller 5-photo curated subset
// the previous two mobile passes used — so this replaces that subset
// entirely rather than just repositioning it.
//
// Every box below was read directly from Figma's Inspect panel (per-layer
// "Layout" width/height + the 4-directional distance-to-frame-edge
// callouts), not estimated from a screenshot: each layer's callouts
// (top/left/right/bottom distance to the 393x852 frame edges) were cross-
// checked to confirm left+width+right=393 and top+height+bottom=852 for
// every one of the 9 rectangles before converting to %.
//
//   photo             left(px) top(px) width(px) height(px)
//   portrait             81     243      244        342
//   scadproGroup          22     353      240        163
//   workshopTable        137     191      142        184
//   wallCritique         186     395      160        158
//   lobbyWalk             37     435       77         98
//   aigKiosk             266     283      105        142
//   officeMeeting        160     543       87         79
//   constructionSite      32     510      134        123
//   presentationRoom     235     543      135        100
//
// Percentages below are each value / 393 (width) or / 852 (height) — same
// two-axis-independent-% approach as desktopCollageLayout, so the
// composition box just needs the same 393/852 aspect ratio for these to
// render at the exact measured proportions regardless of actual viewport
// size. The frame's own margins are already baked into the coordinates
// (leftmost edge sits at 22px/393 ≈ 5.6%, rightmost at 371px/393 ≈ 94.4%,
// a symmetric ~22px gutter each side) — so unlike the previous two mobile
// passes, this container needs no extra width-shrinking or padding of its
// own to center the composition; it can run the container at its natural
// full width (see HeroCollage.tsx) and the gutters fall out of the data.
//
// z-index: the two bottom photos (constructionSite, presentationRoom)
// render fully legible in the reference despite overlapping the portrait's
// bottom corners, so they're given higher z than the portrait (in front of
// it) — everything else sits behind the portrait, peeking only where the
// portrait's own box doesn't reach. No rotation on any of the 9 — the
// reference frame's edges all read axis-aligned, unlike the earlier
// hand-designed passes which added rotation for a "candid stack" feel.
export const mobileCollageAspect = "393 / 852";

export const mobileCollageLayout: CollagePhotoConfig[] = [
  {
    src: officeMeeting,
    alt: "",
    top: "63.732%",
    left: "40.712%",
    width: "22.137%",
    height: "9.272%",
    z: 1,
  },
  {
    src: aigKiosk,
    alt: "",
    top: "33.216%",
    left: "67.684%",
    width: "26.718%",
    height: "16.667%",
    z: 2,
  },
  {
    src: workshopTable,
    alt: "",
    top: "22.418%",
    left: "34.860%",
    width: "36.132%",
    height: "21.596%",
    z: 3,
  },
  {
    src: lobbyWalk,
    alt: "Group walking through a glass-walled room overlooking the skyline",
    top: "51.056%",
    left: "9.415%",
    width: "19.593%",
    height: "11.502%",
    z: 4,
  },
  {
    src: scadproGroup,
    alt: "Group photo in front of a screen reading Georgia International Convention Center and SCADpro",
    top: "41.432%",
    left: "5.598%",
    width: "61.069%",
    height: "19.131%",
    z: 5,
  },
  {
    src: wallCritique,
    alt: "Students reviewing pinned-up research boards on a gallery wall",
    top: "46.362%",
    left: "47.328%",
    width: "40.712%",
    height: "18.545%",
    z: 6,
  },
  {
    src: portrait,
    alt: "Portrait of Tina Le",
    top: "28.521%",
    left: "20.611%",
    width: "62.087%",
    height: "40.141%",
    z: 20,
    priority: true,
  },
  {
    src: presentationRoom,
    alt: "Audience seated for a presentation in a lounge space",
    top: "63.732%",
    left: "59.796%",
    width: "34.351%",
    height: "11.737%",
    z: 30,
  },
  {
    src: constructionSite,
    alt: "Group in hard hats reviewing plans on a construction site",
    top: "59.859%",
    left: "8.142%",
    width: "34.096%",
    height: "14.437%",
    z: 31,
  },
];
