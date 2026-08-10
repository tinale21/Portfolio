import Image from "next/image";
import { NdaProject } from "./nda-projects-data";

// Not a Link, unlike ProjectCard — per the prototype, NDA projects have no
// video and no case study to click into, just a locked placeholder card.
//
// Figma dev-mode inspect: the "disabled" look is a plain black fill at 59%
// opacity layered directly over the image (not a CSS filter/grayscale) —
// reproduced here as a solid black div on top of the image at that same
// opacity.
export function NdaProjectCard({ project }: { project: NdaProject }) {
  return (
    <div
      aria-label={`${project.name} — under NDA, case study unavailable`}
      className="relative flex aspect-[670/337] items-center justify-center overflow-hidden rounded-[10px]"
    >
      <Image src={project.bg} alt={project.alt} fill className="object-cover" />
      <div className="absolute inset-0 bg-black opacity-[0.59]" />

      <span className="relative flex h-[34px] items-center gap-2 rounded-full bg-white/10 px-4 text-white backdrop-blur-sm">
        <svg
          width="15"
          height="15"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="2" y="5.5" width="8" height="5.5" rx="1" fill="currentColor" />
          <path
            d="M3.5 5.5V3.75A2.5 2.5 0 0 1 6 1.25a2.5 2.5 0 0 1 2.5 2.5V5.5"
            stroke="currentColor"
            strokeWidth="1.15"
            fill="none"
          />
        </svg>
        <span className="text-sm font-semibold">NDA</span>
      </span>

      <span className="absolute bottom-2.5 left-2.5 flex h-[27px] items-center gap-1 rounded-full bg-white px-3">
        <span className="text-xs font-semibold text-black">{project.name}</span>
        <span className="text-xs font-semibold text-[#A1A1AA]">· {project.year}</span>
      </span>
    </div>
  );
}
