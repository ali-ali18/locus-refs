export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

export type WorkspaceMemberRole = "owner" | "admin" | "member";

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
  createdAt: string;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceMemberRole;
  status: "pending" | "accepted" | "rejected" | "canceled";
  expiresAt: string;
}
