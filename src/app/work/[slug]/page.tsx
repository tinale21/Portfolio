import { notFound } from "next/navigation";
import { PROJECTS } from "@/components/projects/projects-data";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
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
