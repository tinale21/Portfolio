import { ReactNode } from "react";

export function ToolIcon({
  name,
  background,
  outline = false,
  children,
}: {
  name: string;
  background: string;
  // Per direct feedback, Microsoft 365's white icon otherwise blends
  // straight into this section's own white background — an outline-only
  // option rather than a general border prop, since it's specifically
  // for icons whose own background is too close to the page's.
  outline?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={name}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:h-11 sm:w-11"
      style={{
        background,
        // Tailwind's `border` utility floors at 1px; 0.5px reads as a
        // thinner hairline per direct feedback that 1px felt too heavy.
        ...(outline ? { borderStyle: "solid", borderWidth: "0.5px", borderColor: "#E5E5E5" } : {}),
      }}
    >
      {children}
    </div>
  );
}
