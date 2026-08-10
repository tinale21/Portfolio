import { StaticImageData } from "next/image";
import deltaBg from "@/assets/work/delta-bg.png";
import giccBg from "@/assets/work/gicc-bg.png";

export type NdaProject = {
  name: string;
  year: string;
  bg: StaticImageData;
  alt: string;
};

export const NDA_PROJECTS: NdaProject[] = [
  { name: "Delta", year: "2026", bg: deltaBg, alt: "" },
  { name: "GICC", year: "2026", bg: giccBg, alt: "" },
];
