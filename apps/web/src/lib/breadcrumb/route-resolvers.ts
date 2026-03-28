export type BreadcrumbItem = {
  label: string;
  href: string;
};

export type ResolverFn = (id: string) => Promise<string | null>;

export type RouteResolvers = Record<string, ResolverFn>;

export const routeResolvers: RouteResolvers = {};
