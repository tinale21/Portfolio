import { BASE_PATH } from "@/lib/base-path";
import { Lightbox } from "@/components/case-studies/Lightbox";

// Per direct instruction, reuses the exact text sizing/color, image
// sizing, and spacing rules already established for the AIG Project
// Overview section (AigProjectOverview.tsx) — same two-column
// structure (605px left / flex-1 right with a 650px-wide ml-auto inner
// block), same 187px column gap, same eyebrow (16px/400/#707682) and
// body (16px/500/#000 left column, 14px/500/#6E7681 right column)
// typography, same 325px statement-to-Problem gap, same 51px
// Problem-to-Solution gap, same 90px paragraphs-to-media gap, same
// 87px top padding.
//
// Left column line breaks transcribed directly from the reference
// screenshot (Screenshot 2026-08-14 at 10.39.09 AM.png). Right column
// paragraphs are plain wrapped strings, matching how AIG's/Wayve's/
// Emora's own right columns are handled once widened to 650px.
//
// The reference screenshot's right-column paragraphs originally showed
// AIG's own leftover placeholder copy (mentions "AIG's Atlanta
// Innovation Hub," "SCADpro," a "4K kiosk display" — clearly
// unrelated to this project). Flagged this directly rather than
// transcribing obviously-wrong text; the user then provided a
// corrected screenshot (Screenshot 2026-08-14 at 10.45.28 AM.png)
// with real Framer-specific copy, used here.
//
// Per direct instruction, the media slot uses AIG's own exact 597x301
// box (not re-measured from this reference) — but AIG's slot holds a
// static team photo, while this project's reference shows a short
// looping video (a Framer logo mark on black) in that same box. Kept
// the box's own CSS identical (597/301 aspect, rounded-[10px],
// lg:w-[650px]/ml-auto) and swapped <Image> for a <video>, matching
// this site's other hero/media video treatment (autoPlay/loop/muted/
// playsInline, object-cover). Source (Scene (7).mp4, 1920x1080, 3.4s,
// no audio) scaled to 1600px wide preserving native aspect — object-
// cover in the 597:301 (1.983:1) box crops slightly off the sides of
// the 16:9 (1.778:1) source, safe since the icon content is centered.
const BOLD_STATEMENT_LINES = [
  "Redesigning Framer to reduce onboarding friction by creating more familiar",
  "workflows, guided learning, and intelligent design assistance for first-time",
  "users transitioning from Figma.",
];

const PROBLEM_LINES = [
  "Framer is a powerful website builder, but many first-time users coming from",
  "Figma struggle with unfamiliar workflows, limited onboarding, and a lack of",
  "in-context guidance. These barriers make the platform more difficult to learn",
  "and adopt.",
];

const SOLUTION_LINES = [
  "The redesigned Framer experience introduces guided onboarding, contextual",
  "learning, real-time error checking, AI-powered design suggestions, and more",
  "familiar workflows to help users learn as they build. The result is a more",
  "intuitive website-building experience that reduces friction while preserving",
  "Framer's creative flexibility.",
];

const PARAGRAPHS: string[] = [
  "This project explored how Framer could become more approachable for designers transitioning from familiar tools like Figma. We focused on reducing the learning curve by introducing guided onboarding, contextual learning, real-time feedback, and intelligent design assistance that supports users directly within their workflow.",
  "Working through research, ideation, and prototyping, we explored how familiar patterns could make Framer's more complex features easier to understand while still preserving the flexibility that makes the platform powerful.",
  "The final concept brings these features together into a more supportive and intuitive experience for first-time users. By helping users learn through doing rather than relying on external tutorials, the redesigned experience aims to build confidence, reduce frustration, and make the transition from Figma to Framer feel more natural and approachable. Together, these improvements create a workflow that helps users feel more confident as they learn, experiment, and build.",
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

export function FramerRedesignProjectOverview() {
  return (
    <section data-nav-theme="light" className="px-5 pt-[87px] pb-16 sm:px-8 lg:px-[68px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-[187px]">
        <div className="lg:w-[605px] lg:shrink-0">
          <Eyebrow>Project Overview</Eyebrow>
          <Body>
            <Lines lines={BOLD_STATEMENT_LINES} />
          </Body>

          {/* mt-[312px] is the desktop-tuned Figma gap (see comment above)
              — per direct feedback ("make the project overview section
              and the problem section have the same spacing... as the
              spacing between the problem section and the solution
              section, for mobile only"), mobile now matches the 51px
              Problem-to-Solution gap right below; lg: restores the
              original desktop value. */}
          <div className="mt-[51px] lg:mt-[312px]">
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

          <Lightbox media={{ type: "video", src: `${BASE_PATH}/projects/framer-redesign-overview.mp4` }}>
            <div
              className="relative mt-[111px] w-full overflow-hidden rounded-[10px] lg:ml-auto lg:w-[650px]"
              style={{ aspectRatio: "597 / 301" }}
            >
              <video
                src={`${BASE_PATH}/projects/framer-redesign-overview.mp4`}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          </Lightbox>
        </div>
      </div>
    </section>
  );
}
