import { BASE_PATH } from "@/lib/base-path";
import { Lightbox } from "@/components/case-studies/Lightbox";

// Structure and copy transcribed directly from the composite reference
// screenshot (source: Screenshot 2026-08-12 at 9.23.46 PM.png) — no
// dev-mode redlines were provided for this section's own spacing, so
// per direct instruction this reuses Visual Directions' established
// rules exactly:
// - Row title: Inter 15px/400, #707682. Row/intro description: Inter
//   15px/500, #000. (Visual Directions' eyebrow reduced from 16px to
//   15px per direct feedback; reused here from the start rather than
//   building at 16px and reducing again.)
// - Each of the 5 sub-item videos: capped at 597px via max-w (not
//   flex-1 uncapped — that grew Visual Directions' videos to 1240px+
//   on wide viewports), pushed flush to the right padding via ml-auto,
//   10px corner radius, object-cover.
// - The intro row's right-column paragraphs matched to that same
//   597px width (was 650px) and recolored to #6E7681 per direct
//   feedback — #6E7681 matches Project Overview's own right-column
//   paragraph color elsewhere in this case study.
// - Section stretches to the standard site-wide lg:px-[68px] padding,
//   same as every section except Exploration & Iterations.
//
// Motion reference (Screen Recording 2026-08-12 at 9.22.05 PM.mov)
// showed a plain sequential scroll — no zigzag, no scroll-tied
// progress bar, no tilt — just consistent text-left/video-right rows,
// unlike Exploration & Iterations' timeline. No special motion added
// here as a result; matches Visual Directions in also having none.
//
// Video processing: all 5 source recordings are 3456x1932 (1.7888:1),
// the same aspect as Visual Directions' sources — scaled to 1600px
// wide with no crop, CRF 18, no audio present in any of the 5 sources.
//
// Section's own top padding bumped three times per direct feedback for
// more breathing room below Exploration & Iterations: pt-16 -> pt-28 ->
// pt-36 -> pt-44 — same adjustment already made to Exploration &
// Iterations' own top padding for the gap above it.
const INTRO = {
  description:
    "The final kiosk brings together navigation, storytelling, and community to create a connected experience for AIG's Innovation Hub.",
  paragraphs: [
    "Designed for both first-time visitors and AIG employees, the kiosk creates a connected experience that blends intuitive navigation, company storytelling, local discovery, and employee engagement into a single platform.",
    "QR code handoffs extend key interactions beyond the kiosk, allowing users to seamlessly continue tasks on their mobile devices. Together, these touchpoints transform the kiosk into a welcoming destination that reflects AIG's commitment to innovation and hospitality.",
  ],
};

const SCREENS = [
  {
    title: "Homepage",
    description:
      "The homepage welcomes visitors with an animated Atlanta-inspired cityscape and provides quick access to Map, About, Explore ATL, and Photo Booth. Accessibility features ensure an inclusive experience.",
    video: "/projects/aig-fdi-homepage.mp4",
  },
  {
    title: "Map",
    description:
      "The Map page helps users find available rooms by floor and room type. Once selected, an interactive map provides turn-by-turn directions, while a QR code handoff lets employees reserve the room in the AIG app.",
    video: "/projects/aig-fdi-map.mp4",
  },
  {
    title: "About",
    description:
      "The About page introduces visitors to AIG through articles, videos, and company highlights, creating opportunities to learn about the company's history, innovation, and impact.",
    video: "/projects/aig-fdi-about.mp4",
  },
  {
    title: "Explore ATL",
    description:
      "The Explore ATL page helps visitors discover nearby attractions by category. Each destination includes detailed information and a QR code handoff for directions on their mobile device.",
    video: "/projects/aig-fdi-explore-atl.mp4",
  },
  {
    title: "Photo Booth",
    description:
      "The Photo Booth encourages employees to capture and download photos through a QR code handoff, creating memorable moments that foster community and bring users back to the kiosk.",
    video: "/projects/aig-fdi-photo-booth.mp4",
  },
];

export function AigFinalDesignImplementation() {
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
