import Image from "next/image";
import Link from "next/link";
import blackLogo from "@/assets/footer/blacklogo.svg";
import linkedinIcon from "@/assets/footer/linkedin.svg";

// Figma dev-mode inspect: "Rectangle 34" frame, 1512x285, border-top 1px
// solid #E7E9EB, background #FFF. Labels (Email/Social/Menu) are Inter
// 24px regular #9AA1AF; all content below them (address, LinkedIn icon,
// nav links) is Inter 24px regular #000 — everything here is weight 400,
// nothing bold. Logo sits at x=68, matching the lg:px-[68px] side padding
// already used by every other section, so it's reused here too. Column
// gaps use flexbox distribution rather than the Figma frame's exact
// (non-uniform) px gaps, same tradeoff already made in ExperienceRow.
const LABEL_CLASS = "font-sans text-[16px] font-normal text-[#9AA1AF]";
const CONTENT_CLASS = "font-sans text-[16px] font-normal text-black";

export function Footer() {
  return (
    <footer
      data-nav-theme="light"
      className="border-t border-[#E7E9EB] bg-white px-5 py-7 sm:px-8 lg:px-[68px] lg:py-12"
    >
      <div className="flex flex-col gap-7 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <Image src={blackLogo} alt="Tina Le" width={51} height={43} />

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
    </footer>
  );
}
