import { type NextRequest, NextResponse } from "next/server";
import { getAvailableModels } from "@/lib/ai/models";
import { requireWorkspaceAccess } from "@/server/requireSession";

export async function GET(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;

  const models = getAvailableModels().map(
    ({ id, provider, label, description, metadata }) => ({
      id,
      provider,
      label,
      description,
      inputModalities: metadata?.inputModalities ?? ["text"],
      supportsThinking: metadata?.supportsThinking ?? false,
    }),
  );

  return NextResponse.json({ models });
}
