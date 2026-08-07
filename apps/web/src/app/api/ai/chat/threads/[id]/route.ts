import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  canDeleteAgentThread,
  canReadAgentThread,
  canShareAgentThread,
  canWriteAgentThread,
  toAgentThreadSummary,
} from "@/lib/ai/agent-thread-acl";
import prisma from "@/lib/prisma";
import { canInWorkspace, requireWorkspacePermission } from "@/server/permissions";

const putSchema = z.object({
  messages: z.array(z.unknown()),
  title: z.string().trim().max(120).optional().nullable(),
});

const patchSchema = z.object({
  visibility: z.literal("workspace"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, {
    agentThread: ["read"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const canDeleteAny = await canInWorkspace(workspaceId, userId, {
      agentThread: ["delete"],
    });

    const thread = await prisma.agentThread.findFirst({
      where: { id, workspaceId },
      include: { createdBy: { select: { name: true } } },
    });
    if (!thread || !canReadAgentThread(thread, userId)) {
      return NextResponse.json(
        { error: "Thread not found", code: "THREAD_NOT_FOUND" },
        { status: 404 },
      );
    }

    await prisma.agentThread.update({
      where: { id: thread.id },
      data: { lastOpenedAt: new Date() },
    });

    return NextResponse.json({
      data: {
        ...toAgentThreadSummary(thread, userId, canDeleteAny),
        messages: thread.messages,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to get thread", code: "FAILED_TO_GET_THREAD" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, {
    agentThread: ["update"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const canDeleteAny = await canInWorkspace(workspaceId, userId, {
      agentThread: ["delete"],
    });

    const parsed = putSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

    const thread = await prisma.agentThread.findFirst({
      where: { id, workspaceId },
    });
    if (!thread || !canWriteAgentThread(thread, userId)) {
      return NextResponse.json(
        { error: "Thread not found", code: "THREAD_NOT_FOUND" },
        { status: 404 },
      );
    }

    const updated = await prisma.agentThread.update({
      where: { id: thread.id },
      data: {
        messages: parsed.data.messages as object[],
        ...(parsed.data.title !== undefined
          ? { title: parsed.data.title }
          : {}),
      },
      include: { createdBy: { select: { name: true } } },
    });

    return NextResponse.json({
      message: "Thread saved",
      data: toAgentThreadSummary(updated, userId, canDeleteAny),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to save thread", code: "FAILED_TO_SAVE_THREAD" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, {
    agentThread: ["share"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const canDeleteAny = await canInWorkspace(workspaceId, userId, {
      agentThread: ["delete"],
    });

    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", code: "INVALID_BODY" },
        { status: 400 },
      );
    }

    const thread = await prisma.agentThread.findFirst({
      where: { id, workspaceId },
    });
    if (!thread || !canReadAgentThread(thread, userId)) {
      return NextResponse.json(
        { error: "Thread not found", code: "THREAD_NOT_FOUND" },
        { status: 404 },
      );
    }
    if (!canShareAgentThread(thread, userId)) {
      return NextResponse.json(
        { error: "Cannot share this thread", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const updated = await prisma.agentThread.update({
      where: { id: thread.id },
      data: { visibility: "workspace" },
      include: { createdBy: { select: { name: true } } },
    });

    return NextResponse.json({
      message: "Thread shared with workspace",
      data: toAgentThreadSummary(updated, userId, canDeleteAny),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to share thread", code: "FAILED_TO_SHARE_THREAD" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireWorkspacePermission(request, {
    agentThread: ["read"],
  });
  if ("error" in auth) return auth.error;
  const { session, workspaceId } = auth;
  const userId = session.user.id;
  const { id } = await params;

  try {
    const canDeleteAny = await canInWorkspace(workspaceId, userId, {
      agentThread: ["delete"],
    });

    const thread = await prisma.agentThread.findFirst({
      where: { id, workspaceId },
    });
    if (!thread || !canReadAgentThread(thread, userId)) {
      return NextResponse.json(
        { error: "Thread not found", code: "THREAD_NOT_FOUND" },
        { status: 404 },
      );
    }
    if (!canDeleteAgentThread(thread, userId, canDeleteAny)) {
      return NextResponse.json(
        { error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    await prisma.agentThread.delete({ where: { id: thread.id } });

    return NextResponse.json({ message: "Thread deleted" });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete thread", code: "FAILED_TO_DELETE_THREAD" },
      { status: 500 },
    );
  }
}
