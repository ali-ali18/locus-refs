import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  isWorkspaceAdmin,
  requireWorkspaceAccess,
} from "@/server/requireSession";
import { updateSchema } from "@/types/schema/skill.schema";

function canManageSkill(
  skill: { userId: string; visibility: string; workspaceId: string | null },
  userId: string,
  workspaceId: string,
  memberRole: string,
): boolean {
  if (skill.userId === userId) return true;
  return (
    skill.visibility === "workspace" &&
    skill.workspaceId === workspaceId &&
    isWorkspaceAdmin(memberRole)
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId, memberRole } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

    const existing = await prisma.agentSkill.findFirst({
      where: { id },
    });
    if (
      !existing ||
      !canManageSkill(existing, userId, workspaceId, memberRole)
    ) {
      return NextResponse.json(
        { error: "Skill not found", code: "SKILL_NOT_FOUND" },
        { status: 404 },
      );
    }

    // Só o dono edita skill personal; admin pode editar workspace.
    if (existing.visibility === "personal" && existing.userId !== userId) {
      return NextResponse.json(
        { error: "Skill not found", code: "SKILL_NOT_FOUND" },
        { status: 404 },
      );
    }

    const visibility = parsed.data.visibility ?? existing.visibility;
    // Não permitir que admin "pegue" skill personal de outro via change visibility
    if (
      existing.userId !== userId &&
      (visibility === "personal" || existing.visibility === "personal")
    ) {
      return NextResponse.json(
        { error: "Skill not found", code: "SKILL_NOT_FOUND" },
        { status: 404 },
      );
    }

    const skill = await prisma.agentSkill.update({
      where: { id },
      data: {
        ...parsed.data,
        workspaceId: visibility === "workspace" ? workspaceId : null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ message: "Skill updated", data: skill });
  } catch (error) {
    console.error("[PATCH /api/ai/skills/:id]", error);
    return NextResponse.json(
      { error: "Failed to update skill", code: "FAILED_TO_UPDATE_SKILL" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { session, workspaceId, memberRole } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const existing = await prisma.agentSkill.findFirst({
      where: { id },
    });
    if (
      !existing ||
      !canManageSkill(existing, userId, workspaceId, memberRole)
    ) {
      return NextResponse.json(
        { error: "Skill not found", code: "SKILL_NOT_FOUND" },
        { status: 404 },
      );
    }

    // Personal de outro user nunca
    if (existing.visibility === "personal" && existing.userId !== userId) {
      return NextResponse.json(
        { error: "Skill not found", code: "SKILL_NOT_FOUND" },
        { status: 404 },
      );
    }

    await prisma.agentSkill.delete({ where: { id } });
    return NextResponse.json({ message: "Skill deleted" });
  } catch (error) {
    console.error("[DELETE /api/ai/skills/:id]", error);
    return NextResponse.json(
      { error: "Failed to delete skill", code: "FAILED_TO_DELETE_SKILL" },
      { status: 500 },
    );
  }
}
