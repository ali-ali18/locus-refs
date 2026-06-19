import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/server/getSession";
import { VerifyEmailPageClient } from "./VerifyEmailPageClient";

interface Props {
  searchParams: Promise<{ callbackURL?: string; email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { callbackURL, email: emailParam } = await searchParams;

  const session = await getSession();

  // User must be authenticated to verify — otherwise send to login.
  if (!session) {
    notFound();
  }

  const alreadyVerified = session.user.emailVerified === true;

  return (
    <VerifyEmailPageClient
      email={emailParam ?? session.user.email}
      alreadyVerified={alreadyVerified}
      callbackURL={callbackURL ?? null}
    />
  );
}