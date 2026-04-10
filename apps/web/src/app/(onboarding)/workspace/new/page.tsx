import { redirect } from "next/navigation";
import { FormCreateWorkspace } from "@/components/workspace/FormCreateWorkspace";
import prisma from "@/lib/prisma";
import { requireSession } from "@/server/requireSession";

export default async function NewWorkspacePage() {
  const session = await requireSession();

  const existingMember = await prisma.member.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  if (existingMember) {
    redirect(`/${existingMember.organization.slug}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Crie seu workspace</h1>
          <p className="text-muted-foreground">
            Um workspace é onde você e sua equipe colaboram.
          </p>
        </div>
        <FormCreateWorkspace />
      </div>
    </div>
  );
}
