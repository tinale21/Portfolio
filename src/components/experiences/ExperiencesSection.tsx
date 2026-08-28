"use client";

import { useEffect, useState } from "react";
import { getConnectExitTiming } from "@/components/connect/connect-data";
import { EDUCATION } from "./education-data";
import { EXPERIENCES } from "./experiences-data";
import { ExperienceRow } from "./ExperienceRow";

export function ExperiencesSection() {
  // Pulled up to overlap Connect's tail end so this section's opaque white
  // background visibly sweeps up and covers Connect's centered heading
  // while it's still perfectly stationary (pinned), rather than the
  // heading exiting on its own first and this section simply arriving
  // afterward into empty dark space. The needed pull depends on the
  // actual viewport height (a shorter browser window moves Connect's
  // now-truly-centered heading, changing how far this has to reach) — see
  // getConnectExitTiming in connect-data.ts for the derivation. A fixed
  // px value here broke the moment Connect's heading centering was fixed
  // to track the real viewport instead of its aspect-ratio box.
  //
  // Ceiling on this number: getConnectExitTiming caps it below this
  // section's own natural content height (measured at 780px). A negative
  // top margin shifts every *later* sibling up by the same amount too
  // (Client Logos, the Footer) — as long as this section's own height
  // exceeds the pull, its natural bottom edge still lands at/after
  // Connect's true end, so nothing after it bleeds into Connect's
  // still-active wrapper. An earlier fixed value (-1450px) overshot this,
  // and Client Logos ended up rendering inside Connect's dark section
  // instead of after it.
  const [pull, setPull] = useState(600);

  useEffect(() => {
    function update() {
      setPull(getConnectExitTiming(window.innerWidth, window.innerHeight).pull);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section
      data-nav-theme="light"
      style={{ marginTop: `-${pull}px` }}
      className="relative bg-white px-5 pt-[45px] pb-10 sm:px-8 sm:pt-[61px] sm:pb-14 lg:px-[68px] lg:pt-[77px] lg:pb-16"
    >
      {/* Education renders inside this same pulled <section> — rather than
          as its own top-level section in page.tsx, which is where it
          conceptually belongs — because the negative margin-top above only
          has this element's own natural content height to safely absorb
          before it starts dragging whatever comes *after* it up into
          Connect's still-dark pinned area (see getConnectExitTiming's
          comment on the 750px pull cap vs. "this section's own ~780px
          height"). A standalone one-row Education section would be far
          shorter than the pull's own 300px minimum, guaranteeing that
          overshoot; keeping it combined with Experiences means the section
          directly after Connect stays tall enough regardless. */}
      <h2 className="font-serif text-[26px] font-bold text-black">Education</h2>

      <div className="mt-4">
        {EDUCATION.map((entry, i) => (
          <div key={i} className={i > 0 ? "border-t border-[#E5E5E5]" : undefined}>
            <ExperienceRow {...entry} />
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-serif text-[26px] font-bold text-black sm:mt-14 lg:mt-16">Experiences</h2>

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
