export type Project = {
  slug: string;
  name: string;
  year: string;
  videoSrc: string;
  posterSrc: string;
  // Figma dev-mode inspect: every card and badge is borderless except
  // Emora's — its video's own background is white, which would otherwise
  // be indistinguishable from both the section's white background and its
  // own white badge.
  bordered?: boolean;
  // Shown in the bottom-left badge on hover, swapping out "{name} · {year}"
  // — per the Work page motion reference video. Optional so a card without
  // copy yet just skips the hover swap instead of showing an empty bubble.
  description?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "aig",
    name: "AIG",
    year: "2025",
    videoSrc: "/projects/aig.mp4",
    posterSrc: "/projects/aig-poster.jpg",
    description: "Designing an interactive kiosk experience for AIG.",
  },
  {
    slug: "wayve",
    name: "Wayve",
    year: "2026",
    videoSrc: "/projects/wayve.mp4",
    posterSrc: "/projects/wayve-poster.jpg",
    description: "Reimagining music discovery through play and creativity.",
  },
  {
    slug: "emora",
    name: "Emora",
    year: "2026",
    videoSrc: "/projects/emora.mp4",
    posterSrc: "/projects/emora-poster.jpg",
    bordered: true,
    description: "Supporting emotional expression through wearable technology.",
  },
  {
    slug: "framer-redesign",
    name: "Framer Redesign",
    year: "2026",
    videoSrc: "/projects/framer-redesign.mp4",
    posterSrc: "/projects/framer-redesign-poster.jpg",
    description: "Simplifying Framer's onboarding for new creators.",
  },
];
