import { isToolUIPart, type ToolUIPart } from "ai";
import type { AiUIMessage } from "@/components/chat/hook/useAiChat";

export const NOTE_EDIT_TOOLS = new Set<string>([
  "appendToEnd",
  "insertAfterBlock",
  "insertBeforeBlock",
  "replaceBlock",
  "replaceSelection",
  "replaceEntireNote",
  "insertWikiLinks",
]);

export function getWorkspaceToolParts(message: AiUIMessage | undefined): ToolUIPart[] {
  if (!message || message.role !== "assistant") return [];
  return message.parts.filter((part): part is ToolUIPart => {
    if (!isToolUIPart(part)) return false;
    const name = part.type.replace(/^tool-/, "");
    return !NOTE_EDIT_TOOLS.has(name);
  });
}

export function getToolPendingLabel(toolPart: ToolUIPart): string {
  const name = toolPart.type.replace(/^tool-/, "");
  switch (name) {
    case "searchNotes":
      return "Buscando no conteúdo…";
    case "getNote":
      return "Lendo nota…";
    case "listNotes":
      return "Listando notas…";
    case "listNoteCollections":
      return "Listando pastas de notas…";
    case "listBoards":
      return "Listando boards…";
    case "listResourceCollections":
      return "Listando coleções de recursos…";
    case "listResources":
      return "Listando recursos…";
    case "getResource":
      return "Lendo recurso…";
    case "getNoteBacklinks":
      return "Buscando backlinks…";
    case "listNoteBlocks":
      return "Listando blocos…";
    case "removeNoteText":
      return "Removendo trecho…";
    case "removeNoteBlock":
      return "Removendo bloco…";
    case "replaceNoteBlock":
      return "Editando bloco…";
    case "createNote":
      return "Criando nota…";
    case "renameNote":
      return "Renomeando nota…";
    case "moveNote":
      return "Movendo nota…";
    case "createCollection":
      return "Criando coleção…";
    case "createResource":
      return "Criando recurso…";
    case "deleteNote":
      return "Excluindo nota…";
    case "deleteCollection":
      return "Excluindo coleção…";
    case "deleteResource":
      return "Excluindo recurso…";
    default:
      return `Usando ${name}…`;
  }
}

export function getToolDoneLabel(toolPart: ToolUIPart): string {
  const name = toolPart.type.replace(/^tool-/, "");
  const output = toolPart.output as Record<string, unknown> | undefined;

  switch (name) {
    case "createNote": {
      const note = output?.note as { title?: string } | undefined;
      return note?.title ? `Criou nota “${note.title}”` : "Criou nota";
    }
    case "renameNote": {
      const note = output?.note as { title?: string } | undefined;
      return note?.title ? `Renomeou para “${note.title}”` : "Renomeou nota";
    }
    case "moveNote": {
      const note = output?.note as { title?: string } | undefined;
      return note?.title ? `Moveu “${note.title}”` : "Moveu nota";
    }
    case "deleteNote": {
      const note = output?.note as { title?: string } | undefined;
      return note?.title ? `Excluiu nota “${note.title}”` : "Excluiu nota";
    }
    case "createCollection": {
      const collection = output?.collection as { name?: string } | undefined;
      return collection?.name
        ? `Criou coleção “${collection.name}”`
        : "Criou coleção";
    }
    case "deleteCollection": {
      const collection = output?.collection as { name?: string } | undefined;
      return collection?.name
        ? `Excluiu coleção “${collection.name}”`
        : "Excluiu coleção";
    }
    case "createResource": {
      const resource = output?.resource as { title?: string } | undefined;
      return resource?.title
        ? `Criou recurso “${resource.title}”`
        : "Criou recurso";
    }
    case "deleteResource": {
      const resource = output?.resource as { title?: string } | undefined;
      return resource?.title
        ? `Excluiu recurso “${resource.title}”`
        : "Excluiu recurso";
    }
    case "listResources": {
      const count = output?.count as number | undefined;
      return typeof count === "number"
        ? `Listou ${count} recurso(s)`
        : "Listou recursos";
    }
    case "searchNotes":
      return "Buscou notas";
    case "getNote":
      return "Leu nota";
    case "listNotes":
      return "Listou notas";
    case "listNoteCollections":
      return "Listou pastas de notas";
    case "listResourceCollections":
      return "Listou coleções de recursos";
    case "listBoards":
      return "Listou boards";
    case "getResource":
      return "Leu recurso";
    case "getNoteBacklinks":
      return "Buscou backlinks";
    case "listNoteBlocks":
      return "Listou blocos";
    case "removeNoteText":
      return "Removeu trecho";
    case "removeNoteBlock":
      return "Removeu bloco";
    case "replaceNoteBlock":
      return "Editou bloco";
    default:
      return `Concluiu ${name}`;
  }
}

export function getToolNavigationTarget(
  toolPart: ToolUIPart,
): { type: "note" | "collection"; id: string } | null {
  const name = toolPart.type.replace(/^tool-/, "");
  const output = toolPart.output as Record<string, unknown> | undefined;
  if (!output) return null;

  if (name === "createNote" || name === "getNote" || name === "renameNote") {
    const note = output.note as { id?: string } | undefined;
    if (note?.id) return { type: "note", id: note.id };
    if (typeof output.id === "string") return { type: "note", id: output.id };
  }

  if (name === "moveNote") {
    const note = output.note as { id?: string } | undefined;
    if (note?.id) return { type: "note", id: note.id };
  }

  if (name === "createCollection" || name === "deleteCollection") {
    const collection = output.collection as { id?: string } | undefined;
    if (collection?.id) return { type: "collection", id: collection.id };
  }

  if (name === "createResource" || name === "getResource") {
    const resource = (output.resource ?? output) as {
      collectionId?: string;
    };
    if (resource.collectionId) {
      return { type: "collection", id: resource.collectionId };
    }
  }

  return null;
}

export function getToolCardTitle(toolPart: ToolUIPart): string {
  if (
    toolPart.state === "input-streaming" ||
    toolPart.state === "input-available"
  ) {
    return getToolPendingLabel(toolPart);
  }
  if (toolPart.state === "output-error") {
    return `Falhou: ${toolPart.type.replace(/^tool-/, "")}`;
  }

  const name = toolPart.type.replace(/^tool-/, "");
  const output = toolPart.output as Record<string, unknown> | undefined;
  const input = toolPart.input as Record<string, unknown> | undefined;

  switch (name) {
    case "getNote": {
      const title =
        (output?.note as { title?: string } | undefined)?.title ??
        (output?.title as string | undefined);
      return title?.trim() || "Nota";
    }
    case "searchNotes": {
      const query = input?.query as string | undefined;
      return query?.trim() ? `Busca: ${query.trim()}` : "Busca de notas";
    }
    case "listNotes":
      return "Notas do workspace";
    case "renameNote": {
      const title = input?.title as string | undefined;
      return title?.trim() || "Renomear nota";
    }
    case "moveNote":
      return "Mover nota";
    case "listResources":
      return "Recursos";
    case "getResource": {
      const resource = (output?.resource ?? output) as
        | { title?: string; url?: string }
        | undefined;
      return resource?.title?.trim() || resource?.url || "Recurso";
    }
    case "createNote": {
      const note = output?.note as { title?: string } | undefined;
      return note?.title?.trim() || "Nova nota";
    }
    case "createCollection": {
      const collection = output?.collection as { name?: string } | undefined;
      return collection?.name?.trim() || "Nova coleção";
    }
    case "createResource": {
      const resource = output?.resource as
        | { title?: string; url?: string }
        | undefined;
      return resource?.title?.trim() || resource?.url || "Novo recurso";
    }
    case "getNoteBacklinks":
      return "Backlinks";
    case "listNoteCollections":
      return "Pastas de notas";
    case "listResourceCollections":
      return "Coleções de recursos";
    case "listBoards":
      return "Boards";
    default:
      return getToolDoneLabel(toolPart);
  }
}

export function getToolCardSnippet(toolPart: ToolUIPart): string | null {
  if (
    toolPart.state === "input-streaming" ||
    toolPart.state === "input-available"
  ) {
    return "Em andamento…";
  }
  if (toolPart.state === "output-error") {
    return "Falhou ao executar";
  }

  const name = toolPart.type.replace(/^tool-/, "");
  const output = toolPart.output as Record<string, unknown> | undefined;
  if (!output) return null;

  switch (name) {
    case "getNote": {
      const title =
        (output.note as { title?: string } | undefined)?.title ??
        (output.title as string | undefined);
      const content = output.content as string | undefined;
      if (content?.trim()) return content.trim().slice(0, 120);
      return title ? `Nota: ${title}` : null;
    }
    case "searchNotes":
    case "listNotes": {
      const notes = output.notes as
        | Array<{ title?: string; snippet?: string | null }>
        | undefined;
      if (!notes?.length) return "Nenhuma nota encontrada";
      return notes
        .slice(0, 3)
        .map((n) => n.snippet?.trim() || n.title || "Sem título")
        .join(" · ");
    }
    case "listResources": {
      const resources = output.resources as
        | Array<{ title?: string; url?: string }>
        | undefined;
      if (!resources?.length) return "Nenhum recurso encontrado";
      return resources
        .slice(0, 3)
        .map((r) => r.title || r.url || "Recurso")
        .join(" · ");
    }
    case "createNote": {
      const note = output.note as { title?: string } | undefined;
      return note?.title ? `Criada: ${note.title}` : "Nota criada";
    }
    case "createResource": {
      const resource = output.resource as
        | { title?: string; url?: string }
        | undefined;
      return resource?.url || resource?.title || "Recurso criado";
    }
    case "createCollection": {
      const collection = output.collection as { name?: string } | undefined;
      return collection?.name ? `Criada: ${collection.name}` : "Coleção criada";
    }
    case "getNoteBacklinks": {
      const linked = output.linkedFrom as Array<{ title?: string }> | undefined;
      if (!linked?.length) return "Sem backlinks";
      return linked
        .slice(0, 3)
        .map((n) => n.title || "Sem título")
        .join(" · ");
    }
    default:
      return null;
  }
}

export function getToolDomainLabel(toolPart: ToolUIPart): string {
  const name = toolPart.type.replace(/^tool-/, "");
  if (name.includes("Resource") || name === "listResources") return "Recurso";
  if (name.includes("Collection")) return "Coleção";
  if (name.includes("Board")) return "Board";
  if (name.includes("Note") || name === "searchNotes" || name === "listNotes") {
    return "Nota";
  }
  return "Workspace";
}
