import type { ReactElement } from "react";
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

const fromEmail = process.env.RESEND_FROM_EMAIL as string;
if (!fromEmail) {
  throw new Error("RESEND_FROM_EMAIL environment variable is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string;
  subject: string;
  react: ReactElement;
}
export async function sendEmail({ to, subject, react }: SendEmailProps) {
  await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    react,
  });
}
