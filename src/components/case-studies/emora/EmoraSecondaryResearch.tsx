"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import autismSpeaksImg from "@/assets/case-studies/emora/secondary/autismspeaks.webp";
import jmirImg from "@/assets/case-studies/emora/secondary/jmir.webp";
import sparkImg from "@/assets/case-studies/emora/secondary/sparkforautism.webp";

// Emora case study "Secondary Research" section, between Research Method and
// Key Findings — same overlapping-collage design, layout, and spacing as the
// AIG/Wayve versions; only the links/cards differ. Three sources render as
// full article cards (thumbnail + title + source), the rest as URL "link
// pills". Kept as its own copy so its scatter can be tuned independently,
// matching the codebase's per-case-study pattern.
//
// Desktop (lg+): absolutely positioned in a bounded relative box, pills
// layered over the cards; all left/top/width in % (left + width <= ~95) so it
// never overflows. Below lg: a plain stacked feed.
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
    href: "https://www.autismspeaks.org/",
    image: autismSpeaksImg,
    title: "Autism Speaks",
    source: "autismspeaks.org",
  },
  {
    kind: "card",
    href: "https://www.jmir.org/2020/4/e13810/",
    image: jmirImg,
    title: "Toward Continuous Social Phenotyping",
    source: "jmir.org",
  },
  {
    kind: "card",
    href: "https://sparkforautism.org/discover_article/managing-emotions/",
    image: sparkImg,
    title: "Autism, Meltdowns, and the Struggle to Manage Emotions",
    source: "sparkforautism.org",
  },
  { kind: "pill", href: "https://www.beanemo.com/", display: "https://www.beanemo.com/" },
  {
    kind: "pill",
    href: "https://www.pbs.org/parents/thrive/helping-children-with-autism-connect-with-emotions",
    display: "https://www.pbs.org/parents/thrive/helping-children-with-autism-connect-with-emotions",
  },
  { kind: "pill", href: "https://getlulla.ai/", display: "https://getlulla.ai/" },
  {
    kind: "pill",
    href: "https://jamanetwork.com/journals/jamapediatrics/fullarticle/2728462",
    display: "https://jamanetwork.com/journals/jamapediatrics/fullarticle/2728462",
  },
  {
    kind: "pill",
    href: "https://www.autismparentingmagazine.com/easy-ways-to-teach-perspective/",
    display: "https://www.autismparentingmagazine.com/easy-ways-to-teach-perspective/",
  },
];

// Identical scatter placement to the AIG/Wayve LAYOUT (3 cards + 5 pills = 8
// entries), so the sections start visually matched. All %, left + width <= ~95.
const LAYOUT = [
  { left: 4, top: 30, width: 33, z: 12 }, // card 1 (left)
  { left: 33, top: 46.25, width: 34, z: 20 }, // card 2 (center, front)
  { left: 63, top: 28, width: 32, z: 14 }, // card 3 (right)
  { left: 56.98, top: 22.81, width: 27, z: 52 }, // pill (upper right)
  { left: 16, top: 54, width: 35, z: 53 }, // pbs pill (lower left, wide — long URL)
  { left: 28, top: 33.28, width: 27, z: 50 }, // getlulla pill (top center, narrower — short URL), +10px y
  { left: 26.23, top: 77.74, width: 35, z: 54 }, // pill (bottom center)
  { left: 58, top: 52, width: 30, z: 55 }, // pill (lower right)
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
      {/* min-w-0 lets this flex item shrink below the URL's intrinsic width so
          break-words can wrap long URLs instead of overflowing the pill. */}
      <span className="min-w-0 font-sans text-[13px] leading-snug break-words text-[#6D6D6D] underline decoration-[#D4D4D4] underline-offset-2">
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

export function EmoraSecondaryResearch() {
  return (
    <section data-nav-theme="light" className="bg-white pt-16 pb-32">
      <p className="px-5 font-sans text-base text-[#707682] sm:px-8 lg:px-[68px]">
        Secondary Research
      </p>

      {/* Mobile / tablet: stacked feed. */}
      <div className="mt-8 flex flex-col gap-4 px-5 sm:px-8 lg:hidden">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.04 }}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </div>

      {/* Desktop: tight, centered, overlapping cluster (cards overlap; pills
          layer on top). */}
      <div className="mt-12 hidden px-[68px] lg:block">
        {/* isolate = new stacking context so the pills' z-index values (up to
            55) stay scoped here and can't paint over the sticky nav (z-50). */}
        <div className="relative isolate mx-auto h-[540px] max-w-[980px]">
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
        </div>
      </div>
    </section>
  );
}
