import { PROJECTS } from "./projects-data";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  return (
    <section
      data-nav-theme="light"
      className="bg-white px-5 py-10 sm:px-8 sm:py-14 lg:px-[68px] lg:py-16"
    >
      <h2 className="font-serif text-[36px] text-black">
        Selected projects, <em className="italic">thoughtfully</em> curated.
      </h2>
      <p className="mt-2 max-w-[746px] font-sans text-xl font-extralight text-[#6D6B6B]">
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
