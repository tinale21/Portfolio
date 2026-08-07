import { PROJECTS } from "./projects-data";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  return (
    <section
      data-nav-theme="light"
      className="bg-white px-5 pt-[45px] pb-10 sm:px-8 sm:pt-[61px] sm:pb-14 lg:px-[68px] lg:pt-[77px] lg:pb-16"
    >
      <h2 className="font-serif text-[26px] font-bold text-black">
        Selected projects, thoughtfully curated.
      </h2>
      <p className="mt-2 max-w-[746px] font-sans text-base font-extralight text-[#6D6B6B]">
        A small collection of work exploring clarity, care, and
        human-centered design.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-9 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
