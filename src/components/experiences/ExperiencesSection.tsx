import { EXPERIENCES } from "./experiences-data";
import { ExperienceRow } from "./ExperienceRow";

export function ExperiencesSection() {
  return (
    <section
      data-nav-theme="light"
      className="bg-white px-5 pt-[45px] pb-10 sm:px-8 sm:pt-[61px] sm:pb-14 lg:px-[68px] lg:pt-[77px] lg:pb-16"
    >
      <h2 className="font-serif text-[26px] font-bold text-black">Experiences</h2>

      <div className="mt-4">
        {EXPERIENCES.map((experience, i) => (
          <div key={i} className={i > 0 ? "border-t border-[#E5E5E5]" : undefined}>
            <ExperienceRow {...experience} />
          </div>
        ))}
      </div>
    </section>
  );
}
