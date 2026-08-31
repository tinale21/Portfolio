import { SVGProps } from "react";

// Glyph-only components (no background) — ToolIcon.tsx supplies the
// colored rounded-square backdrop each of these sits on, matching the
// "app icon" style in the reference image (colored square + a simple
// glyph/lettermark), not a flat single-color logo mark.

// Figma's actual 5-piece brand mark (three circles + two puzzle-piece
// shapes), each with its own official brand color — sourced from
// Figma's own public brand guidelines, not approximated as a single
// silhouette (which is how icon sets like simple-icons represent it,
// losing the multi-color look the reference image shows).
export function FigmaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
    </svg>
  );
}

// Framer's flag/ribbon mark — path data from simple-icons (MIT-licensed,
// official brand glyph), rendered in white to match Framer's own app
// icon (a white mark on a blue background).
export function FramerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
  );
}

// Claude's asterisk/starburst mark — path data from simple-icons.
export function ClaudeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  );
}

// Adobe app lettermarks (Ps/Ai/Pr) — Adobe's own icons are just a solid
// square + a bold two-letter monogram, so reproducing the real mark
// accurately doesn't need traced path art, only the right weight/kerning
// and each app's specific accent color against its own dark background
// (Photoshop's light blue, Illustrator's orange, Premiere's lavender).
function AdobeLettermark({ letters, color }: { letters: string; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="font-sans text-[16px] leading-none font-bold tracking-tight"
      style={{ color }}
    >
      {letters}
    </span>
  );
}

export function PhotoshopGlyph() {
  return <AdobeLettermark letters="Ps" color="#31A8FF" />;
}

export function IllustratorGlyph() {
  return <AdobeLettermark letters="Ai" color="#FF9A00" />;
}

export function PremiereProGlyph() {
  return <AdobeLettermark letters="Pr" color="#9999FF" />;
}

// Canva's real mark is a two-tone paint-drop "C" on a teal-to-purple
// gradient; simplified here to a bold white "C" on that same gradient
// (supplied by ToolIcon's background) rather than attempting to trace
// the exact drop shape from memory and risk it reading as *wrong*
// instead of just simplified.
export function CanvaGlyph() {
  return (
    <span aria-hidden="true" className="font-sans text-[19px] leading-none font-bold text-white">
      C
    </span>
  );
}

// Classic Microsoft four-square mark — used over the newer Microsoft 365
// "flower" icon since this one is unambiguous and safely reproduced
// (four solid squares, well-documented official colors) rather than
// risking an inaccurate trace of the more organic current logo.
export function Microsoft365Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
