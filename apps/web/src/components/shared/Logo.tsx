import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  href?: string;
  name?: string;
}

export function Logo({ className, href, name = "locus" }: Props) {
  const LogoIcon = (
    <svg
      viewBox="0 0 48 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8", className)}
    >
      <title>{name}</title>
      <path
        opacity="0.8"
        d="M22.8781 0L0 15.1091L0 15.1376L17.6909 26.8148L22.8781 23.3828V0Z"
        fill="currentColor"
        fillOpacity="0.82"
      />
      <path
        opacity="0.8"
        d="M0 38.5346L22.8781 53.6293V30.2466L17.6909 26.8147L0 38.4918L0 38.5346Z"
        fill="currentColor"
        fillOpacity="0.82"
      />
      <path
        opacity="0.8"
        d="M47.9994 15.4797L25.1216 0.370544V23.7533L30.3231 27.1852L47.9994 15.5081V15.4797Z"
        fill="currentColor"
        fillOpacity="0.82"
      />
      <path
        opacity="0.8"
        d="M25.1216 54L47.9994 38.8907V38.8622L30.3231 27.1851L25.1216 30.617V54Z"
        fill="currentColor"
        fillOpacity="0.82"
      />
      <path
        opacity="0.8"
        d="M0 15.1376L0 38.4919L17.6909 26.8148L0 15.1376Z"
        fill="currentColor"
      />
      <path
        opacity="0.8"
        d="M47.9999 38.8623V15.508L30.323 27.1852L47.9999 38.8623Z"
        fill="currentColor"
      />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {LogoIcon}
      </Link>
    );
  }

  return LogoIcon;
}
