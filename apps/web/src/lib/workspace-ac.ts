import { createAccessControl } from "better-auth/plugins/access";
import { workspaceStatements } from "@refstash/shared";
import {
  adminPermissions,
  memberPermissions,
  ownerPermissions,
} from "./workspace-access";

export const workspaceAc = createAccessControl(workspaceStatements);

export const workspaceRoles = {
  owner: workspaceAc.newRole(ownerPermissions),
  admin: workspaceAc.newRole(adminPermissions),
  member: workspaceAc.newRole(memberPermissions),
};
