import {
  ABOUT_ENTRIES,
  MISSION_QUOTE,
  MISSION_QUOTE_CLOSE,
  MISSION_QUOTE_OPEN,
} from "./about-data";
import { AboutEntry } from "./AboutEntry";

export function AboutSection() {
  return (
    <>
      {ABOUT_ENTRIES.map((entry) => (
        <AboutEntry key={entry.traitLines.join(" ")} {...entry} />
      ))}

      <section
        data-nav-theme="light"
        className="flex min-h-[60vh] items-center justify-center bg-white px-5 pt-24 pb-72 sm:px-8 lg:px-[68px]"
      >
        <p
          className="max-w-[720px] text-center font-serif text-black italic"
          style={{ fontSize: "clamp(1.2rem, 1.6vw, 1.6rem)", fontWeight: 700 }}
        >
          <span style={{ marginLeft: "-0.45em" }}>{MISSION_QUOTE_OPEN}</span>
          {MISSION_QUOTE}
          <span style={{ marginRight: "-0.45em" }}>{MISSION_QUOTE_CLOSE}</span>
        </p>
      </section>
    </>
  );
}
