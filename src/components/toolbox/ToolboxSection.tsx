"use client";

import { motion } from "framer-motion";
import { ToolIcon } from "./ToolIcon";
import { TOOLS } from "./toolbox-data";

// Replaces the old "Trusted By" client-logo marquee (ClientLogosSection)
// per direct instruction. Icons sit inline next to the heading (not
// below it, and not an animated marquee like the section this replaces —
// 8 icons is few enough to just lay out in one row) and wrap onto a new
// line on narrow screens rather than overflowing horizontally.
//
// Top padding is deliberately NOT pt-12/14/16 even though that's the
// same rhythm Experiences uses to separate itself from Education — this
// section and ExperiencesSection are two separate <section>s, so their
// paddings stack (ExperiencesSection's own pb-10/14/16 + this section's
// pt) instead of collapsing into one shared margin the way the
// Experiences->Education gap does within a single section. Measured via
// Puppeteer: pt-12/14/16 here produced a 132px/... gap vs. the intended
// 48/56/64px. This section's pt is set to (target - Experiences' own pb)
// so the two paddings sum to the same 48/56/64px total gap.
export function ToolboxSection() {
  return (
    <section
      data-nav-theme="light"
      className="bg-white px-5 pt-2 pb-16 sm:px-8 sm:pt-0 sm:pb-20 lg:px-[68px] lg:pt-0 lg:pb-24"
    >
      <div className="flex flex-wrap items-center gap-4 sm:gap-5">
        <p className="shrink-0 font-serif text-[24px] font-bold text-black">My Toolbox:</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
            >
              <ToolIcon name={tool.name} background={tool.background} outline={tool.outline}>
                {tool.icon}
              </ToolIcon>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
