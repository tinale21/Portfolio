import { EDUCATION } from "./education-data";
import { EXPERIENCES } from "./experiences-data";
import { ExperienceRow } from "./ExperienceRow";

// Moved to the About page (before the mission quote) per direct instruction.
// Previously this sat right after the home page's Connect section and used a
// viewport-derived negative margin-top (getConnectExitTiming's `pull`) to
// sweep its white background up over Connect's pinned heading. There's no
// Connect section on the About page, so that pull was removed and this is now
// a plain section in normal flow. Education still renders inside this same
// section (Experiences heading then Education heading) as before.
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

      <h2 className="mt-12 font-serif text-[26px] font-bold text-black sm:mt-14 lg:mt-16">Education</h2>

      <div className="mt-4">
        {EDUCATION.map((entry, i) => (
          <div key={i} className={i > 0 ? "border-t border-[#E5E5E5]" : undefined}>
            <ExperienceRow {...entry} />
          </div>
        ))}
      </div>
    </section>
  );
}
