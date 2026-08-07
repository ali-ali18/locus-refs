import { describe, expect, it } from "vitest";
import {
  adminPermissions,
  memberPermissions,
  ownerPermissions,
} from "./workspace-access";
import { workspaceRoles } from "./workspace-ac";

function authorize(
  role: keyof typeof workspaceRoles,
  permissions: Record<string, string[]>,
) {
  return workspaceRoles[role].authorize(permissions).success;
}

describe("workspace base roles", () => {
  it("owner can delete workspace and manage roles", () => {
    expect(authorize("owner", { organization: ["delete"] })).toBe(true);
    expect(authorize("owner", { ac: ["create"] })).toBe(true);
    expect(authorize("owner", ownerPermissions as Record<string, string[]>)).toBe(
      true,
    );
  });

  it("admin cannot delete workspace but can update it and manage roles", () => {
    expect(authorize("admin", { organization: ["delete"] })).toBe(false);
    expect(authorize("admin", { organization: ["update"] })).toBe(true);
    expect(authorize("admin", { ac: ["create"] })).toBe(true);
    expect(authorize("admin", { aiSettings: ["update"] })).toBe(true);
    expect(authorize("admin", { member: ["create"] })).toBe(true);
  });

  it("member can CRUD notes but cannot update ai settings or manage members", () => {
    expect(authorize("member", { note: ["create"] })).toBe(true);
    expect(authorize("member", { note: ["delete"] })).toBe(true);
    expect(authorize("member", { collection: ["create"] })).toBe(true);
    expect(authorize("member", { aiSettings: ["update"] })).toBe(false);
    expect(authorize("member", { aiSettings: ["read"] })).toBe(true);
    expect(authorize("member", { member: ["create"] })).toBe(false);
    expect(authorize("member", { invitation: ["create"] })).toBe(false);
    expect(authorize("member", { ac: ["create"] })).toBe(false);
    expect(authorize("member", { workspaceSettings: ["update"] })).toBe(false);
  });

  it("member cannot update/delete boards or delete kanban", () => {
    expect(authorize("member", { board: ["create"] })).toBe(true);
    expect(authorize("member", { board: ["update"] })).toBe(false);
    expect(authorize("member", { board: ["delete"] })).toBe(false);
    expect(authorize("member", { kanban: ["update"] })).toBe(true);
    expect(authorize("member", { kanban: ["delete"] })).toBe(false);
  });

  it("member cannot manage workspace calendar events", () => {
    expect(authorize("member", { calendar: ["create"] })).toBe(true);
    expect(authorize("member", { calendar: ["manageWorkspace"] })).toBe(false);
    expect(authorize("admin", { calendar: ["manageWorkspace"] })).toBe(true);
  });

  it("exported permission maps match role behavior", () => {
    expect(memberPermissions.note).toContain("create");
    expect(memberPermissions.aiSettings).toEqual(["read"]);
    expect(adminPermissions.organization).toEqual(["update"]);
    expect(ownerPermissions.organization).toContain("delete");
  });
});
