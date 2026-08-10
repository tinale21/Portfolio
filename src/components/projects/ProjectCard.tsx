"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Project } from "./projects-data";

// Per the Work page's Figma prototype (motion reference video): hovering a
// card crossfades the bottom-left badge from "{name} · {year}" to a short
// description, with the pill's own width animating to fit — reverts on
// mouse-leave. `layout` on the pill handles the width animation; `AnimatePresence
// mode="popLayout"` takes the exiting text out of flow immediately so that
// resize isn't fighting the outgoing element's own space.
export function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const showDescription = hovered && project.description;

  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`View ${project.name} project`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
        className={`absolute bottom-2.5 left-2.5 flex h-[27px] items-center rounded-full bg-white px-3 ${
          project.bordered ? "border border-[#F4F4F5]" : ""
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {showDescription ? (
            <motion.span
              key="description"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="whitespace-nowrap text-xs font-semibold text-black"
            >
              {project.description}
            </motion.span>
          ) : (
            <motion.span
              key="name-year"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-1 whitespace-nowrap"
            >
              <span className="text-xs font-semibold text-black">{project.name}</span>
              <span className="text-xs font-semibold text-[#A1A1AA]">· {project.year}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </Link>
  );
}
