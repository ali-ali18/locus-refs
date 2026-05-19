import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { LinkPreview } from "../ui/link-preview";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

const PRODUCT_LINKS = [
  { label: "Documentação", href: "/docs" },
  { label: "Funcionalidades", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
];

const COMMUNITY_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ali-ali18/locus-refs",
    external: true,
  },
  {
    label: "Issues",
    href: "https://github.com/ali-ali18/locus-refs/issues",
    external: true,
  },
  {
    label: "Discussões",
    href: "https://github.com/ali-ali18/locus-refs/discussions",
    external: true,
  },
];

const LEGAL_LINKS = [
  { label: "Termos de uso", href: "/terms" },
  { label: "Privacidade", href: "/privacy" },
];

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

function FooterGroup({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-3 not-last:border-r pt-6 min-h-[20vh]">
      <span className="text-xs font-semibold text-foreground">{title}</span>
      <ul className="flex flex-col gap-2 ">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              {link.label}
              {link.external && <span aria-hidden>↗</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContainerFooter() {
  return (
    <LandingWrapper>
      <ContentFooter />
    </LandingWrapper>
  );
}

function ContentFooter() {
  return (
    <LandingContent as="footer">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4  border-b -mr-3 -ml-3.5 px-4">
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-3 border-r">
          <div className="py-6 col-span-2 sm:col-span-1 flex flex-col gap-3">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Colete, organize e disponibilize conhecimento para todo o time.
            </p>
          </div>
        </div>

        <FooterGroup title="Produto" links={PRODUCT_LINKS} />
        <FooterGroup title="Comunidade" links={COMMUNITY_LINKS} />
        <FooterGroup title="Legal" links={LEGAL_LINKS} />
      </div>

      <div className="flex items-center justify-between py-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Locus. Open Source.</span>
        <span className="inline-flex items-center justify-center gap-1">
          Desenvolvido por {""}
          <LinkPreview url="https://github.com/ali-ali18" quality={60}>
            Ali
          </LinkPreview>
        </span>
      </div>
    </LandingContent>
  );
}
