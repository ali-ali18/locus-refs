import "server-only";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "./getSession";

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireSessionApiOrThrow() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

type WorkspaceAccessResult =
  | { session: NonNullable<Awaited<ReturnType<typeof getSession>>>; workspaceId: string }
  | { error: NextResponse };

export async function requireWorkspaceAccess(request: NextRequest): Promise<WorkspaceAccessResult> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const workspaceId = request.headers.get("x-workspace-id");
  if (!workspaceId) {
    return { error: NextResponse.json({ error: "Missing workspace" }, { status: 400 }) };
  }

  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id },
  });
  if (!member) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session, workspaceId };
}
