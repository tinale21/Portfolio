import { notFound } from "next/navigation";
import { PROJECTS } from "@/components/projects/projects-data";

// AIG, Wayve, and Emora have "graduated" to their own dedicated routes
// (src/app/work/aig/, src/app/work/wayve/, src/app/work/emora/) now
// that they have real bespoke content — excluded here so those routes
// don't collide with this one. The rest fall back to this generic
// placeholder until they get the same treatment.
const GRADUATED_SLUGS = ["aig", "wayve", "emora"];

export function generateStaticParams() {
  return PROJECTS.filter((project) => !GRADUATED_SLUGS.includes(project.slug)).map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main data-nav-theme="light" className="px-5 py-24 sm:px-8 lg:px-[68px]">
      <h1 className="font-serif text-4xl text-black">{project.name}</h1>
      <p className="mt-2 text-[#6D6B6B]">
        {project.year} — project page coming soon.
      </p>
    </main>
  );
}
