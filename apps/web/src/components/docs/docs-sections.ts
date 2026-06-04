export interface DocsSection {
  pathPrefix: string;
  label: string;
}

export const docsSections: DocsSection[] = [
  { pathPrefix: "/docs", label: "API Reference" },
  // { pathPrefix: "/guides", label: "Como usar" },
];

export function getDocsSection(pathname: string): DocsSection | undefined {
  return docsSections.find(({ pathPrefix }) =>
    pathname === pathPrefix || pathname.startsWith(`${pathPrefix}/`),
  );
}
