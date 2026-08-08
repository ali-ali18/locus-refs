"use client";

import {
  ArrowDown01Icon,
  BubbleChatIcon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Config,
  DashboardSquare01Icon,
  Folder01FreeIcons,
  KanbanIcon,
  Link01Icon,
  Note01FreeIcons,
  Search01Icon,
  Settings01Icon,
  Tag01Icon,
  UserEdit01Icon,
  UserGroupIcon,
  UserListFreeIcons,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { WorkspacePermission, WorkspaceResource } from "@refstash/shared";
import {
  isEditablePermissionResource,
  PERMISSION_ACTION_LABELS,
  PERMISSION_RESOURCE_LABELS,
  workspaceStatements,
} from "@refstash/shared";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Toggle } from "@/components/ui/toggle";
import { setResourceActions, togglePermissionAction } from "./permission-utils";

const RESOURCE_ICONS: Record<WorkspaceResource, IconSvgElement> = {
  note: Note01FreeIcons,
  collection: Folder01FreeIcons,
  resource: Link01Icon,
  category: Tag01Icon,
  board: DashboardSquare01Icon,
  kanban: KanbanIcon,
  calendar: Calendar03Icon,
  agentThread: BubbleChatIcon,
  agentSkill: BubbleChatIcon,
  aiSettings: Config,
  workspaceSettings: Settings01Icon,
  member: UserGroupIcon,
  invitation: UserListFreeIcons,
  organization: Config,
  ac: UserEdit01Icon,
  team: UserGroupIcon,
};

const RESOURCE_BLURBS: Partial<Record<WorkspaceResource, string>> = {
  note: "Criar e editar notas do workspace",
  collection: "Organizar coleções e pastas",
  resource: "Links e recursos salvos",
  category: "Categorias e tags",
  board: "Boards visuais (tldraw)",
  kanban: "Quadros e cartões Kanban",
  calendar: "Eventos e agenda",
  agentThread: "Conversas com o Agent",
  agentSkill: "Skills personalizadas do Agent",
  aiSettings: "Modelo e prompt do Agent",
  workspaceSettings: "Logo e dados do workspace",
  member: "Gerenciar membros",
  invitation: "Convidar pessoas",
  organization: "Atualizar ou excluir o workspace",
  ac: "Criar e editar cargos",
};

type PermissionSection = {
  id: string;
  title: string;
  resources: WorkspaceResource[];
};

const PERMISSION_SECTIONS: PermissionSection[] = [
  {
    id: "content",
    title: "Conteúdo",
    resources: ["note", "collection", "resource", "category"],
  },
  {
    id: "productivity",
    title: "Boards e agenda",
    resources: ["board", "kanban", "calendar"],
  },
  {
    id: "agent",
    title: "Agent",
    resources: ["agentThread", "agentSkill", "aiSettings"],
  },
  {
    id: "workspace",
    title: "Workspace",
    resources: [
      "workspaceSettings",
      "member",
      "invitation",
      "organization",
      "ac",
    ],
  },
];

function ResourceModuleCard({
  resource,
  permission,
  readOnly,
  onChange,
}: {
  resource: WorkspaceResource;
  permission: WorkspacePermission;
  readOnly: boolean;
  onChange: (next: WorkspacePermission) => void;
}) {
  const actions = [...(workspaceStatements[resource] as readonly string[])];
  const granted = (permission[resource] as string[] | undefined) ?? [];
  const allSelected =
    actions.length > 0 && actions.every((a) => granted.includes(a));
  const icon = RESOURCE_ICONS[resource];

  return (
    <article className="rounded-xl border border-border/80 bg-background/70 p-4 transition-colors hover:bg-background">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon icon={icon} className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium">
                {PERMISSION_RESOURCE_LABELS[resource]}
              </h3>
              <Badge variant="outline">{granted.length} perms</Badge>
            </div>
            {RESOURCE_BLURBS[resource] ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {RESOURCE_BLURBS[resource]}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label
            htmlFor={`select-all-${resource}`}
            className="text-xs font-normal text-muted-foreground"
          >
            Selecionar tudo
          </Label>
          <Switch
            id={`select-all-${resource}`}
            checked={allSelected}
            disabled={readOnly || actions.length === 0}
            onCheckedChange={(value) =>
              onChange(
                setResourceActions(
                  permission,
                  resource,
                  value === true ? actions : [],
                ),
              )
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const selected = granted.includes(action);
          return (
            <Toggle
              key={action}
              pressed={selected}
              disabled={readOnly}
              onPressedChange={(pressed) =>
                onChange(
                  togglePermissionAction(permission, resource, action, pressed),
                )
              }
            >
              {selected ? (
                <Icon icon={CheckmarkCircle02Icon} data-icon="inline-start" />
              ) : null}
              {PERMISSION_ACTION_LABELS[action] ?? action}
            </Toggle>
          );
        })}
      </div>
    </article>
  );
}

interface RolePermissionModulesProps {
  permission: WorkspacePermission;
  readOnly: boolean;
  onChange: (next: WorkspacePermission) => void;
}

export function RolePermissionModules({
  permission,
  readOnly,
  onChange,
}: RolePermissionModulesProps) {
  const [query, setQuery] = useState("");

  const filteredBySection = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = (resource: WorkspaceResource) => {
      if (!q) return true;
      const label = PERMISSION_RESOURCE_LABELS[resource].toLowerCase();
      const blurb = (RESOURCE_BLURBS[resource] ?? "").toLowerCase();
      return label.includes(q) || blurb.includes(q) || resource.includes(q);
    };

    return PERMISSION_SECTIONS.map((section) => ({
      ...section,
      resources: section.resources.filter(
        (resource) =>
          isEditablePermissionResource(resource) && matches(resource),
      ),
    })).filter((section) => section.resources.length > 0);
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Icon
          icon={Search01Icon}
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar módulos..."
          className="rounded-xl pl-9"
        />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Selecione as ações que este cargo pode executar.
        </p>
        <span className="text-xs text-muted-foreground">4 categorias</span>
      </div>

      <div className="flex flex-col gap-3">
        {filteredBySection.map((section) => {
          const sectionPermCount = section.resources.reduce((sum, resource) => {
            return (
              sum +
              ((permission[resource] as string[] | undefined)?.length ?? 0)
            );
          }, 0);

          return (
            <Collapsible
              key={section.id}
              defaultOpen={section.id === "content"}
              className="group rounded-xl border border-border/80 bg-muted/25"
            >
              <CollapsibleTrigger className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">
                    {section.title}
                  </span>
                  <Badge variant="outline">{sectionPermCount} permissões</Badge>
                </div>
                <Icon
                  icon={ArrowDown01Icon}
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-data-open:rotate-180"
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-border/80 px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex flex-col gap-2.5">
                  {section.resources.map((resource) => (
                    <ResourceModuleCard
                      key={resource}
                      resource={resource}
                      permission={permission}
                      readOnly={readOnly}
                      onChange={onChange}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {filteredBySection.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum módulo encontrado.
          </p>
        ) : null}
      </div>
    </div>
  );
}
