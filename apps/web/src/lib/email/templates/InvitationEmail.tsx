import { Button, Img, Section, Text } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";

interface InvitationEmailProps {
  inviterName: string;
  inviterImage?: string | null;
  organizationName: string;
  organizationLogo?: string | null;
  role: string;
  acceptUrl: string;
}

function isImageUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("/storage/")
  );
}

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    owner: "proprietário",
    admin: "administrador",
    member: "membro",
  };
  return map[role] ?? role;
}

export function InvitationEmail({
  inviterName,
  inviterImage,
  organizationName,
  organizationLogo,
  role,
  acceptUrl,
}: InvitationEmailProps) {
  const firstName = inviterName.split(" ")[0];
  const initial = inviterName.charAt(0).toUpperCase();
  const hasAvatar = isImageUrl(inviterImage);

  const footer = (
    <Text style={{ margin: 0, fontSize: 12, color: "#a09a91", lineHeight: "18px" }}>
      Você está recebendo este email porque{" "}
      <strong style={{ color: "#57524a" }}>{inviterName}</strong> enviou um
      convite para este endereço. Caso não reconheça o remetente ou não tenha
      interesse, descarte este email. O link expira em{" "}
      <strong style={{ color: "#57524a" }}>48 horas</strong>.
    </Text>
  );

  return (
    <EmailLayout
      preview={`${firstName} convidou você para ${organizationName}`}
      orgName={organizationName}
      orgLogo={organizationLogo}
      footer={footer}
    >
      {/* Avatar */}
      <Section style={{ textAlign: "center", marginBottom: 24 }}>
        {hasAvatar ? (
          <Img
            src={inviterImage as string}
            width={56}
            height={56}
            alt={inviterName}
            style={{ borderRadius: "50%", display: "inline-block" }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#3d3a2e",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 600,
              color: "#faf9f7",
              lineHeight: "56px",
              textAlign: "center",
            }}
          >
            {initial}
          </div>
        )}
      </Section>

      {/* Message */}
      <Text
        style={{
          margin: "0 0 8px",
          fontSize: 20,
          fontWeight: 600,
          color: "#1c1a16",
          textAlign: "center",
        }}
      >
        Olá! 👋
      </Text>
      <Text
        style={{
          margin: "0 0 20px",
          fontSize: 15,
          color: "#57524a",
          lineHeight: "24px",
          textAlign: "center",
        }}
      >
        <strong style={{ color: "#1c1a16" }}>{inviterName}</strong> convidou
        você para se juntar ao workspace{" "}
        <strong style={{ color: "#1c1a16" }}>{organizationName}</strong>.
      </Text>

      {/* Role badge */}
      <Section style={{ textAlign: "center", marginBottom: 28 }}>
        <Text
          style={{
            display: "inline-block",
            margin: 0,
            padding: "6px 14px",
            backgroundColor: "#ece8e0",
            borderRadius: 999,
            fontSize: 13,
            color: "#57524a",
          }}
        >
          Função: <strong style={{ color: "#1c1a16" }}>{roleLabel(role)}</strong>
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" }}>
        <Button
          href={acceptUrl}
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
          Aceitar convite
        </Button>
      </Section>
    </EmailLayout>
  );
}
