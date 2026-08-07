import Link from "next/link";
import { Project } from "./projects-data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`View ${project.name} project`}
      className={`relative block aspect-[670/337] overflow-hidden rounded-[10px] ${
        project.bordered ? "border border-[#F4F4F5]" : ""
      }`}
    >
      <video
        src={project.videoSrc}
        poster={project.posterSrc}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
      <span
        className={`absolute bottom-2.5 left-2.5 flex h-[27px] items-center gap-1 rounded-full bg-white px-3 ${
          project.bordered ? "border border-[#F4F4F5]" : ""
        }`}
      >
        <span className="text-xs font-semibold text-black">{project.name}</span>
        <span className="text-xs font-semibold text-[#A1A1AA]">
          · {project.year}
        </span>
      </span>
    </Link>
  );
}
