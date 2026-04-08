import type { ReactElement } from "react";
import { Resend } from "resend";

interface SendEmailProps {
  to: string;
  subject: string;
  react: ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) throw new Error("RESEND_API_KEY environment variable is not set");
  if (!fromEmail) throw new Error("RESEND_FROM_EMAIL environment variable is not set");

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    react,
  });
}
