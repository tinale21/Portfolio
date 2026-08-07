import { StaticImageData } from "next/image";
import aig from "@/assets/logos/aig.svg";
import delta from "@/assets/logos/delta.svg";
import gicc from "@/assets/logos/gicc.svg";
import ronaldMcDonaldHouse from "@/assets/logos/ronald-mcdonald-house.svg";
import zioraCopilot from "@/assets/logos/ziora-copilot.svg";

export type ClientLogo = {
  name: string;
  src: StaticImageData;
};

// Order and native sizing (each logo keeps its own intrinsic SVG
// dimensions rather than a uniform height) confirmed via Figma dev-mode
// inspect of the 5-logo row: combined width of the 5 logos (84+84+127+
// 218+252=765) plus 4 gaps of 116px each (464) equals the inspected row's
// total bounding width of 1229px exactly.
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "AIG", src: aig },
  { name: "Ronald McDonald House Atlanta", src: ronaldMcDonaldHouse },
  { name: "Georgia International Convention Center", src: gicc },
  { name: "Delta", src: delta },
  { name: "Ziora Copilot", src: zioraCopilot },
];
