import Image from "next/image";
import teamPhoto from "@/assets/case-studies/aig/team-photo.png";

// Figma dev-mode inspect (all values read directly):
// - Two equal-width columns (594/594, a 1:1 ratio) with a 187px gap
//   between them. Implemented as lg:flex-1 (fills the section's real
//   available width) rather than a literal lg:w-[594px] — a fixed 594px
//   column only happens to fill the space at exactly the 1512px Figma
//   reference width; on anything wider it left-aligns with a big empty
//   gap on the right instead of matching the hero video's own w-full
//   (fill-the-container) behavior directly above it.
// - Eyebrow labels ("Project Overview", "The Problem", "The Solution"):
//   Inter 16px/400, #707682, with a consistent 16px gap to the text
//   directly beneath them.
// - Left column's bold statement and the "Problem"/"Solution" bodies:
//   Inter 16px/500, #000.
// - Right column's 3 intro paragraphs: Inter 14px/500, #6E7681.
// - Gap between the "Problem" block and the "Solution" block: 51px.
// - Gap between the bold statement and "The Problem": 325px — measured
//   directly with Figma's ruler tool after an earlier guess (96px, since
//   this specific gap wasn't in the original dev-mode redlines) read as
//   too tight.
// - Gap between the right column's 3 paragraphs and the team photo below
//   them: 85px (also ruler-measured; an earlier guess of 32px was way
//   short), shifted down an additional 5px (to 90px) per direct feedback.
// - Gap between the hero video above this section and "Project Overview":
//   87px, owned by this section's own pt (see AigHero.tsx, which has no
//   bottom padding of its own for this specific reason).
// - Team photo: 597x301 (aspect ~1.983:1), rounded-[10px] — the exported
//   PNG itself has square corners ("corner rounding not applied yet" per
//   direct note), so the rounding has to be applied here in code.
//
// Both columns' body text are explicit arrays of lines, not wrapped
// strings — per direct feedback, which word falls on which line needs to
// match Figma exactly (this column's width doesn't necessarily wrap the
// same as Figma's at any given viewport), the same reasoning as the About
// page's traitLines/taglineLines/captionLines. The left column's bold
// statement and Problem/Solution bodies were originally left as plain
// wrapped text and drifted from Figma's actual breaks once checked
// (e.g. "navigation, and" wrapping together on one line here vs.
// "navigation," / "and visitor..." in Figma).
// Re-broken (words moved between lines, not shortened) after the column
// was widened, most recently to 605px — the widest it can go before this
// row starts overflowing the page at the 1512px reference width (tried
// 640px and 620px first; both pushed scrollWidth past clientWidth).
// These are the browser's own natural wrap at 605px, captured via
// screenshot and locked back in as hard breaks rather than left to wrap
// freely again.
const BOLD_STATEMENT_LINES = [
  "Designing an interactive kiosk experience to improve wayfinding, navigation, and visitor",
  "engagement at AIG's Atlanta Innovation Hub.",
];

const PROBLEM_LINES = [
  "AIG needed an intuitive way for visitors, employees, and partners to navigate its new",
  "Innovation Hub while showcasing the company's innovation and brand experience beyond",
  "traditional wayfinding.",
];

const SOLUTION_LINES = [
  "Our team designed an interactive digital concierge that combines wayfinding, accessibility",
  "features, and engaging content to help users confidently navigate the Innovation Hub",
  "while exploring AIG and the surrounding Atlanta community.",
];

// Unlike the other 4 blocks above, these are plain wrapped strings, not
// explicit line arrays — this column was widened to 650px (see lg:w-[650px]
// below) specifically so it no longer matches Figma's 594px reference,
// which is exactly why forcing Figma's own line breaks here started
// leaving visible gaps short of the right edge instead of filling it.
// Letting the browser wrap naturally is what makes each line actually
// stretch to the new width.
const PARAGRAPHS: string[] = [
  "This quarter, I worked on a client-based SCADpro project with AIG's Atlanta Innovation Hub to design an interactive kiosk experience focused on improving wayfinding, navigation, and visitor engagement.",
  "Working alongside a multidisciplinary team, I helped explore how employees, visitors, and partners could move through the space more confidently while also learning more about AIG and the surrounding Atlanta area. My role focused on developing user flows, creating high-fidelity interface screens, and designing clear wayfinding interactions for a large-scale 4K kiosk display.",
  "The final concept brought together building navigation, destination lookup, Explore ATL recommendations, AIG storytelling, and interactive engagement features into one cohesive experience. Through this project, I strengthened my ability to design for physical spaces, consider different user needs, and create digital tools that support clearer, more intuitive navigation.",
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

export function AigProjectOverview() {
  return (
    <section data-nav-theme="light" className="px-5 pt-[87px] pb-16 sm:px-8 lg:px-[68px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-[187px]">
        <div className="lg:w-[605px] lg:shrink-0">
          <Eyebrow>Project Overview</Eyebrow>
          <Body>
            <Lines lines={BOLD_STATEMENT_LINES} />
          </Body>

          {/* mt-[325px] is the desktop-tuned Figma gap (see comment above)
              — unconditional, it left a huge, inconsistent gap next to the
              51px Problem-to-Solution gap right below it on mobile's
              single-column stack. Per direct feedback ("make the project
              overview section and the problem section have the same
              spacing... as the spacing between the problem section and
              the solution section, for mobile only"), mobile now matches
              that same 51px; lg: restores the original desktop value. */}
          <div className="mt-[51px] lg:mt-[325px]">
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
              alt="The AIG x SCADpro team posing with the kiosk prototype in front of an AIG x SCADpro welcome screen"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
