import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Placeholder display serif — matches the reference's general feel
// (transitional serif, moderate contrast). Swap once the real Figma
// font is confirmed.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
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
      className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
    >
      <body className="flex flex-col">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
