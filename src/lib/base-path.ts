// Single source of truth for the deployed subpath, read by both
// next.config.ts (to set Next's own `basePath`, which auto-prefixes
// next/link and next/image) and app code that references public/ assets
// via a raw string instead (e.g. <video src="/projects/x.mp4">, which
// Next does NOT auto-prefix). Only set in the GitHub Pages Actions
// workflow — empty for local dev/build and for any future Vercel deploy,
// since Vercel serves from a full domain root and needs no subpath.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
