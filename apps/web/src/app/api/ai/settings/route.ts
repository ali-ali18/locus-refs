import { type NextRequest, NextResponse } from "next/server";
import { AI_MODELS, DEFAULT_MODEL_ID } from "@/lib/ai/models";
import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const settings = await prisma.workspaceAiSettings.upsert({
      where: { workspaceId },
      create: { workspaceId },
      update: {},
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[ai/settings GET]", error);
    return NextResponse.json(
      { error: "Failed to get AI settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  try {
    const { defaultModelId, systemPrompt, thinkingEnabled } =
      await request.json();

    if (
      defaultModelId !== undefined &&
      !AI_MODELS.some((m) => m.id === defaultModelId)
    ) {
      return NextResponse.json(
        { error: "Modelo inválido", code: "INVALID_MODEL" },
        { status: 400 },
      );
    }

    if (
      thinkingEnabled !== undefined &&
      typeof thinkingEnabled !== "boolean"
    ) {
      return NextResponse.json(
        { error: "thinkingEnabled inválido", code: "INVALID_THINKING" },
        { status: 400 },
      );
    }

    const settings = await prisma.workspaceAiSettings.upsert({
      where: { workspaceId },
      create: {
        workspaceId,
        defaultModelId: defaultModelId ?? DEFAULT_MODEL_ID,
        systemPrompt: systemPrompt ?? null,
        thinkingEnabled: thinkingEnabled ?? false,
      },
      update: {
        ...(defaultModelId !== undefined && { defaultModelId }),
        ...(systemPrompt !== undefined && { systemPrompt }),
        ...(thinkingEnabled !== undefined && { thinkingEnabled }),
      },
    });

    return NextResponse.json({ settings });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update AI settings" },
      { status: 500 },
    );
  }
}
