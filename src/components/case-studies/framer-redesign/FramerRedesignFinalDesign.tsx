import { BASE_PATH } from "@/lib/base-path";
import { Lightbox } from "@/components/case-studies/Lightbox";

// Copy transcribed directly from the reference screenshot (source:
// Screenshot 2026-08-15 at 12.04.15 AM.png). Per direct instruction
// ("add the final design copy"), reuses AIG's/Emora's Final Design
// intro rule and spacing exactly (AigFinalDesignImplementation.tsx /
// EmoraFinalDesignImplementation.tsx): row title Inter 15px/400
// #707682, intro description Inter 15px/500 #000, right-column intro
// paragraphs 15px/500 #6E7681, 512px left column, 597px right column
// (ml-auto against the standard lg:px-[68px] padding), pt-44 top
// padding (later reduced per direct feedback — see below).
const INTRO = {
  description:
    "Our final redesign transforms Framer into a more approachable website builder that helps first-time users and designers build with confidence.",
  paragraphs: [
    "This project reimagines Framer's onboarding and editing experience for first-time users and designers transitioning from Figma.",
    "Guided by research and usability testing, the redesign introduces guided onboarding, contextual learning, real-time error checking, AI-powered design suggestions, and embedded resources that help users learn as they build. The result is a more approachable website-building experience with less friction and greater confidence.",
  ],
};

// Per direct instruction ("below the final design copy, I have a
// video of the prototype... use the one similar to the outline of the
// slider with the same thickness and corner rounding"), the prototype
// video reuses the Before & After Overview slider's exact bezel
// treatment (FramerRedesignBeforeAfter.tsx) — see that file's own
// comments for the full history, including why this moved off
// `aspect-ratio`/`box-sizing: content-box` entirely (a real-device
// screenshot showed a clearly asymmetric border in Safari — thick top,
// thin/cut bottom — that didn't reproduce in this session's own
// Chromium-based tooling) in favor of the older, browser-independent
// padding-percentage "responsive embed" technique. Per further direct
// feedback ("scale it down a bit so it's centered; it doesn't have to
// go from the right padding to the left padding"), also capped at the
// same 1148px total footprint (1100px content + 24px border × 2) the
// slider uses, rather than stretching to the section's full
// lg:px-[68px] content width.
//
// Video: source (Screen Recording 2026-07-22 at 10.34.12 PM.mov,
// 3456x1908, 2:03 long, no audio) is a full walkthrough of the
// interactive Framer prototype (onboarding tooltips, drag-to-stack
// interactions). Checked frames across the full runtime first to
// confirm no sensitive content — it's a clean product demo throughout.
// Initially trimmed to the first 40s to match this project's usual
// background-video loop-length convention, but per direct feedback
// ("don't trim the video down, keep it the full length"), kept the
// complete 2:03 recording instead — only scaled to 1800px wide,
// preserving the source's native aspect ratio (no crop needed).
const PROTOTYPE_BEZEL_COLOR = "#1D1D1D";
const PROTOTYPE_HEIGHT_PERCENT = (994 / 1800) * 100;

// Screen-by-screen breakdown rows, per direct instruction ("this part
// is formatted the same as the other case study like aig; use the
// same rules for this"). Structure, spacing, and typography are a
// direct reuse of AigFinalDesignImplementation.tsx's own SCREENS
// pattern: 512px left column (title #707682 15px/400, description
// black 15px/500), video capped at max-w-[597px] pushed to the right
// padding via ml-auto, 10px corner radius, object-cover, aspect-ratio
// 597/334 (AIG's own box ratio, close enough to this project's source
// ratio — same object-cover crop tolerance already accepted there).
// Copy transcribed directly from the reference screenshot (source:
// Screenshot 2026-08-15 at 1.40.27 AM.png).
//
// Motion reference (Screen Recording 2026-08-15 at 1.39.43 AM.mov)
// showed the same plain sequential scroll as AIG's — no zigzag, no
// scroll-tied progress, no tilt — so no special motion added here,
// matching AIG.
//
// Video processing: all 5 source recordings (Workspace.mp4,
// GuidedTutorials.mp4, ErrorChecking.mp4, Recommendations.mp4,
// CommunityAssets.mp4, all 3456x1908) scaled to 1600px wide with no
// crop, CRF 18, audio stripped (all 5 sources had an audio track,
// unlike this project's other videos — stripped per this project's
// standing convention of muted background/showcase video). Checked
// frames across each source's full runtime first to confirm no
// sensitive content.
const SCREENS = [
  {
    title: "Workspace",
    description:
      "The redesigned workspace creates a familiar starting point with a Figma-inspired layout, clearer navigation, and organized tools that help first-time users build with confidence.",
    video: "/projects/framer-redesign-fdi-workspace.mp4",
  },
  {
    title: "Guided Tutorial",
    description:
      "Interactive tutorials teach core Framer concepts through hands-on exercises, helping first-time users build confidence.",
    video: "/projects/framer-redesign-fdi-guided-tutorial.mp4",
  },
  {
    title: "Error Checking",
    description:
      "The redesigned error checker provides real-time feedback on accessibility, spelling, and grammar, helping users identify issues early and apply suggested fixes",
    video: "/projects/framer-redesign-fdi-error-checking.mp4",
  },
  {
    title: "Recommendations",
    description:
      "Smart recommendations appear based on the errors users encounter, surfacing relevant community assets, templates, and resources.",
    video: "/projects/framer-redesign-fdi-recommendations.mp4",
  },
  {
    title: "Community Assets",
    description:
      "The integrated community library makes it easy to discover and add reusable assets, templates, and components without leaving the editor",
    video: "/projects/framer-redesign-fdi-community-assets.mp4",
  },
];

export function FramerRedesignFinalDesign() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-16 pb-16 sm:px-8 lg:px-[68px] lg:pt-[122px]">
      <p className="font-sans text-base text-[#707682]">Final Design</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="lg:w-[512px] lg:shrink-0">
          <p className="font-sans text-[15px] font-medium text-black">{INTRO.description}</p>
        </div>
        <div className="flex flex-col gap-4 lg:ml-auto lg:w-[597px]">
          {INTRO.paragraphs.map((paragraph, i) => (
            <p key={i} className="font-sans text-[15px] font-medium text-[#6E7681]">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <Lightbox media={{ type: "video", src: `${BASE_PATH}/projects/framer-redesign-prototype.mp4` }}>
        <div
          // Per direct feedback, matches the thinner mobile bezel now used
          // on the Before & After Overview slider (10px vs desktop's
          // original 24px). Border-box sizing (the default) means
          // `w-full` alone already gives the correct total on-screen size
          // at any border width — see FramerRedesignBeforeAfter.tsx for
          // the full reasoning behind moving off aspect-ratio/content-box.
          className="relative mx-auto mt-24 w-full max-w-[1148px] touch-none overflow-hidden rounded-[12px] border-[10px] border-solid select-none lg:border-[24px]"
          style={{
            borderColor: PROTOTYPE_BEZEL_COLOR,
            backgroundColor: PROTOTYPE_BEZEL_COLOR,
          }}
        >
          <div style={{ paddingTop: `${PROTOTYPE_HEIGHT_PERCENT}%` }} />
          <video
            src={`${BASE_PATH}/projects/framer-redesign-prototype.mp4`}
            autoPlay
            loop
            muted
            playsInline
            // Per direct feedback, the video must never crop on mobile —
            // object-contain guarantees the full frame is always visible
            // (letterboxing into the bezel's own #1D1D1D background if
            // the frame and video aspect ratios ever drift apart, rather
            // than cutting off content) — kept desktop unchanged at
            // object-cover as before, matching "keep the black outline
            // the same thickness."
            className="absolute inset-0 h-full w-full object-contain lg:object-cover"
          />
        </div>
      </Lightbox>

      <div className="mt-32 flex flex-col gap-20">
        {SCREENS.map((screen) => (
          <div key={screen.title} className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="lg:w-[512px] lg:shrink-0">
              <p className="font-sans text-[15px] text-[#707682]">{screen.title}</p>
              <p className="mt-[16px] font-sans text-[15px] font-medium text-black">
                {screen.description}
              </p>
            </div>

            <Lightbox media={{ type: "video", src: `${BASE_PATH}${screen.video}` }}>
              <div
                className="relative w-full overflow-hidden rounded-[10px] border-solid lg:ml-auto lg:flex-1 lg:max-w-[597px]"
                style={{ aspectRatio: "597 / 334", borderWidth: "0.5px", borderColor: "#000000" }}
              >
                <video
                  src={`${BASE_PATH}${screen.video}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
            </Lightbox>
          </div>
        ))}
      </div>
    </section>
  );
}
