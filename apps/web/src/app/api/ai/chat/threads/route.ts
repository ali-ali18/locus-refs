import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { toAgentThreadSummary } from "@/lib/ai/agent-thread-acl";
import prisma from "@/lib/prisma";
import { canInWorkspace, requireWorkspacePermission } from "@/server/permissions";

const createSchema = z.object({
  visibility: z.enum(["private", "workspace"]),
  title: z.string().trim().max(120).optional().nullable(),
});

export async function GET(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    agentThread: ["read"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;

  try {
    const canDeleteAny = await canInWorkspace(workspaceId, userId, {
      agentThread: ["delete"],
    });

    const threads = await prisma.agentThread.findMany({
      where: {
        workspaceId,
        OR: [
          { visibility: "workspace" },
          { visibility: "private", createdById: userId },
        ],
      },
      orderBy: [{ lastOpenedAt: "desc" }, { updatedAt: "desc" }],
      include: {
        createdBy: { select: { name: true } },
      },
    });

    return NextResponse.json({
      data: threads.map((thread) =>
        toAgentThreadSummary(thread, userId, canDeleteAny),
      ),
    });
  } catch (error) {
    console.error("[GET /api/ai/chat/threads]", error);
    return NextResponse.json(
      {
        error: "Failed to list threads",
        code: "FAILED_TO_LIST_THREADS",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspacePermission(request, {
    agentThread: ["create"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;

  try {
    const canDeleteAny = await canInWorkspace(workspaceId, userId, {
      agentThread: ["delete"],
    });

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

    const now = new Date();
    const title =
      parsed.data.title?.trim() ||
      (parsed.data.visibility === "workspace"
        ? "Conversa do workspace"
        : "Conversa privada");

    const thread = await prisma.agentThread.create({
      data: {
        workspaceId,
        createdById: userId,
        visibility: parsed.data.visibility,
        title,
        messages: [],
        lastOpenedAt: now,
      },
      include: {
        createdBy: { select: { name: true } },
      },
    });

    return NextResponse.json(
      {
        message: "Thread created",
        data: toAgentThreadSummary(thread, userId, canDeleteAny),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/ai/chat/threads]", error);
    return NextResponse.json(
      {
        error: "Failed to create thread",
        code: "FAILED_TO_CREATE_THREAD",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
