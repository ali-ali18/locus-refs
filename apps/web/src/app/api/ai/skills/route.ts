import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireWorkspacePermission } from "@/server/permissions";
import { createSchema } from "@/types/schema/skill.schema";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    agentSkill: ["read"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;

  try {
    const skills = await prisma.agentSkill.findMany({
      where: {
        OR: [
          { visibility: "personal", userId },
          { visibility: "workspace", workspaceId },
        ],
      },
      orderBy: { updatedAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error("[GET /api/ai/skills]", error);
    return NextResponse.json(
      { error: "Failed to fetch skills", code: "FAILED_TO_FETCH_SKILLS" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    agentSkill: ["create"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;

  try {
    const parsed = createSchema.safeParse(await request.json());

    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid skill data", code: "INVALID_SKILL_DATA" },
        { status: 400 },
      );

    const skill = await prisma.agentSkill.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        prompt: parsed.data.prompt,
        requiresNote: parsed.data.requiresNote,
        visibility: parsed.data.visibility,
        userId,
        workspaceId:
          parsed.data.visibility === "workspace" ? workspaceId : null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(
      { message: "Skill created", data: skill },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/ai/skills]", error);
    return NextResponse.json(
      { error: "Failed to create skill", code: "FAILED_TO_CREATE_SKILL" },
      { status: 500 },
    );
  }
}
