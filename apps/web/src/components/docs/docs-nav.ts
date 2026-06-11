import {
  Database02Icon,
  File,
  File01Icon,
  Folder01FreeIcons,
  Home01FreeIcons,
  Mail,
  Note02FreeIcons,
  PlusSignIcon,
  Share06Icon,
  Tag01FreeIcons,
  Users,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface DocsNavItem {
  href: string;
  label: string;
  icon: IconSvgElement;
}

export interface DocsNavGroup {
  label: string;
  items: DocsNavItem[];
}

export const docsNavGroups: DocsNavGroup[] = [
  {
    label: "Introdução",
    items: [
      { href: "/docs", label: "Visão Geral", icon: Home01FreeIcons },
      {
        href: "/docs/getting-started",
        label: "Getting Started",
        icon: Share06Icon,
      },
      { href: "/docs/motivos", label: "Motivos", icon: Home01FreeIcons },
    ],
  },
  {
    label: "Estrutura",
    items: [
      {
        href: "/docs/estrutura",
        label: "Visão Geral",
        icon: Folder01FreeIcons,
      },
      {
        href: "/docs/estrutura/app-router",
        label: "App Router",
        icon: File01Icon,
      },
      {
        href: "/docs/estrutura/componentes",
        label: "Componentes",
        icon: File01Icon,
      },
      {
        href: "/docs/estrutura/banco-de-dados",
        label: "Banco de Dados",
        icon: Database02Icon,
      },
      {
        href: "/docs/estrutura/collab",
        label: "Servidor Collab",
        icon: Share06Icon,
      },
    ],
  },
  {
    label: "API Reference",
    items: [
      { href: "/docs/categories", label: "Categorias", icon: Tag01FreeIcons },
      { href: "/docs/collections", label: "Coleções", icon: Folder01FreeIcons },
      { href: "/docs/notes", label: "Notas", icon: Note02FreeIcons },
      { href: "/docs/resources", label: "Recursos", icon: Database02Icon },
      { href: "/docs/ai", label: "IA", icon: PlusSignIcon },
      { href: "/docs/upload", label: "Upload", icon: File01Icon },
      { href: "/docs/workspace", label: "Workspace", icon: Users },
      { href: "/docs/collab", label: "Colaboração", icon: Share06Icon },
      { href: "/docs/metadata", label: "Metadados", icon: File },
      { href: "/docs/auth", label: "Autenticação", icon: Mail },
    ],
  },
  {
    label: "Sistema de Docs",
    items: [
      { href: "/docs/docs-content", label: "Docs Content", icon: File01Icon },
    ],
  },
  // future: { label: "Como usar", items: [...] },
];

export const docsNavItems: DocsNavItem[] = docsNavGroups.flatMap(
  (g) => g.items,
);
