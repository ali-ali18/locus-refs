"use server";

import prisma from "@/lib/prisma";
import type { BreadcrumbItem } from "../route-resolvers";

const ROUTE_LABELS: Record<string, string> = {
  collections: "Coleções",
  notes: "Notas",
  categories: "Categorias",
  resources: "Recursos",
  boards: "Boards",
  config: "Configuração",
  kanban: "Kanban",
};

type ResolvedSegment = { label: string; icon?: string | null };
type ResolverFn = (id: string) => Promise<ResolvedSegment | null>;

const resolvers: Record<string, ResolverFn> = {
  collections: async (id) => {
    const row = await prisma.collection.findUnique({
      where: { id },
      select: { name: true },
    });
    return row ? { label: row.name } : null;
  },
  notes: async (id) => {
    const row = await prisma.note.findUnique({
      where: { id },
      select: { title: true, icon: true },
    });
    return row ? { label: row.title, icon: row.icon } : null;
  },
  resources: async (id) => {
    const row = await prisma.resource.findUnique({
      where: { id },
      select: { title: true },
    });
    return row ? { label: row.title } : null;
  },
  boards: async (id) => {
    const row = await prisma.board.findUnique({
      where: { id },
      select: { title: true },
    });
    return row ? { label: row.title } : null;
  },
  kanban: async (id) => {
    const row = await prisma.kanbanBoard.findUnique({
      where: { id },
      select: { title: true, icon: true },
    });
    return row ? { label: row.title, icon: row.icon } : null;
  },
};

function getSegmentLabel(segment: string): string {
  return ROUTE_LABELS[segment] ?? segment;
}

export async function resolveBreadcrumb(
  pathname: string,
): Promise<BreadcrumbItem[]> {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];

  if (segments.length === 0) {
    return items;
  }

  const isDashboard = segments[0] === "dashboard";
  const workspaceSlug = isDashboard ? null : segments[0];
  const featureSegments = isDashboard ? segments.slice(1) : segments.slice(1);
  const basePath = isDashboard ? "/dashboard" : `/${workspaceSlug}`;

  items.push({ label: "Home", href: basePath });

  let currentPath = basePath;

  for (let i = 0; i < featureSegments.length; i++) {
    const segment = featureSegments[i];
    const previousSegment = i > 0 ? featureSegments[i - 1] : null;
    currentPath += `/${segment}`;

    const isLast = i === featureSegments.length - 1;
    const isUuid = /^[0-9a-f-]{36}$|^[a-zA-Z0-9-]{20,}$/.test(segment);
    const resolvableParent =
      previousSegment !== null && previousSegment in resolvers;

    let resolved: ResolvedSegment | null = null;

    if (isUuid && resolvableParent && previousSegment) {
      try {
        resolved = await resolvers[previousSegment](segment);
      } catch {
        // fallback to segment label — resolver error should not break the page
      }
    }

    items.push({
      label: resolved?.label ?? getSegmentLabel(segment),
      icon: resolved?.icon,
      href: isLast ? "" : currentPath,
    });
  }

  return items;
}
