import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase().slice(0, 2);
  }
  return title.slice(0, 2).toUpperCase() || "Aa";
}

export function formatDateLabel(updatedAt: string, createdAt: string): string {
  const updated = new Date(updatedAt);
  const created = new Date(createdAt);

  if (Number.isNaN(updated.getTime())) return "Data indisponível";

  const neverEdited = Math.abs(updated.getTime() - created.getTime()) < 5000;
  if (neverEdited) return formatCreatedAtLabel(createdAt);

  const diffMs = Date.now() - updated.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    return `Editado há ${Math.floor(diffMs / (1000 * 60))}min`;
  }

  if (diffHours < 24) {
    return `Editado há ${Math.floor(diffHours)}h`;
  }

  return `Editado em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(updated)}`;
}

export function formatCreatedAtLabel(dateString: string): string {
  const date = new Date(dateString);
  return `Criado em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date)}`;
}
