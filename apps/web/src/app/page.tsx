import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/server/getSession";

export default async function RootPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const member = await prisma.member.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });

  if (!member) {
    redirect("/workspace/new");
  }

  redirect(`/${member.organization.slug}`);
}
