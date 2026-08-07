import "server-only";
import type { WorkspacePermission } from "@refstash/shared";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { workspaceRoles } from "@/lib/workspace-ac";
import {
  requireWorkspaceAccess,
  type WorkspaceAccessResult,
} from "./requireSession";

export type { WorkspaceAccessResult };

function forbiddenResponse() {
  return NextResponse.json(
    { error: "Forbidden", code: "FORBIDDEN" },
    { status: 403 },
  );
}

/**
 * Garante membership + permissão Better Auth (roles base + dinâmicos).
 */
export async function requireWorkspacePermission(
  request: NextRequest,
  permissions: WorkspacePermission,
): Promise<WorkspaceAccessResult> {
  const access = await requireWorkspaceAccess(request);
  if ("error" in access) return access;

  const { workspaceId } = access;
  const result = await auth.api.hasPermission({
    headers: request.headers,
    body: {
      organizationId: workspaceId,
      permissions,
    },
  });

  if (!result?.success) {
    return { error: forbiddenResponse() };
  }

  return access;
}

/**
 * Checagem local para roles base (owner/admin/member).
 */
export function roleHasPermission(
  role: string,
  permissions: WorkspacePermission,
): boolean {
  const baseRole = workspaceRoles[role as keyof typeof workspaceRoles];
  if (!baseRole) return false;

  return Object.entries(permissions).every(([resource, actions]) => {
    if (!actions?.length) return true;
    return actions.every((action) =>
      baseRole.authorize({ [resource]: [action] }).success,
    );
  });
}

/**
 * Para contextos sem Request (tools de IA): consulta o role do membro e
 * checa permissões (base ou OrganizationRole customizado).
 */
export async function canInWorkspace(
  workspaceId: string,
  userId: string,
  permissions: WorkspacePermission,
): Promise<boolean> {
  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId },
    select: { role: true },
  });
  if (!member) return false;

  if (roleHasPermission(member.role, permissions)) {
    return true;
  }

  const customRole = await prisma.organizationRole.findFirst({
    where: { organizationId: workspaceId, role: member.role },
    select: { permission: true },
  });
  if (!customRole) return false;

  let granted: Record<string, string[]>;
  try {
    granted = JSON.parse(customRole.permission) as Record<string, string[]>;
  } catch {
    return false;
  }

  return Object.entries(permissions).every(([resource, actions]) => {
    if (!actions?.length) return true;
    const allowed = granted[resource] ?? [];
    return actions.every((action) => allowed.includes(action));
  });
}
