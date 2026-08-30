import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/icons/LogoMark";
import linkedinIcon from "@/assets/footer/linkedin.svg";

// Figma dev-mode inspect: "Rectangle 34" frame, 1512x285, border-top 1px
// solid #E7E9EB, background #FFF, originally light-mode. Switched to the
// dark palette per request — background/border flipped to match Hero's
// dark section (#262626), content text flipped from black to white.
// Labels (Email/Social/Menu) keep their original #9AA1AF — already a
// mid-tone gray that reads fine on either background. Logo uses the same
// LogoMark component NavBar uses for its own dark/light swap
// (fill="currentColor", recolored via a text-color class) rather than the
// flat black blacklogo.svg image, which would be invisible on a dark bg.
// Logo sits at x=68, matching the lg:px-[68px] side padding already used
// by every other section, so it's reused here too. Column gaps use
// flexbox distribution rather than the Figma frame's exact (non-uniform)
// px gaps, same tradeoff already made in ExperienceRow.
const LABEL_CLASS = "font-sans text-[16px] font-normal text-[#9AA1AF]";
const CONTENT_CLASS = "font-sans text-[16px] font-normal text-white";

export function Footer() {
  return (
    <footer
      data-nav-theme="dark"
      className="border-t border-white/10 bg-[#262626] px-5 py-7 sm:px-8 lg:px-[68px] lg:py-12"
    >
      <div className="flex flex-col gap-7 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <LogoMark width={51} height={39} className="text-white" />

        <div>
          <p className={LABEL_CLASS}>Email</p>
          <a href="mailto:tinanle225@gmail.com" className={`mt-1 block ${CONTENT_CLASS}`}>
            tinanle225@gmail.com
          </a>
        </div>

        <div>
          <p className={LABEL_CLASS}>Social</p>
          <a
            href="https://www.linkedin.com/in/tina-le-aab63a296"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block"
          >
            <Image src={linkedinIcon} alt="LinkedIn" width={23} height={23} />
          </a>
        </div>

        <div>
          <p className={LABEL_CLASS}>Menu</p>
          <div className="mt-1 flex gap-9">
            <Link href="/" className={CONTENT_CLASS}>
              Home
            </Link>
            <Link href="/work" className={CONTENT_CLASS}>
              Work
            </Link>
          </div>
          <Link href="/about" className={`mt-1 block ${CONTENT_CLASS}`}>
            About
          </Link>
        </div>
      </div>

      <p className="mt-4 font-sans text-[13px] font-normal text-[#9AA1AF] lg:mt-6">
        &copy; 2026 Tina Le
        <br />
        All Rights Reserved.
      </p>
    </footer>
  );
}
