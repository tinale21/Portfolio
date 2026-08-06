import type { Metadata } from "next";
import { Inter, Inria_Serif } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Confirmed via Figma dev-mode inspect: the headline's "Tina" (and
// equivalent word in the other phrases) uses Inria Serif Bold (700).
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
        <NavBar />
        {children}
      </body>
    </html>
  );
}
