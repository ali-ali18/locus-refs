import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";

interface VerifyEmailOtpProps {
  name: string;
  otp: string;
  appUrl?: string;
  expiresInMinutes?: number;
}

export function VerifyEmailOtp({
  name,
  otp,
  appUrl,
  expiresInMinutes = 10,
}: VerifyEmailOtpProps) {
  const firstName = name.split(" ")[0] || "Olá";
  const homeUrl =
    appUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://locus.com.br";

  const footer = (
    <Text
      style={{ margin: 0, fontSize: 12, color: "#72706b", lineHeight: "18px" }}
    >
      Você está recebendo este email porque se cadastrou no Locus. O código
      expira em{" "}
      <strong style={{ color: "#1d1c17" }}>{expiresInMinutes} minutos</strong>.
      Caso não tenha solicitado, descarte este email.
    </Text>
  );

  return (
    <EmailLayout
      preview={`${firstName}, confirme seu email no Locus`}
      footer={footer}
    >
      <Heading
        as="h1"
        style={{
          margin: "0 0 12px",
          fontSize: 24,
          fontWeight: 600,
          color: "#1d1c17",
          textAlign: "center",
        }}
      >
        Confirme seu email
      </Heading>

      <Text
        style={{
          margin: "0 0 28px",
          fontSize: 15,
          color: "#72706b",
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
          backgroundColor: "#e6e6e4",
          borderRadius: 12,
          border: "1px solid #e4e4e2",
        }}
      >
        <Text
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.4em",
            color: "#1d1c17",
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
          }}
        >
          {otp}
        </Text>
      </Section>

      <Text
        style={{
          margin: "0 0 24px",
          fontSize: 13,
          color: "#72706b",
          lineHeight: "20px",
          textAlign: "center",
        }}
      >
        Este código expira em {expiresInMinutes} minutos. Se você não fez essa
        solicitação, ignore este email.
      </Text>

      <Section style={{ textAlign: "center" }}>
        <Button
          href={homeUrl}
          style={{
            backgroundColor: "#0945ed",
            color: "#ffffff",
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
    </EmailLayout>
  );
}
