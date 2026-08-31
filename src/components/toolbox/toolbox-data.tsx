import { ReactNode } from "react";
import {
  CanvaGlyph,
  ClaudeIcon,
  FigmaIcon,
  FramerIcon,
  IllustratorGlyph,
  Microsoft365Icon,
  PhotoshopGlyph,
  PremiereProGlyph,
} from "./icons";

export type Tool = {
  name: string;
  background: string;
  icon: ReactNode;
  outline?: boolean;
};

export const TOOLS: Tool[] = [
  { name: "Figma", background: "#0D0D0D", icon: <FigmaIcon className="h-[18px] w-auto" /> },
  {
    name: "Framer",
    background: "linear-gradient(135deg, #4D9FFF 0%, #0055FF 100%)",
    icon: <FramerIcon className="h-[15px] w-[15px] text-white" />,
  },
  { name: "Claude", background: "#D97757", icon: <ClaudeIcon className="h-[18px] w-[18px] text-white" /> },
  { name: "Adobe Photoshop", background: "#001E36", icon: <PhotoshopGlyph /> },
  { name: "Adobe Illustrator", background: "#330000", icon: <IllustratorGlyph /> },
  { name: "Adobe Premiere Pro", background: "#00005B", icon: <PremiereProGlyph /> },
  {
    name: "Canva",
    background: "linear-gradient(135deg, #00C4CC 0%, #7D2AE8 55%, #7B61FF 100%)",
    icon: <CanvaGlyph />,
  },
  {
    name: "Microsoft 365",
    background: "#FFFFFF",
    icon: <Microsoft365Icon className="h-5 w-5" />,
    // White-on-white otherwise disappears against this section's own
    // background — see ToolIcon's own comment on the outline prop.
    outline: true,
  },
];
