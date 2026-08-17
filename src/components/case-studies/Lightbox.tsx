"use client";

import { cloneElement, isValidElement, useEffect, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import Image, { type StaticImageData } from "next/image";

// Desktop-only "click a photo/video to view it full-size" feature, per
// direct instruction, modeled on a reference recording of another
// portfolio's own lightbox (a dimmed backdrop, the media centered and
// scaled up, a close button in the top-right corner). Applied across
// every case study's Project Overview media, Exploration & Iterations
// photos, Final Design videos, and AIG's Visual Directions videos —
// twelve different call sites with very different surrounding markup
// (some are direct flex children relying on `ml-auto`/`flex-1`/`max-w`
// to position themselves, some sit inside `next/image`'s `fill` layout
// which requires its own direct parent to establish size), so this
// wraps the existing trigger element via `cloneElement` instead of
// rendering a new wrapper `<div>` around it — zero new DOM nodes means
// zero risk of breaking any of those per-page layout rules, since the
// existing element keeps its exact position in the tree and just gains
// an onClick + a cursor style.
//
// Desktop-only via the same matchMedia("(min-width: 1024px)") pattern
// already established elsewhere in these case study components (ties
// to Tailwind's own `lg` breakpoint) — on mobile the wrapped element
// renders completely unchanged, no click handler attached at all.
const DESKTOP_QUERY = "(min-width: 1024px)";

type LightboxMedia =
  | { type: "image"; src: StaticImageData | string; alt: string }
  | { type: "video"; src: string; poster?: string };

export function Lightbox({
  media,
  children,
}: {
  media: LightboxMedia;
  children: ReactElement<{ className?: string; onClick?: (e: React.MouseEvent) => void }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isValidElement(children)) return children;

  const trigger = isDesktop
    ? cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e);
          setIsOpen(true);
        },
        className: `${children.props.className ?? ""} cursor-zoom-in`,
      })
    : children;

  return (
    <>
      {trigger}

      {isOpen &&
        isDesktop &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-8"
            onClick={() => setIsOpen(false)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute top-6 right-6 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-2xl leading-none text-black transition hover:opacity-80"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
              {media.type === "image" ? (
                <Image
                  src={media.src}
                  alt={media.alt}
                  className="w-auto rounded-[10px] object-contain shadow-2xl"
                  // Per direct feedback, some images (Exploration &
                  // Iterations' 1696x1024 sources are the lowest-res of
                  // any lightbox-wrapped image) read as fuzzy enlarged —
                  // this site ships next/image unoptimized (no
                  // optimization server on GitHub Pages, see
                  // next.config.ts), so the served file is always the
                  // original, full-quality source; the blur was pure
                  // CSS upscaling past that source's native pixel size
                  // on larger screens (85vw/85vh alone doesn't know or
                  // care about the source's real resolution). Capping
                  // max-width/height at min(85vw/vh, the image's own
                  // intrinsic size) — read directly off the static
                  // import's own metadata, no measurement needed —
                  // means it's never scaled up past 1:1, only down.
                  style={
                    typeof media.src === "object"
                      ? {
                          maxWidth: `min(85vw, ${media.src.width}px)`,
                          maxHeight: `min(85vh, ${media.src.height}px)`,
                        }
                      : { maxWidth: "85vw", maxHeight: "85vh" }
                  }
                />
              ) : (
                <video
                  src={media.src}
                  poster={media.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="max-h-[85vh] w-auto max-w-[85vw] rounded-[10px] object-contain shadow-2xl"
                />
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
