import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";

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

  const footer = (
    <Text
      style={{ margin: 0, fontSize: 12, color: "#a09a91", lineHeight: "18px" }}
    >
      Você está recebendo este email porque se cadastrou no Locus. O código
      expira em{" "}
      <strong style={{ color: "#57524a" }}>{expiresInMinutes} minutos</strong>.
      Caso não tenha solicitado, descarte este email.
    </Text>
  );

  return (
    <EmailLayout
      preview={`${firstName}, confirme seu email no Locus`}
      orgName="Locus"
      footer={footer}
    >
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
          className="em-btn"
          style={{
            backgroundColor: "#3d3a2e",
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
    </EmailLayout>
  );
}