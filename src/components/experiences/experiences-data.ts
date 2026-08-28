// Figma dev-mode inspect, per-row: title (Inter, 24px, weight 500, #000),
// company (Inter, 24px, weight 300, #7F7F7F), date and location (same
// style as company, right-aligned). A "Line" divider (1375px wide, 1px,
// #E5E5E5) sits between each pair of rows — the 1375px width against the
// 1512px frame implies ~68px of side margin, matching this site's
// existing lg:px-[68px] convention used on ProjectsSection.
export type Experience = {
  title: string;
  company: string;
  // Optional shorter form shown below the `lg` breakpoint instead of
  // `company` — per direct instruction, only the Georgia International
  // Convention Center row needed this (its full name doesn't fit as
  // comfortably on a phone-width row as the other companies' names do).
  mobileCompany?: string;
  date: string;
  location: string;
};

export const EXPERIENCES: Experience[] = [
  { title: "UX Designer", company: "SCADpro x Delta Air Lines", date: "Sep 2026 - Nov 2026", location: "Atlanta, GA" },
  {
    title: "UX Designer",
    company: "SCADpro x Georgia International Convention Center",
    mobileCompany: "SCADpro x GICC",
    date: "Jun 2026 - July 2026",
    location: "College Park, GA",
  },
  { title: "UX Designer Intern", company: "Ziora Copilot", date: "Jan 2026 - Apr 2026", location: "Remote" },
  {
    title: "UX Design Lead (Contract)",
    company: "Ronald McDonald House",
    date: "Sep 2025 - Nov 2025",
    location: "Atlanta, GA",
  },
  { title: "UX Designer", company: "SCADpro x AIG", date: "Sep 2025 - Nov 2025", location: "Atlanta, GA" },
];
