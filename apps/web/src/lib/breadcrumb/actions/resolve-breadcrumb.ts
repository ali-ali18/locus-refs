"use server";

import prisma from "@/lib/prisma";
import { type BreadcrumbItem, routeResolvers } from "../route-resolvers";

const ROUTE_LABELS: Record<string, string> = {
  collections: "Coleções",
  notes: "Notas",
  categories: "Categorias",
  resources: "Recursos",
};

function getSegmentLabel(segment: string): string {
  return ROUTE_LABELS[segment] ?? segment;
}

routeResolvers.collections = async (id: string) => {
  const collection = await prisma.collection.findUnique({
    where: { id },
    select: { name: true },
  });
  return collection?.name ?? null;
};

routeResolvers.notes = async (id: string) => {
  const note = await prisma.note.findUnique({
    where: { id },
    select: { title: true },
  });
  return note?.title ?? null;
};

routeResolvers.resources = async (id: string) => {
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { title: true },
  });
  return resource?.title ?? null;
};

export async function resolveBreadcrumb(
  pathname: string,
): Promise<BreadcrumbItem[]> {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];

  if (segments.length === 0) {
    return items;
  }

  // Support both legacy /dashboard/... and new /[workspaceSlug]/...
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
    const parentIsCollectionLike =
      previousSegment !== null &&
      ["collections", "notes", "resources"].includes(previousSegment);

    let label: string | null = null;

    if (isUuid && parentIsCollectionLike && previousSegment) {
      const resolver = routeResolvers[previousSegment];
      if (resolver) {
        label = await resolver(segment);
      }
    }

    if (!label) {
      label = getSegmentLabel(segment);
    }

    if (label) {
      items.push({
        label,
        href: isLast ? "" : currentPath,
      });
    }
  }

  return items;
}
