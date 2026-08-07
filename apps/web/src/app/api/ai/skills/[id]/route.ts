import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { canInWorkspace, requireWorkspacePermission } from "@/server/permissions";
import { updateSchema } from "@/types/schema/skill.schema";

async function canManageSkill(
  skill: { userId: string; visibility: string; workspaceId: string | null },
  userId: string,
  workspaceId: string,
): Promise<boolean> {
  if (skill.userId === userId) return true;
  if (skill.visibility !== "workspace" || skill.workspaceId !== workspaceId) {
    return false;
  }
  return canInWorkspace(workspaceId, userId, {
    agentSkill: ["shareWorkspace"],
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, {
    agentSkill: ["update"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
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
      !(await canManageSkill(existing, userId, workspaceId))
    ) {
      return NextResponse.json(
        { error: "Skill not found", code: "SKILL_NOT_FOUND" },
        { status: 404 },
      );
    }

    // Só o dono edita skill personal; quem tem shareWorkspace pode editar workspace.
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
  const auth = await requireWorkspacePermission(request, {
    agentSkill: ["delete"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const existing = await prisma.agentSkill.findFirst({
      where: { id },
    });
    if (
      !existing ||
      !(await canManageSkill(existing, userId, workspaceId))
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
