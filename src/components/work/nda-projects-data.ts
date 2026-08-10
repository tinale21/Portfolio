import { StaticImageData } from "next/image";
import deltaBg from "@/assets/work/delta-bg.png";
import giccBg from "@/assets/work/gicc-bg.png";

export type NdaProject = {
  name: string;
  year: string;
  bg: StaticImageData;
  alt: string;
  // Shown in the badge on hover, same swap mechanic as ProjectCard's
  // description — since there's no case study to link to, this just
  // points people at reaching out directly.
  description: string;
};

const NDA_DESCRIPTION = "Email me to learn more!";

export const NDA_PROJECTS: NdaProject[] = [
  { name: "Delta", year: "2026", bg: deltaBg, alt: "", description: NDA_DESCRIPTION },
  { name: "GICC", year: "2026", bg: giccBg, alt: "", description: NDA_DESCRIPTION },
];
