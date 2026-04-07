import {
  Body,
  Column,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  preview: string;
  orgName: string;
  orgLogo?: string | null;
  children: ReactNode;
  footer?: ReactNode;
}

function isLogoUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("/storage/")
  );
}

// Light tokens (globals.css oklch → hex)
// secondary bg: #ece8e0 | fg: #1c1a16 | border: #ddd8cf | muted: #57524a
// Dark tokens:
// secondary bg: #2b2720 | fg: #ebe7e0 | border: #2e2b25 | muted: #8c8579

const darkModeStyles = `
  @media (prefers-color-scheme: dark) {
    .em-header  { background-color: #2b2720 !important; border-color: #2e2b25 !important; }
    .em-org-name { color: #ebe7e0 !important; }
    .em-body    { background-color: #1c1915 !important; }
    .em-content h1,
    .em-content h2 { color: #ebe7e0 !important; }
    .em-content p   { color: #a09a91 !important; }
    .em-content strong { color: #ebe7e0 !important; }
    .em-btn     { background-color: #c8bfad !important; color: #1c1915 !important; }
    .em-footer  { border-color: #2e2b25 !important; }
    .em-footer p { color: #5c5750 !important; }
  }
`;

export function EmailLayout({ preview, orgName, orgLogo, children, footer }: EmailLayoutProps) {
  const hasLogo = isLogoUrl(orgLogo);

  return (
    <Tailwind>
      <Html lang="pt-BR">
        <Head>
          <style>{darkModeStyles}</style>
        </Head>
        <Preview>{preview}</Preview>
        <Body
          className="em-body"
          style={{
            backgroundColor: "#faf9f7",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            margin: 0,
            padding: 0,
          }}
        >
          {/* Header — secondary bg */}
          <Section
            className="em-header"
            style={{
              backgroundColor: "#ece8e0",
              borderBottom: "1px solid #ddd8cf",
              padding: "16px 32px",
            }}
          >
            <Row>
              {hasLogo && (
                <Column style={{ width: 32 }}>
                  <Img
                    src={orgLogo as string}
                    width={32}
                    height={32}
                    alt={orgName}
                    style={{ borderRadius: 10 }}
                  />
                </Column>
              )}
              <Column style={{ paddingLeft: hasLogo ? 10 : 0 }}>
                <Text
                  className="em-org-name"
                  style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1c1a16" }}
                >
                  {orgName}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Content */}
          <Section
            className="em-content"
            style={{ maxWidth: 512, margin: "0 auto", padding: "40px 32px 32px" }}
          >
            {children}
          </Section>

          {/* Footer */}
          {footer && (
            <Section
              className="em-footer"
              style={{
                maxWidth: 512,
                margin: "0 auto",
                padding: "20px 32px 40px",
                borderTop: "1px solid #ddd8cf",
              }}
            >
              {footer}
            </Section>
          )}
        </Body>
      </Html>
    </Tailwind>
  );
}
