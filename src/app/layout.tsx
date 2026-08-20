import type { Metadata } from "next";
import { Inter, Inria_Serif } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { ScrollToTopOnNavigate } from "@/components/ScrollToTopOnNavigate";
import { SmoothScroll } from "@/components/SmoothScroll";
import { BASE_PATH } from "@/lib/base-path";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Figma dev-mode inspect originally specified Inria Serif Bold (700) for
// the headline's "Tina" (and equivalent word in the other phrases), later
// switched to Regular (400) per design feedback — kept loading both
// weights in case Bold is needed again. Weight 300 + italic style added
// for the About page's "Tina Le" signature (italic 300) and trait names
// (italic 400).
const inriaSerif = Inria_Serif({
  variable: "--font-inria-serif",
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Required for the opengraph-image/twitter-image file conventions to
  // resolve to an absolute, publicly-reachable URL — without this, Next
  // defaults to "http://localhost:3000" (a real build warning), which
  // would silently ship a broken share-preview image link on the actual
  // deployed site. This is the live production domain (a Vercel deploy,
  // confirmed via DNS + response headers — the GitHub Pages build at
  // tinale21.github.io/Portfolio is a separate, secondary deployment of
  // this same repo, not what visitors actually land on) — using that
  // GitHub Pages URL here instead previously shipped a share-preview
  // image link that 404'd for real visitors, since it doesn't share a
  // domain with where the image is actually hosted.
  metadataBase: new URL("https://www.tinanle.com"),
  title: "Tina Le — Portfolio",
  description: "Portfolio of Tina Le",
  // Per direct instruction, the browser-tab favicon should follow the
  // user's OS/browser color scheme — black logo for light mode, white
  // for dark, so it stays visible against either. Tried the simpler
  // route first (an app/icon.svg with a `prefers-color-scheme` media
  // query baked into its own <style>, the standard technique for
  // theme-aware SVG favicons) — but Next's file-convention resolver
  // turned out to fully replace the auto-detected favicon.ico link
  // once icon.svg existed, rather than emitting both: confirmed via
  // the built HTML, only one <link rel="icon"> tag survived, and it
  // wasn't a fallback pairing. Declaring the icons explicitly here
  // instead sidesteps that: multiple entries in the same rel="icon"
  // group, each with its own `media` attribute (a plain HTML feature,
  // broader support than depending on the browser's SVG renderer to
  // also evaluate embedded CSS) — light and dark variants each only
  // load under matching `prefers-color-scheme`, with the original
  // favicon.ico (still black-on-transparent, unconditional) as a
  // fallback for anything that ignores the `media` attribute entirely.
  //
  // Same override-drops-the-file-convention behavior bit again with
  // `apple-icon.png`: iOS's tab switcher/bookmarks/home-screen icon
  // reads `apple-touch-icon`, not the regular favicon, and Next does
  // auto-detect an `app/apple-icon.png` file into that link tag on its
  // own — but only when `metadata.icons` isn't otherwise declared.
  // Since it already is here (for the light/dark favicon split above),
  // that auto-detection silently doesn't run at all, same failure mode
  // as the icon.svg/favicon.ico conflict — confirmed via the built HTML
  // having zero apple-touch-icon tags despite `/apple-icon.png` still
  // being generated as its own route. Declaring it here explicitly,
  // dark-brand-background/white-logo (no transparency — iOS composites
  // this onto its own background and adds its own corner rounding, so a
  // transparent or pre-rounded source looks wrong there).
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon-light.png`, media: "(prefers-color-scheme: light)", type: "image/png" },
      { url: `${BASE_PATH}/favicon-dark.png`, media: "(prefers-color-scheme: dark)", type: "image/png" },
      { url: `${BASE_PATH}/favicon.ico`, sizes: "any" },
    ],
    apple: [{ url: `${BASE_PATH}/apple-icon.png`, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inriaSerif.variable} antialiased`}
    >
      <body className="flex flex-col">
        {/* Browsers restore the pre-refresh scroll position by default
            (history.scrollRestoration defaults to "auto"), which reads as
            "refresh didn't reset the page." Opting into manual restoration
            here — before the browser applies its own — makes a refresh
            behave like a fresh page load, starting at the top. Runs via
            beforeInteractive so it executes as the HTML streams in, ahead
            of the browser's own restoration and ahead of hydration. */}
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }`}
        </Script>
        {/* Per direct instruction ("slightly delayed and fluid... but
            not overly slow or floaty... responsive and natural"), site-
            wide inertial scroll via Lenis — desktop-only per direct
            follow-up feedback ("the mobile is a bit laggy"), see
            SmoothScroll.tsx. `root` mode renders zero extra DOM
            (confirmed by reading the library's own source — it returns
            `children` directly, no wrapper div), so this doesn't
            disturb `<body>`'s own `flex flex-col` sticky-footer layout
            at all. In its default "root" configuration, Lenis drives
            the real native window scroll position every frame (not a
            CSS-transform fake), so every scroll-linked effect already
            in this codebase (Framer Motion's useScroll, the NavBar
            theme detector, HeroSection's headline-arrival listener,
            etc.) keeps working unmodified on desktop — confirmed by
            reading the library's own `setScroll()` implementation. */}
        <SmoothScroll>
          <ScrollToTopOnNavigate />
          <NavBar />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
