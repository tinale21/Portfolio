"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import museumImg from "@/assets/case-studies/aig/secondary/museum.webp";
import visixImg from "@/assets/case-studies/aig/secondary/visix.webp";
import gfmagImg from "@/assets/case-studies/aig/secondary/gfmag.webp";

// AIG case study section between Research Method and Key Findings, styled
// after the reference (celinafang.framer.website/work/detoxbox): a dense,
// overlapping collage of secondary-research sources. Three sources render as
// full article-preview cards (thumbnail + title + source), the rest as
// smaller "link pill" cards (chain icon + URL). Just the "Secondary
// Research" eyebrow title, in the same style as every other AIG section.
//
// Desktop (lg+): everything is absolutely positioned in a bounded relative
// box; the pills layer on top of the cards' edges like the reference. All
// left/top/width are in % (left + width <= ~95 per item) so nothing can
// extend past the container at any viewport width. Below lg: a plain stacked
// feed (cards then pills), since an overlapping scatter doesn't fit a phone.
type CardItem = {
  kind: "card";
  href: string;
  image: StaticImageData;
  title: string;
  source: string;
};
type PillItem = { kind: "pill"; href: string; display: string };
type Item = CardItem | PillItem;

const ITEMS: Item[] = [
  {
    kind: "card",
    href: "https://www.visix.com/",
    image: visixImg,
    title: "Transforming Spaces Into Shared Experiences",
    source: "visix.com",
  },
  {
    kind: "card",
    href: "https://medium.com/@manikeshtripathi/interactive-museum-experiences-how-technology-is-shaping-visitor-engagement-629c19e641c0",
    image: museumImg,
    title: "Interactive Museum Experiences: How Technology is Shaping Visitor Engagement",
    source: "medium.com",
  },
  {
    kind: "card",
    href: "https://gfmag.com/technology/innovators-2024-best-financial-innovation-labs/",
    image: gfmagImg,
    title: "The Innovators 2024—Best Financial Innovation Labs",
    source: "gfmag.com",
  },
  { kind: "pill", href: "https://robinpowered.com/", display: "https://robinpowered.com/" },
  {
    kind: "pill",
    href: "https://aimultiple.com/generative-ai-finance",
    display: "https://aimultiple.com/generative-ai-finance",
  },
  {
    kind: "pill",
    href: "https://finovate.com/five-ways-financial-institutions-can-foster-innovation/",
    display: "https://finovate.com/five-ways-financial-institutions-can-foster-innovation/",
  },
  {
    kind: "pill",
    href: "https://toponetouch.com/interactive-display-for-lobby-secret-to-keeping-visitors-engaged/",
    display: "https://toponetouch.com/interactive-display-for-lobby-secret-to-keeping-visitors-engaged/",
  },
  {
    kind: "pill",
    href: "https://www.crowntv-us.com/blog/digital-tourism-trends/",
    display: "https://www.crowntv-us.com/blog/digital-tourism-trends/",
  },
];

// Desktop scatter placement, indexed to ITEMS, tuned to the reference: a
// tight CENTERED cluster where the three cards overlap each other and the
// pills layer on top of them, crossing card edges — not an even spread.
// The cluster lives in a narrow max-w box (see below) so it sits centered
// with whitespace on either side like the reference. All %, left + width
// <= ~95 per item (relative to that box) so nothing overflows.
const LAYOUT = [
  { left: 4, top: 30, width: 33, z: 12 }, // visix card (left)
  { left: 33, top: 46.25, width: 34, z: 20 }, // medium card (center, front) — +50px total (1.85% per 10px of 540)
  { left: 63, top: 28, width: 32, z: 14 }, // gfmag card (right)
  { left: 56.98, top: 22.81, width: 27, z: 52 }, // robinpowered pill — +80px y, -10px x
  { left: 28, top: 31.43, width: 27, z: 50 }, // aimultiple pill — top center (swapped w/ gokorbyt), +105px y
  { left: 16, top: 54, width: 35, z: 53 }, // finovate pill (lower left)
  { left: 26.23, top: 77.74, width: 35, z: 54 }, // toponetouch pill — -135px x total, +85px y
  { left: 58, top: 52, width: 30, z: 55 }, // crowntv pill (lower right)
];

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function Pill({ href, display }: { href: string; display: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2 rounded-[12px] border border-[#ECECEC] bg-white px-3.5 py-2.5 shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_8px_22px_rgba(0,0,0,0.14)]"
    >
      <LinkIcon className="mt-[3px] h-[15px] w-[15px] shrink-0 text-[#9AA1AF]" />
      <span className="font-sans text-[13px] leading-snug break-words text-[#6D6D6D] underline decoration-[#D4D4D4] underline-offset-2">
        {display}
      </span>
    </a>
  );
}

function Card({ href, image, title, source }: Omit<CardItem, "kind">) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[14px] border border-[#ECECEC] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image src={image} alt={title} fill sizes="30vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-2 px-4 pt-3 pb-3.5">
        <p className="font-sans text-[14px] leading-snug font-semibold text-black">{title}</p>
        <span className="flex items-center gap-1.5 font-sans text-[12px] text-[#8A8F98]">
          <LinkIcon className="h-[13px] w-[13px] shrink-0" />
          {source}
        </span>
      </div>
    </a>
  );
}

function renderItem(item: Item) {
  return item.kind === "card" ? (
    <Card href={item.href} image={item.image} title={item.title} source={item.source} />
  ) : (
    <Pill href={item.href} display={item.display} />
  );
}

// The overlapping cluster's design size (matches the desktop box: h-[540px],
// max-w-[980px]). The mobile view renders this exact cluster and scales it
// down to fit, so positions/text/images all shrink uniformly rather than
// relisting the links one by one.
const DESIGN_W = 980;
const DESIGN_H = 540;

// The absolutely-positioned collage items, shared by the desktop box and the
// scaled mobile stage. Percentages are relative to whatever box contains it,
// so it renders identically at any box width.
function CollageItems() {
  return (
    <>
      {ITEMS.map((item, i) => {
        const p = LAYOUT[i];
        return (
          <motion.div
            key={item.href}
            className="absolute"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${p.width}%`, zIndex: p.z }}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
          >
            {renderItem(item)}
          </motion.div>
        );
      })}
    </>
  );
}

export function AigSecondaryResearch() {
  // Mobile scales the full DESIGN_W-wide cluster down to the available width.
  const mobileRef = useRef<HTMLDivElement>(null);
  const [mobileScale, setMobileScale] = useState(0.36);

  useEffect(() => {
    const el = mobileRef.current;
    if (!el) return;
    const update = () => setMobileScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section data-nav-theme="light" className="bg-white pt-16 pb-32">
      <p className="px-5 font-sans text-base text-[#707682] sm:px-8 lg:px-[68px]">
        Secondary Research
      </p>

      {/* Mobile / tablet: the same overlapping cluster as desktop, scaled down
          to fit (per direct feedback — keep the stacked/overlapping look, not
          a one-by-one list). The scaled stage is absolutely positioned inside
          an overflow-hidden box so its full DESIGN_W layout width can't cause
          page horizontal overflow. */}
      <div className="mt-8 px-5 sm:px-8 lg:hidden">
        <div
          ref={mobileRef}
          className="relative mx-auto overflow-hidden"
          style={{ height: DESIGN_H * mobileScale }}
        >
          <div
            className="absolute left-0 top-0 isolate origin-top-left"
            style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${mobileScale})` }}
          >
            <CollageItems />
          </div>
        </div>
      </div>

      {/* Desktop: a tight, centered, overlapping cluster (cards overlap each
          other; pills layer on top). Narrow max-w so it sits centered with
          whitespace on either side, like the reference. */}
      <div className="mt-12 hidden px-[68px] lg:block">
        {/* isolate = new stacking context so the pills' z-index values (up to
            55) stay scoped here and can't paint over the sticky nav (z-50)
            when scrolled past. */}
        <div className="relative isolate mx-auto h-[540px] max-w-[980px]">
          <CollageItems />
        </div>
      </div>
    </section>
  );
}
