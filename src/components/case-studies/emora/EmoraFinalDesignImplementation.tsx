import { BASE_PATH } from "@/lib/base-path";

// Structure and copy transcribed directly from the composite reference
// screenshot (source: Screenshot 2026-08-13 at 10.42.24 PM.png). Per
// direct instruction, reuses AIG's Final Design Implementation text
// rule and spacing exactly (AigFinalDesignImplementation.tsx): row
// title Inter 15px/400 #707682, row/intro description Inter 15px/500
// #000, right-column intro paragraphs 15px/500 #6E7681, 512px left
// column, videos ml-auto against the standard lg:px-[68px] padding,
// 10px corner radius, section stretched full-width, pt-44 top padding.
//
// Per direct instruction, the video sizing itself is NOT reused from
// AIG (whose 597x334, 1.7888:1 box matched its own 3456x1932 source
// recordings) — Emora's reference box reads as a visibly shorter/
// stockier ratio. Measured directly (not eyeballed) from two
// independent sources that agreed closely: (1) the provided motion
// reference recording's own rendered "Emora Glasses + Bracelet"
// placeholder box, and (2) the static reference screenshot's own empty
// placeholder box for the same row — both came out to ~1.51-1.52:1
// (795x527 and 557x368 respectively, in their own captured-pixel
// spaces). Kept AIG's established 597px width (per "same spacing rule
// as AIG" for everything not explicitly called out as different) and
// initially set the height to 394px (597/394 = 1.515), matching the
// measured ratio. Per direct feedback ("the tablet frame is cut off
// on the bottom and top"), increased to 455px (597/455 = 1.312) — much
// closer to the cropped tablet video's own ~1.313:1 aspect, so
// object-cover shows the full bezel top-to-bottom with virtually no
// crop. The other two videos crop a bit more as a result, which is an
// acceptable tradeoff since they're plain product renders with
// generous background margin, not a device frame that reads as
// "broken" when clipped.
//
// Video processing:
// - Glasses + Bracelet (Emora Glasses and Bracelet.mp4, 1772x1080) and
//   Companion App (Scene (5).mp4, 1440x1080) are both plain product-
//   render videos with no on-screen device chrome — scaled to 1600px
//   wide preserving native aspect, audio stripped (only the Glasses +
//   Bracelet source had any).
// - Emora for Kids (Screen Recording 2026-07-29 at 11.53.30 AM.mov,
//   2274x1768) is a screen recording of an iPad mockup sitting on a
//   plain light-blue background — per direct instruction ("crop and
//   corner round this video so it is just the tablet with no extra
//   blue outline"), the surrounding background is removed at the
//   source rather than relying on the box's own object-cover crop:
//   found the tablet bezel's exact pixel bounds (color-threshold scan
//   for near-black bezel pixels against the light background) and
//   cropped to that box with a 20px inward safety margin to guarantee
//   no blue fringe survives anti-aliasing at the bezel edge, before
//   the same 1600px scale-down. The tablet's own native crop aspect
//   (~1.31:1) doesn't exactly match the shared 597:394 (1.515:1) box,
//   so object-cover still trims a small amount off the top/bottom of
//   the bezel to fill the wider box — an acceptable tradeoff given the
//   explicit ask was "same size as the other two videos," not "show
//   the whole tablet unclipped." Source recording was 74s long (a full
//   app walkthrough) — trimmed to the first 15s (splash screen through
//   the "Lesson 1: Learning Emotions" screen) to match this project's
//   established ~10-17s loop-length convention for these background
//   videos, rather than shipping the full unedited walkthrough.
const INTRO = {
  description:
    "Our final solution combines AI-powered wearables and companion apps into one connected ecosystem that supports children's emotional learning before, during, and after everyday social interactions.",
  paragraphs: [
    "Emora brings together AI-powered smart glasses, a haptic bracelet, a children's learning app, and a parent companion app into one seamless experience. Each product addresses a different stage of emotional learning while working together to provide consistent, real-time support.",
    "By combining subtle wearable guidance with guided practice and caregiver insights, the final concept encourages natural social interactions while helping children build confidence and supporting parents throughout their child's emotional development.",
  ],
};

const SCREENS = [
  {
    title: "Emora for Kids",
    description:
      "The Emora app teaches emotional recognition through guided practice and interactive scenarios. Children learn how to identify emotions and understand the color cues used throughout the Emora ecosystem.",
    video: "/projects/emora-fdi-kids.mp4",
  },
  {
    title: "Emora Glasses + Bracelet",
    description:
      "The AI-powered smart glasses detect facial expressions and emotional cues in real time. Instead of interrupting conversations, the bracelet provides children with subtle haptic guidance during social interactions.",
    video: "/projects/emora-fdi-glasses-bracelet.mp4",
  },
  {
    title: "Emora Companion App",
    description:
      "The parent companion app helps caregivers identify emotional triggers, track their child's progress over time, and better understand their emotional needs through meaningful insights.",
    video: "/projects/emora-fdi-companion-app.mp4",
  },
];

export function EmoraFinalDesignImplementation() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-44 pb-16 sm:px-8 lg:px-[68px]">
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

      <div className="mt-20 flex flex-col gap-20">
        {SCREENS.map((screen) => (
          <div key={screen.title} className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="lg:relative lg:top-[-4px] lg:w-[512px] lg:shrink-0">
              <p className="font-sans text-[15px] text-[#707682]">{screen.title}</p>
              <p className="mt-[16px] font-sans text-[15px] font-medium text-black">
                {screen.description}
              </p>
            </div>

            <div
              className="relative w-full overflow-hidden rounded-[10px] lg:ml-auto lg:flex-1 lg:max-w-[597px]"
              style={{ aspectRatio: "597 / 455" }}
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
          </div>
        ))}
      </div>
    </section>
  );
}
