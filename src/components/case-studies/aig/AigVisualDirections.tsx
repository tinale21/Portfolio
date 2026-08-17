import { BASE_PATH } from "@/lib/base-path";
import { Lightbox } from "@/components/case-studies/Lightbox";

// Figma dev-mode inspect. Solid, directly-read values:
// - "Visual Directions" eyebrow: Inter 16px/400, #707682.
// - Each row's title ("On the Horizon" etc.): Inter 16px/400, #707682 —
//   same typography as the eyebrow above it, not the bolder heading
//   style used elsewhere in this case study. Reduced to 15px per direct
//   feedback (the "Visual Directions" eyebrow itself stayed at 16px).
// - Each row's description: Inter 16px/500, #000, 512px wide (hug
//   height, 76px at that width — 4 lines). Also reduced to 15px per
//   direct feedback.
// - Gap between a row's title and its description: 31px (confirmed via
//   two different combined-selection redlines: 19px title height + 31px
//   gap + 76px description = 126px, which matches the "512 x 126"
//   badge shown when both were selected together, with zero error, for
//   both the first and third rows) — reduced to 16px per direct
//   feedback.
// - Video: 597x334 in Figma (aspect ~1.787:1), 10px corner radius. Each
//   video's left edge sits 845px in from the section's left edge, with
//   a 70px gap to the section's right edge (845 + 597 + 70 = 1512,
//   exact) — identical across all three rows.
//
// Per direct feedback, this section shouldn't use Figma's fixed
// 845px-left-inset / 512px-text / 597px-video sizing — instead each row
// stretches to fill the section's own left/right padding (the standard
// site-wide lg:px-[68px]) on every screen size. The text column keeps
// its measured 512px width (that's just a text-wrapping width, not
// something that needs to reach the padding), while the video is
// flex-1 so it still shrinks to fit at narrower widths, but capped at
// its original Figma width (597px) via max-w — flex-1 with no cap grew
// the video to 1240px+ on wide viewports, way past the source Figma
// design, which per direct feedback read as too big. Once capped, the
// video's own box no longer fills its flex-grown space, leaving it
// left-aligned with empty space before the right padding — ml-auto
// pushes it flush against the right padding instead, per direct
// feedback.
//
// Video processing: the three source recordings are already almost
// exactly the 597:334 target aspect (3456x1932 = 1.7888:1 vs.
// 597:334 = 1.7874:1, a 0.08% difference) — scaled directly to 1600px
// wide with no crop needed, encoded at CRF 18, no audio track was
// present to begin with. Autoplay/loop/muted matches the Hero video's
// established convention — cross-checked against the Figma prototype
// recording, where each video is clearly playing/cycling through
// content as the page scrolls with no click/hover interaction visible;
// the "play button" icon seen in the static Figma dev-mode screenshots
// turned out to be Figma's own editor affordance for video layers, not
// part of the actual design.
//
// Not directly confirmed by any redline in this batch of screenshots:
// the vertical gap between rows and the section's own top/bottom
// padding — no screenshot captured either, so this uses a plain
// pt-16/pb-16 section padding and a gap-20 (80px) between rows,
// consistent with the generous rhythm used elsewhere in this case
// study for section-level breaks.
const DIRECTIONS = [
  {
    title: "On the Horizon",
    description:
      "During our site visit, we found that the 9th-floor views of Atlanta's skyline and surrounding greenery helped define the Innovation Hub's atmosphere. This inspired a concept that embraced AIG's minimal aesthetic to reinforce a sense of professionalism.",
    video: "/projects/aig-on-the-horizon.mp4",
  },
  {
    title: "Future Forward",
    description:
      'AIG\'s mission is to help clients build a secure future through innovation. The Innovation Hub reflects this vision by highlighting emerging technologies like Generative AI. "Future Forward" presents AIG through a modern, forward-thinking visual identity.',
    video: "/projects/aig-future-forward.mp4",
  },
  {
    title: "United in Innovation",
    description:
      'Innovation can mean different things to different people, so we explored how to represent it visually. "United in Innovation" uses 3D design and glass textures to create a modern experience that reflects AIG\'s commitment to transparency, trust, and the future.',
    video: "/projects/aig-united-in-innovation.mp4",
  },
];

export function AigVisualDirections() {
  return (
    <section
      data-nav-theme="light"
      className="bg-white px-5 pt-16 pb-16 sm:px-8 lg:px-[68px]"
    >
      <p className="font-sans text-base text-[#707682]">Visual Directions</p>

      <div className="mt-8 flex flex-col gap-20">
        {DIRECTIONS.map((item) => (
          <div key={item.title} className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="lg:w-[512px] lg:shrink-0">
              <p className="font-sans text-[15px] text-[#707682]">{item.title}</p>
              <p className="mt-[16px] font-sans text-[15px] font-medium text-black">
                {item.description}
              </p>
            </div>

            <Lightbox media={{ type: "video", src: `${BASE_PATH}${item.video}` }}>
              <div
                className="relative w-full overflow-hidden rounded-[10px] lg:ml-auto lg:flex-1 lg:max-w-[597px]"
                style={{ aspectRatio: "597 / 334" }}
              >
                <video
                  src={`${BASE_PATH}${item.video}`}
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
