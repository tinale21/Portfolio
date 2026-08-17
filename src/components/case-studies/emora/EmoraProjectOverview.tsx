import Image from "next/image";
import { Lightbox } from "@/components/case-studies/Lightbox";
import overviewIllustration from "@/assets/case-studies/emora/overview-illustration.png";

// Per direct instruction, reuses the exact text sizing/color, image
// sizing, and spacing rules already established for the AIG Project
// Overview section (AigProjectOverview.tsx) — same two-column structure
// (605px left / flex-1 right with a 650px-wide ml-auto inner block),
// same 187px column gap, same eyebrow (16px/400/#707682) and body
// (16px/500/#000 left column, 14px/500/#6E7681 right column)
// typography, same 325px statement-to-Problem gap, same 51px
// Problem-to-Solution gap, same 90px paragraphs-to-image gap, same
// 87px top padding (owned here since EmoraHero also has no bottom
// padding of its own, mirroring AigHero/WayveHero).
//
// The left column's three text blocks are locked to explicit line
// breaks transcribed directly from the provided reference screenshot
// (Screenshot 2026-08-13 at 6.40.50 PM.png), matching the same
// "explicit line array, not wrapped string" approach AIG's own left
// column uses. The right column's three paragraphs are left as plain
// wrapped strings, same as AIG's and Wayve's own right columns once
// widened past their Figma reference to 650px.
//
// Overview illustration (Rectangle 133.png, provided directly): 2388x1204
// (aspect 1.983:1) — matches AIG/Wayve's own team-photo slot (597:301,
// same 1.983:1 ratio) exactly, so it drops into the identical 650px-wide
// image box with no new aspect-ratio math needed. Unlike AIG/Wayve's
// team photos, this is a self-contained illustration (scattered app-icon
// collage + the "Emora" wordmark + a caption line, "Emora combines
// wearables and apps to build emotional clarity and confidence.", all
// baked into the asset itself in its own brand font) rather than a plain
// photograph, so it's used as-is instead of recreating that caption as
// separate live text — reproducing its exact custom lettering with the
// site's own Inter stack would drift from the reference, whereas the
// image is already pixel-accurate. Confirmed opaque (no real
// transparency — alpha channel is flat 255) so object-cover behaves
// exactly like the team-photo case.
const BOLD_STATEMENT_LINES = [
  "Designing an AI-powered wearable ecosystem that helps children with",
  "autism recognize emotions, build confidence, and strengthen everyday social",
  "interactions.",
];

const PROBLEM_LINES = [
  "Children with autism can find it difficult to understand emotional cues in real",
  "time, making social interactions overwhelming and limiting opportunities to",
  "build confidence and meaningful connections.",
];

const SOLUTION_LINES = [
  "Emora is an AI-powered wearable ecosystem that combines smart glasses, a",
  "haptic bracelet, and companion apps to help children recognize emotions,",
  "practice social skills, and give parents insights that support long-term",
  "emotional growth.",
];

const PARAGRAPHS: string[] = [
  "This quarter, I worked on Emora, a concept developed for the SCAD Startup 2026 design sprint that explores how AI can support children with autism in understanding emotions during everyday social interactions. In just two weeks, our team designed a connected ecosystem that combines AI-powered smart glasses, a haptic bracelet, a children's learning app, and a parent companion app to provide real-time emotional guidance while reinforcing long-term learning.",
  "Grounded in user research and accessibility, the project focused on creating technology that feels supportive rather than distracting. Every part of the ecosystem was designed to encourage natural social interactions, reduce sensory overload, and provide meaningful insights for caregivers.",
  "Through Emora, we explored how wearable technology and companion applications can work together to create a more inclusive and empathetic approach to emotional learning.",
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

export function EmoraProjectOverview() {
  return (
    <section data-nav-theme="light" className="px-5 pt-[87px] pb-16 sm:px-8 lg:px-[68px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-[187px]">
        <div className="lg:w-[605px] lg:shrink-0">
          <Eyebrow>Project Overview</Eyebrow>
          <Body>
            <Lines lines={BOLD_STATEMENT_LINES} />
          </Body>

          {/* mt-[321px] is the desktop-tuned Figma gap (see comment above)
              — per direct feedback ("make the project overview section
              and the problem section have the same spacing... as the
              spacing between the problem section and the solution
              section, for mobile only"), mobile now matches the 51px
              Problem-to-Solution gap right below; lg: restores the
              original desktop value. */}
          <div className="mt-[51px] lg:mt-[321px]">
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

          <Lightbox
            media={{
              type: "image",
              src: overviewIllustration,
              alt: "Illustration of the Emora ecosystem: a collage of emotion-face app icons around the Emora wordmark, captioned 'Emora combines wearables and apps to build emotional clarity and confidence.'",
            }}
          >
            <div
              className="relative mt-[100px] w-full overflow-hidden rounded-[10px] lg:ml-auto lg:w-[650px]"
              style={{ aspectRatio: "597 / 301" }}
            >
              <Image
                src={overviewIllustration}
                alt="Illustration of the Emora ecosystem: a collage of emotion-face app icons around the Emora wordmark, captioned 'Emora combines wearables and apps to build emotional clarity and confidence.'"
                fill
                className="object-cover"
              />
            </div>
          </Lightbox>
        </div>
      </div>
    </section>
  );
}
