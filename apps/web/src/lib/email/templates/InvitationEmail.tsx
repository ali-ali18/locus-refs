import { Button, Img, Section, Text } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { toAbsoluteUrl } from "../to-absolute-url";

interface InvitationEmailProps {
  inviterName: string;
  inviterImage?: string | null;
  organizationName: string;
  memberRole: string;
  acceptUrl: string;
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
  memberRole,
  acceptUrl,
}: InvitationEmailProps) {
  const firstName = inviterName.split(" ")[0];
  const initial = inviterName.charAt(0).toUpperCase();
  const avatarUrl = toAbsoluteUrl(inviterImage);

  const footer = (
    <Text
      style={{ margin: 0, fontSize: 12, color: "#72706b", lineHeight: "18px" }}
    >
      Você está recebendo este email porque{" "}
      <strong style={{ color: "#1d1c17" }}>{inviterName}</strong> enviou um
      convite para este endereço. Caso não reconheça o remetente ou não tenha
      interesse, descarte este email. O link expira em{" "}
      <strong style={{ color: "#1d1c17" }}>48 horas</strong>.
    </Text>
  );

  return (
    <EmailLayout
      preview={`${firstName} convidou você para ${organizationName}`}
      footer={footer}
    >
      {/* Avatar */}
      <Section style={{ textAlign: "center", marginBottom: 24 }}>
        {avatarUrl ? (
          <Img
            src={avatarUrl}
            width={56}
            height={56}
            alt={inviterName}
            style={{ borderRadius: "50%", display: "inline-block" }}
          />
        ) : (
          <table
            cellPadding={0}
            cellSpacing={0}
            border={0}
            style={{ margin: "0 auto" }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "#1d1c17",
                    textAlign: "center",
                    verticalAlign: "middle",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#ffffff",
                    lineHeight: "56px",
                  }}
                >
                  {initial}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Section>

      {/* Message */}
      <Text
        style={{
          margin: "0 0 8px",
          fontSize: 20,
          fontWeight: 600,
          color: "#1d1c17",
          textAlign: "center",
        }}
      >
        Olá! 👋
      </Text>
      <Text
        style={{
          margin: "0 0 20px",
          fontSize: 15,
          color: "#72706b",
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
            backgroundColor: "#e6e6e4",
            borderRadius: 999,
            fontSize: 13,
            color: "#72706b",
          }}
        >
          Função:{" "}
          <strong style={{ color: "#1c1a16" }}>{roleLabel(memberRole)}</strong>
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ textAlign: "center" }}>
        <Button
          href={acceptUrl}
          className="em-btn"
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
          Aceitar convite
        </Button>
      </Section>
    </EmailLayout>
  );
}
