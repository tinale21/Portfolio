import { BASE_PATH } from "@/lib/base-path";
import { Lightbox } from "@/components/case-studies/Lightbox";

// Per direct instruction, reuses the exact text and video sizing,
// color, and spacing rules already established for the AIG Final
// Design Implementation section (AigFinalDesignImplementation.tsx) —
// same row title (15px/400/#707682) and description (15px/500/#000)
// typography, same intro paragraph color (#6E7681) and width (597px,
// matching the videos), same video treatment (capped at 597px via
// max-w, ml-auto to the right padding, 10px radius, object-cover),
// same pt-44 section top padding, same gap-20 between rows.
//
// Motion reference (Screen Recording 2026-08-13 at 3.41.43 PM.mov)
// showed the same plain sequential scroll as AIG's version — no
// special motion added here either.
//
// Video processing: the three source recordings have different native
// resolutions/aspects (Wayve App and Digital Badge: 1666x1080; Popup
// Venues: 1280x720) — each scaled to 1600px wide preserving its own
// aspect (no forced crop), same as AIG's approach, letting the shared
// 597:334 CSS box + object-cover reconcile the display crop. Popup
// Venues' source had an audio track (the only one of the three) —
// stripped to match the "no audio on any video" convention used
// throughout this site.
const INTRO = {
  description:
    "Wayve combines immersive pop-up experiences with a connected digital platform, creating a scalable ecosystem that extends music engagement beyond a single event.",
  paragraphs: [
    "Rather than choosing between Sonic Playroom and Flowstate, we combined the strengths of both into a physical pop-up experience connected to a digital platform. Guests create personalized visuals at the event and take them home through the app, extending engagement beyond a single visit.",
    "This scalable model supports recurring pop-ups, exclusive digital content, VIP experiences, brand partnerships, licensing opportunities, and food and beverage to generate continuous revenue.",
  ],
};

const SCREENS = [
  {
    title: "Wayve App",
    description:
      "The Wayve app lets users create interactive visuals, revisit past creations, and discover upcoming pop-up experiences, extending the Wayve experience beyond the venue.",
    video: "/projects/wayve-fdi-app.mp4",
  },
  {
    title: "Digital Badge",
    description:
      "Digital badges encourage users to visit new locations, collect every event badge, and share their experiences with friends, rewarding continued participation across the Wayve ecosystem.",
    video: "/projects/wayve-fdi-digital-badge.mp4",
  },
  {
    title: "Popup Venues",
    description:
      "Each Wayve pop-up is uniquely themed for either Gen Z or Gen Alpha, combining interactive experiences, brand partnerships, food, drinks, and VIP packages to drive engagement and revenue.",
    video: "/projects/wayve-fdi-popup-venues.mp4",
  },
];

export function WayveFinalDesignImplementation() {
  return (
    <section data-nav-theme="light" className="bg-white px-5 pt-44 pb-16 sm:px-8 lg:px-[68px]">
      <p className="font-sans text-base text-[#707682]">Final Design Implementation</p>

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
            <div className="lg:w-[512px] lg:shrink-0">
              <p className="font-sans text-[15px] text-[#707682]">{screen.title}</p>
              <p className="mt-[16px] font-sans text-[15px] font-medium text-black">
                {screen.description}
              </p>
            </div>

            <Lightbox media={{ type: "video", src: `${BASE_PATH}${screen.video}` }}>
              <div
                className="relative w-full overflow-hidden rounded-[10px] lg:ml-auto lg:flex-1 lg:max-w-[597px]"
                style={{ aspectRatio: "597 / 334" }}
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
