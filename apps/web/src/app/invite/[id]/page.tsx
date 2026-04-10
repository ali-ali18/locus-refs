import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/server/getSession";
import { InvitePageClient } from "./InvitePageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { id } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
    },
  });

  if (!invitation) notFound();

  const [organization, memberCount] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: invitation.organizationId },
      select: { name: true, slug: true, logo: true },
    }),
    prisma.member.count({
      where: { organizationId: invitation.organizationId },
    }),
  ]);

  if (!organization) notFound();

  const session = await getSession();

  return (
    <InvitePageClient
      invitation={{
        id: invitation.id,
        email: invitation.email,
        role: invitation.role ?? "member",
        status: invitation.status,
        expiresAt: invitation.expiresAt.toISOString(),
        inviterName: invitation.user.name,
        inviterImage: invitation.user.image ?? null,
        organizationName: organization.name,
        organizationSlug: organization.slug,
        organizationLogo: organization.logo,
        memberCount,
      }}
      sessionEmail={session?.user.email ?? null}
    />
  );
}
