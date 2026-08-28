import { Experience } from "./experiences-data";

// Reuses ExperienceRow/Experience as-is rather than a new row component —
// per direct instruction this section should follow the exact same text
// and spacing rules as Experiences, and the two-line-left/two-line-right
// layout maps directly onto the existing fields: institution name in
// `title` (bold, top line) instead of a job title, degree in `company`
// (light, second line) instead of an employer.
export const EDUCATION: Experience[] = [
  {
    title: "Savannah College of Art and Design",
    company: "BFA, User Experience (UX) Design (Minor: Film and Television)",
    date: "Sep 2023 - May 2027",
    location: "Atlanta, GA",
  },
];
