import Image from "next/image";
import teamPhoto from "@/assets/case-studies/wayve/team-photo.png";

// Per direct instruction, reuses the exact text sizing/color, image
// sizing, and spacing rules already established for the AIG Project
// Overview section (AigProjectOverview.tsx) — same two-column
// structure (605px left / flex-1 right with a 650px-wide ml-auto
// inner block), same 187px column gap, same eyebrow (16px/400/
// #707682) and body (16px/500/#000 left column, 14px/500/#6E7681
// right column) typography, same 51px Problem-to-Solution gap, same
// 90px paragraphs-to-photo gap, same 87px top padding (owned here
// since WayveHero also has no bottom padding of its own, mirroring
// AigHero). The statement-to-Problem gap started at AIG's same 325px
// but was bumped to 360px ("shift the Problem and Solution sections
// down a bit"), then to 365px ("...down by 5px") per direct feedback —
// increasing this one value moves both blocks down together as a unit,
// since Solution's own position is set relative to Problem (the 51px
// gap above), not to the statement directly.
// The left column's three text blocks are locked to explicit line
// breaks (not left to wrap naturally) — transcribed directly from the
// provided reference screenshot, which already reflects the actual
// rendered line breaks at this same 605px width, then verified via a
// rendered screenshot comparison rather than assumed correct. The
// right column's three paragraphs are left as plain wrapped strings,
// matching how AIG's own right column ended up once it was widened to
// 650px (past its Figma reference), rather than forcing a line-locked
// array that would no longer fill the width correctly.
//
// Team photo: provided export is 2388x1204 (aspect 1.983:1) — matches
// AIG's own team photo slot (597:301, same 1.983:1 ratio) exactly, so
// initially reused at the identical 597x301 display size with no
// cropping.
//
// Height was then adjusted twice (301 -> 260 "reduce it a bit", then
// -> 275 "increase it a little bit"), and width was briefly bumped
// past 650px ("increase the size of the image") but hit a real
// overflow ceiling almost immediately: 700px caused 48px of genuine
// page overflow (confirmed via scrollWidth vs clientWidth), and
// binary-searching down (670 -> 18px over, 655 -> 3px over) found the
// actual safe maximum at 652px — the same kind of fixed-width overflow
// ceiling AIG's own 605px left column hit, discovered the same way. A
// 652px photo against the paragraph block's 650px read as a mismatch
// once asked directly, so width reverted to exactly 650px (matching
// the paragraph, both via ml-auto). Then, per "make the image the same
// height it was before," the aspect-ratio itself reverted all the way
// back to the original 597/301 — undoing both height tweaks above, not
// just the most recent one — since 650px width unchanged meant the
// 275-ratio height (299px) was already showing, and "before" most
// plausibly meant before any height reduction happened at all.
// Object-cover on a taller box now shows more of the source photo's
// own vertical extent than the two shorter intermediate versions did.
const BOLD_STATEMENT_LINES = ["Designing the future of music engagement for Gen Z and Gen Alpha."];

const PROBLEM_LINES = [
  "Gen Z and Gen Alpha consume more music than ever, but passive listening",
  "and algorithm-driven discovery have weakened the connection between",
  "artists and fans.",
];

const SOLUTION_LINES = [
  "Wayve transforms passive listening into an interactive experience by",
  "combining personalized discovery, social engagement, and meaningful artist",
  "connections in one platform.",
];

const PARAGRAPHS: string[] = [
  "This SCADpro industry collaboration challenged our multidisciplinary team to explore how the music industry could create more meaningful experiences for younger audiences and drive long-term engagement.",
  "Through surveys, interviews, affinity mapping, concept development, and iterative prototyping, we identified opportunities to transform passive listening into more active, memorable experiences. My role focused on UX research, concept development, interaction design, and prototyping while collaborating closely with designers, researchers, and developers throughout the project.",
  "The project culminated in Wayve, an interactive music platform that combines social connection, immersive experiences, and personalized engagement to help artists build deeper relationships with their communities. Working on this project strengthened my ability to translate research into product strategy, collaborate across disciplines, and design experiences that balance user needs with business goals.",
];

function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-sans text-base text-[#707682]">{children}</p>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 font-sans text-sm font-medium text-black">{children}</p>;
}

export function WayveProjectOverview() {
  return (
    <section data-nav-theme="light" className="px-5 pt-[87px] pb-16 sm:px-8 lg:px-[68px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-[187px]">
        <div className="lg:w-[605px] lg:shrink-0">
          <Eyebrow>Project Overview</Eyebrow>
          <Body>
            <Lines lines={BOLD_STATEMENT_LINES} />
          </Body>

          <div className="mt-[365px]">
            <Eyebrow>The Problem</Eyebrow>
            <Body>
              <Lines lines={PROBLEM_LINES} />
            </Body>
          </div>

          <div className="mt-[51px]">
            <Eyebrow>The Solution</Eyebrow>
            <Body>
              <Lines lines={SOLUTION_LINES} />
            </Body>
          </div>
        </div>

        <div className="lg:flex-1">
          <div className="flex flex-col gap-4 lg:ml-auto lg:w-[650px]">
            {PARAGRAPHS.map((paragraph, i) => (
              <p key={i} className="font-sans text-sm font-medium text-[#6E7681]">
                {paragraph}
              </p>
            ))}
          </div>

          <div
            className="relative mt-[90px] w-full overflow-hidden rounded-[10px] lg:ml-auto lg:w-[650px]"
            style={{ aspectRatio: "597 / 301" }}
          >
            <Image
              src={teamPhoto}
              alt="The Wayve team in a meeting room watching a video call, with the Wayve logo displayed on a second screen"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
