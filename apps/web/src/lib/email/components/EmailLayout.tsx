import {
  Body,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
  footer?: ReactNode;
}

const darkModeStyles = `
  @media (prefers-color-scheme: dark) {
    .em-body    { background-color: #17181c !important; }
    .em-content h1,
    .em-content h2 { color: #f8f8f7 !important; }
    .em-content p   { color: #94959b !important; }
    .em-content strong { color: #f8f8f7 !important; }
    .em-btn     { background-color: #1348dc !important; color: #f3f3f3 !important; }
    .em-footer  { border-color: #2a2c32 !important; }
    .em-footer p { color: #94959b !important; }
  }
`;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const LOGO_URL = `${APP_URL}/email/logo.svg`;

export function EmailLayout({ preview, children, footer }: EmailLayoutProps) {
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
            backgroundColor: "#fbfbfa",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            margin: 0,
            padding: 0,
          }}
        >
          {/* Header — logo only */}
          <Section
            className="em-header"
            style={{
              padding: "32px 32px 0",
            }}
          >
            <Img
              src={LOGO_URL}
              width={40}
              height={45}
              alt="Locus"
              style={{ display: "block" }}
            />
          </Section>

          {/* Content */}
          <Section
            className="em-content"
            style={{
              maxWidth: 512,
              margin: "0 auto",
              padding: "40px 32px 32px",
            }}
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
                borderTop: "1px solid #e4e4e2",
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
