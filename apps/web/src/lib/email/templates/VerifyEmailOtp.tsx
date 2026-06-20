import { Body, Container, Head, Html, Preview, Section, Text } from "@react-email/components";
import { Button, Heading } from "@react-email/components";

interface VerifyEmailOtpProps {
  name: string;
  otp: string;
  expiresInMinutes?: number;
}

export function VerifyEmailOtp({
  name,
  otp,
  expiresInMinutes = 10,
}: VerifyEmailOtpProps) {
  const firstName = name.split(" ")[0] || "Olá";
  const formattedOtp = `${otp.slice(0, 3)}-${otp.slice(3)}`;

  return (
    <Html lang="pt-BR">
      <Head />
      <Preview>{`${firstName}, confirme seu email no Locus`}</Preview>
      <Body
        style={{
          backgroundColor: "#faf9f7",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: 512,
            margin: "0 auto",
            padding: "40px 32px 32px",
          }}
        >
          {/* Logo as minimal header — no bg, no border */}
          <Section style={{ textAlign: "left", marginBottom: 32 }}>
            <svg
              width="48"
              height="54"
              viewBox="0 0 48 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "inline-block" }}
            >
              <title>Locus</title>
              <path
                opacity="0.8"
                d="M22.8781 0L0 15.1091L0 15.1376L17.6909 26.8148L22.8781 23.3828V0Z"
                fill="#3d3a2e"
                fillOpacity="0.82"
              />
              <path
                opacity="0.8"
                d="M0 38.5346L22.8781 53.6293V30.2466L17.6909 26.8147L0 38.4918L0 38.5346Z"
                fill="#3d3a2e"
                fillOpacity="0.82"
              />
              <path
                opacity="0.8"
                d="M47.9994 15.4797L25.1216 0.370544V23.7533L30.3231 27.1852L47.9994 15.5081V15.4797Z"
                fill="#3d3a2e"
                fillOpacity="0.82"
              />
              <path
                opacity="0.8"
                d="M25.1216 54L47.9994 38.8907V38.8622L30.3231 27.1851L25.1216 30.617V54Z"
                fill="#3d3a2e"
                fillOpacity="0.82"
              />
              <path
                opacity="0.8"
                d="M0 15.1376L0 38.4919L17.6909 26.8148L0 15.1376Z"
                fill="#3d3a2e"
              />
              <path
                opacity="0.8"
                d="M47.9999 38.8623V15.508L30.323 27.1852L47.9999 38.8623Z"
                fill="#3d3a2e"
              />
            </svg>
          </Section>

          {/* Heading */}
          <Heading
            as="h1"
            style={{
              margin: "0 0 12px",
              fontSize: 24,
              fontWeight: 600,
              color: "#1c1a16",
              textAlign: "center",
            }}
          >
            Confirme seu email
          </Heading>

          <Text
            style={{
              margin: "0 0 28px",
              fontSize: 15,
              color: "#57524a",
              lineHeight: "24px",
              textAlign: "center",
            }}
          >
            Olá <strong style={{ color: "#1c1a16" }}>{firstName}</strong>, use o
            código abaixo para confirmar seu email e liberar o acesso ao convite.
          </Text>

          {/* OTP code */}
          <Section
            style={{
              textAlign: "center",
              marginBottom: 28,
              padding: "20px 16px",
              backgroundColor: "#ece8e0",
              borderRadius: 12,
              border: "1px solid #ddd8cf",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "0.4em",
                color: "#1c1a16",
                fontFamily:
                  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              {formattedOtp}
            </Text>
          </Section>

          <Text
            style={{
              margin: "0 0 24px",
              fontSize: 13,
              color: "#57524a",
              lineHeight: "20px",
              textAlign: "center",
            }}
          >
            Este código expira em {expiresInMinutes} minutos. Se você não fez essa
            solicitação, ignore este email.
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Button
              href="https://locus.com.br"
              style={{
                backgroundColor: "#0945ed",
                color: "#faf9f7",
                borderRadius: 10,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Abrir Locus
            </Button>
          </Section>
        </Container>

        {/* Footer */}
        <Container
          style={{
            maxWidth: 512,
            margin: "0 auto",
            padding: "20px 32px 40px",
          }}
        >
          <Text
            style={{
              margin: 0,
              fontSize: 12,
              color: "#a09a91",
              lineHeight: "18px",
            }}
          >
            Você está recebendo este email porque se cadastrou no Locus. O código
            expira em{" "}
            <strong style={{ color: "#57524a" }}>{expiresInMinutes} minutos</strong>.
            Caso não tenha solicitado, descarte este email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}