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

  if (segments.length === 0 || segments[0] !== "dashboard") {
    return items;
  }

  items.push({ label: "Dashboard", href: "/dashboard" });

  let currentPath = "/dashboard";

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const previousSegment = segments[i - 1];
    currentPath += `/${segment}`;

    const isLast = i === segments.length - 1;
    const hasId = /^[a-zA-Z0-9-]+$/.test(segment);
    const parentIsCollectionLike = [
      "collections",
      "notes",
      "resources",
    ].includes(previousSegment);

    let label: string | null = null;

    if (hasId && parentIsCollectionLike) {
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
