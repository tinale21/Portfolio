import type { Metadata } from "next";
import { Inter, Inria_Serif } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Figma dev-mode inspect originally specified Inria Serif Bold (700) for
// the headline's "Tina" (and equivalent word in the other phrases), later
// switched to Regular (400) per design feedback — kept loading both
// weights in case Bold is needed again.
const inriaSerif = Inria_Serif({
  variable: "--font-inria-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tina Le — Portfolio",
  description: "Portfolio of Tina Le",
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
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
