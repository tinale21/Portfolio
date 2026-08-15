import { BASE_PATH } from "@/lib/base-path";

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
// treatment (FramerRedesignBeforeAfter.tsx): #1D1D1D border, 24px
// thick, rounded-[12px] corners, and the same box-sizing: content-box
// fix so the border sits uniformly outside a content area sized to
// the video's own exact aspect ratio rather than being folded into
// it. Per further direct feedback ("scale it down a bit so it's
// centered; it doesn't have to go from the right padding to the left
// padding"), also capped at the same 1100px max-width/mx-auto the
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
const PROTOTYPE_BORDER_WIDTH = 24;
const PROTOTYPE_BEZEL_COLOR = "#1D1D1D";
const PROTOTYPE_ASPECT = "1800 / 994";
const PROTOTYPE_MAX_WIDTH = 1100;

export function FramerRedesignFinalDesign() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-[122px] pb-16 sm:px-8 lg:px-[68px]">
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

      <div
        className="relative mx-auto mt-24 w-full touch-none overflow-hidden rounded-[12px] border-solid select-none"
        style={{
          maxWidth: PROTOTYPE_MAX_WIDTH,
          aspectRatio: PROTOTYPE_ASPECT,
          borderColor: PROTOTYPE_BEZEL_COLOR,
          backgroundColor: PROTOTYPE_BEZEL_COLOR,
          borderWidth: PROTOTYPE_BORDER_WIDTH,
          boxSizing: "content-box",
        }}
      >
        <video
          src={`${BASE_PATH}/projects/framer-redesign-prototype.mp4`}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
