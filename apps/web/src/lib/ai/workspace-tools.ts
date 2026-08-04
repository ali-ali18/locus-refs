import { tool } from "ai";
import slugify from "slugify";
import { z } from "zod";
import {
  listDocBlocks,
  removeBlockAt,
  removeBlocksMatchingText,
  replaceBlockWithPlainText,
  toPrismaJson,
  type TiptapNode,
} from "@/lib/ai/note-content-edit";
import {
  noteJsonToText,
} from "@/lib/ai/note-to-text";
import { DEFAULT_KANBAN_COLUMNS } from "@/lib/kanban/defaults";
import {
  cardMatchesDueFilter,
  formatKanbanDueDateInput,
  isKanbanDueDateOverdue,
  parseKanbanDueDate,
  rangeForDueFilterPreset,
  type KanbanDueFilterPreset,
} from "@/lib/kanban/due-date";
import {
  computeFractionalPosition,
  nextAppendPosition,
} from "@/lib/kanban/position";
import prisma from "@/lib/prisma";
import { isWorkspaceAdmin } from "@/server/requireSession";

const NOTE_TEXT_LIMIT = 4000;

const dueDateInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
  .nullable()
  .optional();

const dueDateYmdSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

const kanbanDueFilterSchema = z
  .enum([
    "today",
    "this_week",
    "this_month",
    "last_month",
    "overdue",
    "no_due",
    "custom",
  ])
  .optional();

function truncate(text: string, max = NOTE_TEXT_LIMIT): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

function serializeKanbanDueDate(value: Date | null | undefined): string | null {
  return formatKanbanDueDateInput(value) || null;
}

async function resolveKanbanColumnId(params: {
  boardId: string;
  columnId?: string;
  columnName?: string;
}): Promise<{ columnId: string } | { error: string }> {
  const { boardId, columnId, columnName } = params;

  if (columnId) {
    const column = await prisma.kanbanColumn.findFirst({
      where: { id: columnId, boardId },
      select: { id: true },
    });
    if (!column) return { error: "Coluna não encontrada neste board." };
    return { columnId: column.id };
  }

  if (columnName) {
    const column = await prisma.kanbanColumn.findFirst({
      where: {
        boardId,
        name: { equals: columnName, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (!column) {
      return { error: `Coluna "${columnName}" não encontrada neste board.` };
    }
    return { columnId: column.id };
  }

  return { error: "Informe columnId ou columnName." };
}

type TiptapDoc = Parameters<typeof noteJsonToText>[0];

async function loadNoteDoc(workspaceId: string, noteId: string) {
  const note = await prisma.note.findUnique({
    where: { id: noteId, workspaceId },
    select: { id: true, title: true, content: true },
  });
  if (!note) return null;
  const doc = (note.content ?? {
    type: "doc",
    content: [],
  }) as TiptapNode;
  return { note, doc };
}

function refuseIfOpenNote(
  targetId: string,
  currentNoteId: string | null | undefined,
) {
  if (currentNoteId && targetId === currentNoteId) {
    return {
      error:
        "Esta nota está aberta no editor (Yjs). Use as ferramentas de edição da nota aberta (replaceBlock/replaceSelection/replaceEntireNote com content \"\" para apagar). Não use removeNoteText/removeNoteBlock/replaceNoteBlock na nota aberta.",
    };
  }
  return null;
}

export function createWorkspaceTools(params: {
  workspaceId: string;
  userId: string;
  currentNoteId?: string | null;
}) {
  const { workspaceId, userId, currentNoteId } = params;

  return {
    searchNotes: tool({
      description:
        "Busca notas no workspace ativo por título OU conteúdo. Retorna id, título, ícone e snippet do trecho encontrado.",
      inputSchema: z.object({
        query: z
          .string()
          .min(1)
          .max(120)
          .describe("Trecho a buscar no título ou no corpo da nota"),
        limit: z.number().int().min(1).max(20).optional(),
      }),
      execute: async ({ query, limit = 10 }) => {
        const q = query.trim();
        const like = `%${q.replace(/[%_\\]/g, "\\$&")}%`;

        // Título + conteúdo JSON (texto embutido no TipTap) via ILIKE.
        const rows = await prisma.$queryRaw<
          Array<{
            id: string;
            title: string;
            icon: string | null;
            updatedAt: Date;
            content: unknown;
          }>
        >`
          SELECT id, title, icon, "updatedAt", content
          FROM "Note"
          WHERE "workspaceId" = ${workspaceId}
            AND (
              title ILIKE ${like} ESCAPE '\\'
              OR content::text ILIKE ${like} ESCAPE '\\'
            )
          ORDER BY "updatedAt" DESC
          LIMIT ${limit}
        `;

        const notes = rows.map((note) => {
          const text = note.content
            ? noteJsonToText(note.content as TiptapDoc)
            : "";
          const lower = text.toLowerCase();
          const idx = lower.indexOf(q.toLowerCase());
          let snippet: string | null = null;
          if (idx >= 0) {
            const start = Math.max(0, idx - 40);
            const end = Math.min(text.length, idx + q.length + 80);
            snippet = `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
          } else if (note.title.toLowerCase().includes(q.toLowerCase())) {
            snippet = text.trim() ? truncate(text, 120) : null;
          } else if (text.trim()) {
            snippet = truncate(text, 120);
          }

          return {
            id: note.id,
            title: note.title,
            icon: note.icon,
            updatedAt: note.updatedAt,
            matchInTitle: note.title.toLowerCase().includes(q.toLowerCase()),
            snippet,
          };
        });

        return { notes, query: q };
      },
    }),

    getNote: tool({
      description:
        "Lê o conteúdo de uma nota do workspace ativo pelo id. Nunca invente ids.",
      inputSchema: z.object({
        noteId: z.string().min(1).describe("Id da nota"),
      }),
      execute: async ({ noteId }) => {
        const note = await prisma.note.findUnique({
          where: { id: noteId, workspaceId },
          select: { id: true, title: true, icon: true, content: true },
        });
        if (!note) {
          return { error: "Nota não encontrada neste workspace." };
        }
        const text = note.content
          ? noteJsonToText(note.content as TiptapDoc)
          : "";
        return {
          id: note.id,
          title: note.title,
          icon: note.icon,
          content: truncate(text),
        };
      },
    }),

    listNotes: tool({
      description: "Lista notas recentes do workspace ativo.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(30).optional(),
      }),
      execute: async ({ limit = 15 }) => {
        const notes = await prisma.note.findMany({
          where: { workspaceId },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            title: true,
            icon: true,
            collectionId: true,
            updatedAt: true,
          },
        });
        return { notes };
      },
    }),

    listNoteCollections: tool({
      description: "Lista pastas/coleções de notas do workspace ativo.",
      inputSchema: z.object({}),
      execute: async () => {
        const collections = await prisma.collection.findMany({
          where: { workspaceId, isNoteCollection: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true, color: true },
        });
        return { collections };
      },
    }),

    listBoards: tool({
      description: "Lista boards do workspace ativo (não deletados).",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(30).optional(),
      }),
      execute: async ({ limit = 15 }) => {
        const boards = await prisma.board.findMany({
          where: { workspaceId, deletedAt: null },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: { id: true, title: true, icon: true, updatedAt: true },
        });
        return { boards };
      },
    }),

    listKanbanBoards: tool({
      description:
        "Lista boards Kanban do workspace ativo (área Kanban, não confundir com listBoards de whiteboards).",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(30).optional(),
      }),
      execute: async ({ limit = 15 }) => {
        const boards = await prisma.kanbanBoard.findMany({
          where: { workspaceId, deletedAt: null },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            icon: true,
            updatedAt: true,
          },
        });
        return { boards, count: boards.length };
      },
    }),

    createKanbanBoard: tool({
      description:
        "Cria um board Kanban no workspace com 3 colunas padrão (A fazer, Em andamento, Concluído). Use quando o usuário pedir um novo board/quadro de tarefas.",
      inputSchema: z.object({
        title: z.string().min(1).max(120),
        description: z.string().max(1000).optional(),
        icon: z.string().max(60).optional(),
      }),
      execute: async ({ title, description, icon }) => {
        const board = await prisma.kanbanBoard.create({
          data: {
            title,
            description: description ?? null,
            icon: icon ?? null,
            workspaceId,
            createdById: userId,
            columns: {
              create: DEFAULT_KANBAN_COLUMNS.map((column) => ({
                name: column.name,
                color: column.color,
                position: column.position,
              })),
            },
          },
          select: {
            id: true,
            title: true,
            description: true,
            icon: true,
            columns: {
              orderBy: { position: "asc" },
              select: {
                id: true,
                name: true,
                color: true,
                position: true,
              },
            },
          },
        });

        return {
          created: true,
          board,
          message: `Board Kanban "${board.title}" criado com ${board.columns.length} colunas.`,
        };
      },
    }),

    getKanbanBoard: tool({
      description:
        "Carrega um board Kanban com colunas e cards. Use listKanbanBoards para achar o id.",
      inputSchema: z.object({
        boardId: z.string().min(1).describe("Id do board Kanban"),
      }),
      execute: async ({ boardId }) => {
        const board = await prisma.kanbanBoard.findFirst({
          where: { id: boardId, workspaceId, deletedAt: null },
          select: {
            id: true,
            title: true,
            description: true,
            icon: true,
            columns: {
              orderBy: { position: "asc" },
              select: {
                id: true,
                name: true,
                color: true,
                position: true,
              },
            },
            cards: {
              orderBy: { position: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                columnId: true,
                position: true,
                startDate: true,
                dueDate: true,
                assigneeId: true,
                createdById: true,
              },
            },
          },
        });
        if (!board) {
          return { error: "Board Kanban não encontrado neste workspace." };
        }

        return {
          board: {
            ...board,
            cards: board.cards.map((card) => ({
              ...card,
              startDate: serializeKanbanDueDate(card.startDate),
              dueDate: serializeKanbanDueDate(card.dueDate),
            })),
          },
        };
      },
    }),

    listKanbanCards: tool({
      description:
        "Lista/filtra cards de um board Kanban. Use dueFilter para prazo (today, this_week, this_month, last_month, overdue, no_due, custom). Para custom, informe from e to em YYYY-MM-DD. Prefira esta tool em vez de getKanbanBoard quando o usuário perguntar por prazos, atrasados ou cards de um período.",
      inputSchema: z.object({
        boardId: z.string().min(1),
        dueFilter: kanbanDueFilterSchema.describe(
          "Filtro de prazo alinhado à UI do board",
        ),
        from: dueDateYmdSchema
          .optional()
          .describe("Início do período (obrigatório com dueFilter=custom)"),
        to: dueDateYmdSchema
          .optional()
          .describe("Fim do período (obrigatório com dueFilter=custom)"),
        columnId: z.string().min(1).optional(),
        columnName: z.string().min(1).max(80).optional(),
        assigneeId: z
          .string()
          .min(1)
          .nullable()
          .optional()
          .describe("Filtra por responsável; null = sem responsável"),
        query: z
          .string()
          .max(120)
          .optional()
          .describe("Busca no título do card"),
        limit: z.number().int().min(1).max(50).optional(),
      }),
      execute: async ({
        boardId,
        dueFilter,
        from,
        to,
        columnId,
        columnName,
        assigneeId,
        query,
        limit = 30,
      }) => {
        const board = await prisma.kanbanBoard.findFirst({
          where: { id: boardId, workspaceId, deletedAt: null },
          select: {
            id: true,
            title: true,
            columns: {
              select: { id: true, name: true },
            },
          },
        });
        if (!board) {
          return { error: "Board Kanban não encontrado neste workspace." };
        }

        let resolvedColumnId: string | undefined;
        if (columnId || columnName) {
          const resolved = await resolveKanbanColumnId({
            boardId,
            columnId,
            columnName,
          });
          if ("error" in resolved) return resolved;
          resolvedColumnId = resolved.columnId;
        }

        if (dueFilter === "custom" && (!from || !to)) {
          return {
            error: "dueFilter=custom exige from e to em YYYY-MM-DD.",
          };
        }
        if (from && to && from > to) {
          return { error: "from deve ser anterior ou igual a to." };
        }

        const columnNameById = new Map(
          board.columns.map((column) => [column.id, column.name]),
        );

        const cards = await prisma.kanbanCard.findMany({
          where: {
            boardId,
            ...(resolvedColumnId && { columnId: resolvedColumnId }),
            ...(assigneeId !== undefined && { assigneeId }),
            ...(query?.trim() && {
              title: { contains: query.trim(), mode: "insensitive" },
            }),
          },
          orderBy: [{ dueDate: "asc" }, { position: "asc" }],
          select: {
            id: true,
            title: true,
            description: true,
            columnId: true,
            position: true,
            startDate: true,
            dueDate: true,
            assigneeId: true,
          },
        });

        let filterFrom = from ?? null;
        let filterTo = to ?? null;
        let filterPreset: KanbanDueFilterPreset | null = null;

        if (
          dueFilter === "today" ||
          dueFilter === "this_week" ||
          dueFilter === "this_month" ||
          dueFilter === "last_month"
        ) {
          const range = rangeForDueFilterPreset(dueFilter);
          filterFrom = range.from;
          filterTo = range.to;
          filterPreset = dueFilter;
        } else if (dueFilter === "custom") {
          filterPreset = "custom";
        }

        const filtered = cards.filter((card) => {
          const startIso = serializeKanbanDueDate(card.startDate);
          const dueIso = serializeKanbanDueDate(card.dueDate);

          if (dueFilter === "overdue") {
            return isKanbanDueDateOverdue(dueIso);
          }
          if (dueFilter === "no_due") {
            return !startIso && !dueIso;
          }
          if (filterPreset && filterFrom && filterTo) {
            return cardMatchesDueFilter(startIso, dueIso, {
              preset: filterPreset,
              from: filterFrom,
              to: filterTo,
            });
          }
          return true;
        });

        const limited = filtered.slice(0, limit).map((card) => ({
          id: card.id,
          title: card.title,
          description: card.description
            ? truncate(card.description, 280)
            : null,
          columnId: card.columnId,
          columnName: columnNameById.get(card.columnId) ?? null,
          startDate: serializeKanbanDueDate(card.startDate),
          dueDate: serializeKanbanDueDate(card.dueDate),
          assigneeId: card.assigneeId,
          overdue: isKanbanDueDateOverdue(card.dueDate),
        }));

        return {
          boardId: board.id,
          boardTitle: board.title,
          dueFilter: dueFilter ?? null,
          from: filterFrom,
          to: filterTo,
          cards: limited,
          count: limited.length,
          totalMatched: filtered.length,
        };
      },
    }),

    createKanbanCard: tool({
      description:
        "Cria um card em um board Kanban. Informe boardId e a coluna (columnId ou columnName). Prazo: startDate e dueDate em YYYY-MM-DD.",
      inputSchema: z.object({
        boardId: z.string().min(1),
        columnId: z.string().min(1).optional(),
        columnName: z.string().min(1).max(80).optional(),
        title: z.string().min(1).max(120),
        description: z.string().max(10_000).nullable().optional(),
        assigneeId: z.string().min(1).nullable().optional(),
        startDate: dueDateInputSchema.describe("Início do prazo YYYY-MM-DD ou null"),
        dueDate: dueDateInputSchema.describe("Fim do prazo YYYY-MM-DD ou null"),
      }),
      execute: async ({
        boardId,
        columnId,
        columnName,
        title,
        description,
        assigneeId,
        startDate,
        dueDate,
      }) => {
        const board = await prisma.kanbanBoard.findFirst({
          where: { id: boardId, workspaceId, deletedAt: null },
          select: { id: true, title: true },
        });
        if (!board) {
          return { error: "Board Kanban não encontrado neste workspace." };
        }

        const resolved = await resolveKanbanColumnId({
          boardId,
          columnId,
          columnName,
        });
        if ("error" in resolved) return resolved;

        if (assigneeId) {
          const member = await prisma.member.findFirst({
            where: { organizationId: workspaceId, userId: assigneeId },
            select: { id: true },
          });
          if (!member) {
            return { error: "Responsável precisa ser membro do workspace." };
          }
        }

        if (
          typeof startDate === "string" &&
          typeof dueDate === "string" &&
          startDate > dueDate
        ) {
          return { error: "startDate deve ser anterior ou igual a dueDate." };
        }

        const agg = await prisma.kanbanCard.aggregate({
          where: { boardId, columnId: resolved.columnId },
          _max: { position: true },
        });

        const card = await prisma.kanbanCard.create({
          data: {
            boardId,
            columnId: resolved.columnId,
            title,
            description: description ?? null,
            assigneeId: assigneeId ?? null,
            startDate: parseKanbanDueDate(startDate) ?? null,
            dueDate: parseKanbanDueDate(dueDate) ?? null,
            position: nextAppendPosition(agg._max.position),
            createdById: userId,
          },
          select: {
            id: true,
            title: true,
            description: true,
            columnId: true,
            startDate: true,
            dueDate: true,
            assigneeId: true,
          },
        });

        return {
          created: true,
          boardId: board.id,
          card: {
            ...card,
            startDate: serializeKanbanDueDate(card.startDate),
            dueDate: serializeKanbanDueDate(card.dueDate),
          },
          message: `Card "${card.title}" criado em "${board.title}".`,
        };
      },
    }),

    updateKanbanCard: tool({
      description:
        "Atualiza título, descrição, responsável ou prazo de um card Kanban. startDate/dueDate em YYYY-MM-DD (null remove).",
      inputSchema: z.object({
        boardId: z.string().min(1),
        cardId: z.string().min(1),
        title: z.string().min(1).max(120).optional(),
        description: z.string().max(10_000).nullable().optional(),
        assigneeId: z.string().min(1).nullable().optional(),
        startDate: dueDateInputSchema.describe("Início do prazo YYYY-MM-DD ou null"),
        dueDate: dueDateInputSchema.describe("Fim do prazo YYYY-MM-DD ou null"),
      }),
      execute: async ({
        boardId,
        cardId,
        title,
        description,
        assigneeId,
        startDate,
        dueDate,
      }) => {
        if (
          title === undefined &&
          description === undefined &&
          assigneeId === undefined &&
          startDate === undefined &&
          dueDate === undefined
        ) {
          return { error: "Informe ao menos um campo para atualizar." };
        }

        const board = await prisma.kanbanBoard.findFirst({
          where: { id: boardId, workspaceId, deletedAt: null },
          select: { id: true },
        });
        if (!board) {
          return { error: "Board Kanban não encontrado neste workspace." };
        }

        const existing = await prisma.kanbanCard.findFirst({
          where: { id: cardId, boardId },
          select: { id: true },
        });
        if (!existing) {
          return { error: "Card não encontrado neste board." };
        }

        if (assigneeId) {
          const member = await prisma.member.findFirst({
            where: { organizationId: workspaceId, userId: assigneeId },
            select: { id: true },
          });
          if (!member) {
            return { error: "Responsável precisa ser membro do workspace." };
          }
        }

        if (
          typeof startDate === "string" &&
          typeof dueDate === "string" &&
          startDate > dueDate
        ) {
          return { error: "startDate deve ser anterior ou igual a dueDate." };
        }

        const card = await prisma.kanbanCard.update({
          where: { id: cardId },
          data: {
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(assigneeId !== undefined && {
              assignee:
                assigneeId === null
                  ? { disconnect: true }
                  : { connect: { id: assigneeId } },
            }),
            ...(startDate !== undefined && {
              startDate: parseKanbanDueDate(startDate) ?? null,
            }),
            ...(dueDate !== undefined && {
              dueDate: parseKanbanDueDate(dueDate) ?? null,
            }),
          },
          select: {
            id: true,
            title: true,
            description: true,
            columnId: true,
            startDate: true,
            dueDate: true,
            assigneeId: true,
          },
        });

        return {
          updated: true,
          boardId,
          card: {
            ...card,
            startDate: serializeKanbanDueDate(card.startDate),
            dueDate: serializeKanbanDueDate(card.dueDate),
          },
          message: `Card "${card.title}" atualizado.`,
        };
      },
    }),

    moveKanbanCard: tool({
      description:
        "Move um card Kanban para outra coluna (columnId ou columnName) e/ou posição (beforeCardId/afterCardId).",
      inputSchema: z.object({
        boardId: z.string().min(1),
        cardId: z.string().min(1),
        columnId: z.string().min(1).optional(),
        columnName: z.string().min(1).max(80).optional(),
        beforeCardId: z.string().nullable().optional(),
        afterCardId: z.string().nullable().optional(),
      }),
      execute: async ({
        boardId,
        cardId,
        columnId,
        columnName,
        beforeCardId,
        afterCardId,
      }) => {
        const board = await prisma.kanbanBoard.findFirst({
          where: { id: boardId, workspaceId, deletedAt: null },
          select: { id: true },
        });
        if (!board) {
          return { error: "Board Kanban não encontrado neste workspace." };
        }

        const card = await prisma.kanbanCard.findFirst({
          where: { id: cardId, boardId },
        });
        if (!card) {
          return { error: "Card não encontrado neste board." };
        }

        let nextColumnId = card.columnId;
        if (columnId || columnName) {
          const resolved = await resolveKanbanColumnId({
            boardId,
            columnId,
            columnName,
          });
          if ("error" in resolved) return resolved;
          nextColumnId = resolved.columnId;
        }

        const hasNeighbors =
          beforeCardId !== undefined || afterCardId !== undefined;
        let nextPosition: number | undefined;

        if (hasNeighbors) {
          const [before, after] = await Promise.all([
            beforeCardId
              ? prisma.kanbanCard.findFirst({
                  where: {
                    id: beforeCardId,
                    boardId,
                    columnId: nextColumnId,
                  },
                  select: { position: true },
                })
              : Promise.resolve(null),
            afterCardId
              ? prisma.kanbanCard.findFirst({
                  where: {
                    id: afterCardId,
                    boardId,
                    columnId: nextColumnId,
                  },
                  select: { position: true },
                })
              : Promise.resolve(null),
          ]);

          if (beforeCardId && !before) {
            return { error: "beforeCardId inválido nesta coluna." };
          }
          if (afterCardId && !after) {
            return { error: "afterCardId inválido nesta coluna." };
          }

          nextPosition = computeFractionalPosition(
            before?.position ?? null,
            after?.position ?? null,
          );
        } else if (nextColumnId !== card.columnId) {
          const agg = await prisma.kanbanCard.aggregate({
            where: { boardId, columnId: nextColumnId },
            _max: { position: true },
          });
          nextPosition = nextAppendPosition(agg._max.position);
        }

        const updated = await prisma.kanbanCard.update({
          where: { id: cardId },
          data: {
            column: { connect: { id: nextColumnId } },
            ...(nextPosition !== undefined && { position: nextPosition }),
          },
          select: {
            id: true,
            title: true,
            columnId: true,
            position: true,
          },
        });

        return {
          updated: true,
          boardId,
          card: updated,
          message: `Card "${updated.title}" movido.`,
        };
      },
    }),

    deleteKanbanCard: tool({
      description:
        "Exclui permanentemente um card de um board Kanban. Confirme boardId e cardId.",
      inputSchema: z.object({
        boardId: z.string().min(1),
        cardId: z.string().min(1),
      }),
      execute: async ({ boardId, cardId }) => {
        const board = await prisma.kanbanBoard.findFirst({
          where: { id: boardId, workspaceId, deletedAt: null },
          select: { id: true, title: true },
        });
        if (!board) {
          return { error: "Board Kanban não encontrado neste workspace." };
        }

        const card = await prisma.kanbanCard.findFirst({
          where: { id: cardId, boardId },
          select: { id: true, title: true },
        });
        if (!card) {
          return { error: "Card não encontrado neste board." };
        }

        await prisma.kanbanCard.delete({ where: { id: cardId } });

        return {
          deleted: true,
          boardId: board.id,
          cardId: card.id,
          title: card.title,
          message: `Card "${card.title}" excluído de "${board.title}".`,
        };
      },
    }),

    deleteKanbanBoard: tool({
      description:
        "Exclui (soft-delete) um board Kanban do workspace. Só owner/admin. Só use com pedido explícito. Requer confirmação do usuário.",
      inputSchema: z.object({
        boardId: z.string().min(1).describe("Id do board Kanban"),
      }),
      needsApproval: true,
      execute: async ({ boardId }) => {
        const member = await prisma.member.findFirst({
          where: { organizationId: workspaceId, userId },
          select: { role: true },
        });
        if (!member || !isWorkspaceAdmin(member.role)) {
          return {
            error: "Apenas owner/admin pode excluir boards Kanban.",
          };
        }

        const board = await prisma.kanbanBoard.findFirst({
          where: { id: boardId, workspaceId, deletedAt: null },
          select: {
            id: true,
            title: true,
            _count: { select: { cards: true, columns: true } },
          },
        });
        if (!board) {
          return { error: "Board Kanban não encontrado neste workspace." };
        }

        await prisma.kanbanBoard.update({
          where: { id: board.id },
          data: { deletedAt: new Date() },
        });

        return {
          deleted: true,
          boardId: board.id,
          board: {
            id: board.id,
            title: board.title,
            cardsRemoved: board._count.cards,
            columnsCount: board._count.columns,
          },
          message: `Board Kanban "${board.title}" excluído (${board._count.cards} card(s)).`,
        };
      },
    }),

    listResourceCollections: tool({
      description:
        "Lista coleções de RECURSOS (links/bookmarks) do workspace ativo. Não confunda com pastas de notas.",
      inputSchema: z.object({}),
      execute: async () => {
        const collections = await prisma.collection.findMany({
          where: { workspaceId, isNoteCollection: false },
          orderBy: { name: "asc" },
          select: { id: true, name: true, color: true },
        });
        return { collections };
      },
    }),

    listResources: tool({
      description:
        "Lista RECURSOS (links/bookmarks) do workspace ativo. Filtre por collectionId quando o usuário mencionar uma coleção de recursos. Não retorna notas.",
      inputSchema: z.object({
        collectionId: z
          .string()
          .optional()
          .describe("Id da coleção de recursos (opcional)"),
        query: z
          .string()
          .max(120)
          .optional()
          .describe("Filtra por título ou URL"),
        limit: z.number().int().min(1).max(40).optional(),
      }),
      execute: async ({ collectionId, query, limit = 20 }) => {
        if (collectionId) {
          const collection = await prisma.collection.findFirst({
            where: {
              id: collectionId,
              workspaceId,
              isNoteCollection: false,
            },
            select: { id: true, name: true },
          });
          if (!collection) {
            return {
              error:
                "Coleção de recursos não encontrada neste workspace. Use listResourceCollections.",
            };
          }
        }

        const resources = await prisma.resource.findMany({
          where: {
            collection: {
              workspaceId,
              isNoteCollection: false,
              ...(collectionId ? { id: collectionId } : {}),
            },
            ...(query?.trim()
              ? {
                  OR: [
                    { title: { contains: query, mode: "insensitive" as const } },
                    { url: { contains: query, mode: "insensitive" as const } },
                  ],
                }
              : {}),
          },
          orderBy: { updatedAt: "desc" },
          take: limit,
          select: {
            id: true,
            title: true,
            url: true,
            description: true,
            collectionId: true,
            updatedAt: true,
            categories: { select: { id: true, name: true } },
          },
        });

        return {
          count: resources.length,
          resources,
        };
      },
    }),

    getResource: tool({
      description:
        "Lê um RECURSO (link/bookmark) pelo id. Não é uma nota.",
      inputSchema: z.object({
        resourceId: z.string().min(1).describe("Id do recurso"),
      }),
      execute: async ({ resourceId }) => {
        const resource = await prisma.resource.findFirst({
          where: {
            id: resourceId,
            collection: { workspaceId, isNoteCollection: false },
          },
          select: {
            id: true,
            title: true,
            url: true,
            description: true,
            iconUrl: true,
            ogImageUrl: true,
            collectionId: true,
            collection: { select: { id: true, name: true } },
            categories: { select: { id: true, name: true } },
          },
        });
        if (!resource) {
          return { error: "Recurso não encontrado neste workspace." };
        }
        return { resource };
      },
    }),

    getNoteBacklinks: tool({
      description:
        "Lista notas que mencionam (linkam para) a nota alvo via wiki-link.",
      inputSchema: z.object({
        noteId: z
          .string()
          .min(1)
          .optional()
          .describe("Id da nota alvo. Se omitido, usa a nota aberta."),
      }),
      execute: async ({ noteId }) => {
        const targetId = noteId ?? currentNoteId;
        if (!targetId) {
          return {
            error: "Informe noteId ou abra uma nota para listar backlinks.",
          };
        }

        const target = await prisma.note.findUnique({
          where: { id: targetId, workspaceId },
          select: { id: true },
        });
        if (!target) {
          return { error: "Nota não encontrada neste workspace." };
        }

        const links = await prisma.noteLink.findMany({
          where: { targetId, source: { workspaceId } },
          select: {
            source: {
              select: { id: true, title: true, icon: true, updatedAt: true },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: 30,
        });

        return {
          noteId: targetId,
          linkedFrom: links.map((link) => link.source),
        };
      },
    }),

    listNoteBlocks: tool({
      description:
        "Lista os blocos top-level de uma nota com índice e texto. Use antes de removeNoteBlock/replaceNoteBlock para achar o bloco certo.",
      inputSchema: z.object({
        noteId: z
          .string()
          .min(1)
          .optional()
          .describe("Id da nota. Se omitido, usa a nota aberta."),
      }),
      execute: async ({ noteId }) => {
        const targetId = noteId ?? currentNoteId;
        if (!targetId) {
          return { error: "Informe noteId ou abra uma nota." };
        }
        const loaded = await loadNoteDoc(workspaceId, targetId);
        if (!loaded) {
          return { error: "Nota não encontrada neste workspace." };
        }
        const blocks = listDocBlocks(loaded.doc);
        return {
          noteId: loaded.note.id,
          title: loaded.note.title,
          count: blocks.length,
          blocks,
        };
      },
    }),

    removeNoteText: tool({
      description:
        "Remove blocos de uma nota FECHADA cujo texto contém o trecho. NÃO use na nota aberta no editor — nesse caso use replaceBlock/replaceSelection.",
      inputSchema: z.object({
        noteId: z
          .string()
          .min(1)
          .describe("Id da nota FECHADA (não pode ser a nota aberta)"),
        text: z
          .string()
          .min(1)
          .max(500)
          .describe("Trecho a remover (match case-insensitive no bloco)"),
      }),
      execute: async ({ noteId, text }) => {
        const targetId = noteId;
        const openRefuse = refuseIfOpenNote(targetId, currentNoteId);
        if (openRefuse) return openRefuse;

        const loaded = await loadNoteDoc(workspaceId, targetId);
        if (!loaded) {
          return { error: "Nota não encontrada neste workspace." };
        }

        const result = removeBlocksMatchingText(loaded.doc, text);
        if (result.removedCount === 0) {
          return {
            updated: false,
            noteId: loaded.note.id,
            title: loaded.note.title,
            message: `Nenhum bloco contendo "${text}" foi encontrado.`,
          };
        }

        await prisma.note.update({
          where: { id: loaded.note.id },
          data: { content: toPrismaJson(result.doc) },
        });

        return {
          updated: true,
          note: { id: loaded.note.id, title: loaded.note.title },
          removedCount: result.removedCount,
          removedTexts: result.removedTexts,
          message: `Removido(s) ${result.removedCount} bloco(s) de "${loaded.note.title}".`,
        };
      },
    }),

    removeNoteBlock: tool({
      description:
        "Remove um bloco de uma nota FECHADA pelo índice. NÃO use na nota aberta — use replaceBlock com content \"\".",
      inputSchema: z.object({
        noteId: z
          .string()
          .min(1)
          .describe("Id da nota FECHADA (não pode ser a nota aberta)"),
        blockIndex: z.number().int().min(0).describe("Índice do bloco"),
      }),
      execute: async ({ noteId, blockIndex }) => {
        const targetId = noteId;
        const openRefuse = refuseIfOpenNote(targetId, currentNoteId);
        if (openRefuse) return openRefuse;

        const loaded = await loadNoteDoc(workspaceId, targetId);
        if (!loaded) {
          return { error: "Nota não encontrada neste workspace." };
        }

        const result = removeBlockAt(loaded.doc, blockIndex);
        if (!result.removed) {
          return {
            error: `Bloco ${blockIndex} não existe (a nota tem ${loaded.doc.content?.length ?? 0} bloco(s)).`,
          };
        }

        await prisma.note.update({
          where: { id: loaded.note.id },
          data: { content: toPrismaJson(result.doc) },
        });

        const removedText = listDocBlocks({
          type: "doc",
          content: [result.removed],
        })[0]?.text;

        return {
          updated: true,
          note: { id: loaded.note.id, title: loaded.note.title },
          removedBlockIndex: blockIndex,
          removedText: removedText || null,
          message: `Bloco ${blockIndex} removido de "${loaded.note.title}".`,
        };
      },
    }),

    replaceNoteBlock: tool({
      description:
        "Substitui/apaga um bloco de uma nota FECHADA. NÃO use na nota aberta — use replaceBlock.",
      inputSchema: z.object({
        noteId: z
          .string()
          .min(1)
          .describe("Id da nota FECHADA (não pode ser a nota aberta)"),
        blockIndex: z.number().int().min(0),
        content: z
          .string()
          .describe('Novo texto do bloco. Use "" para apagar o bloco.'),
      }),
      execute: async ({ noteId, blockIndex, content }) => {
        const targetId = noteId;
        const openRefuse = refuseIfOpenNote(targetId, currentNoteId);
        if (openRefuse) return openRefuse;

        const loaded = await loadNoteDoc(workspaceId, targetId);
        if (!loaded) {
          return { error: "Nota não encontrada neste workspace." };
        }

        const result = replaceBlockWithPlainText(
          loaded.doc,
          blockIndex,
          content,
        );
        if (!result.ok) {
          return {
            error: `Bloco ${blockIndex} não existe (a nota tem ${loaded.doc.content?.length ?? 0} bloco(s)).`,
          };
        }

        await prisma.note.update({
          where: { id: loaded.note.id },
          data: { content: toPrismaJson(result.doc) },
        });

        return {
          updated: true,
          note: { id: loaded.note.id, title: loaded.note.title },
          blockIndex,
          deleted: content.trim().length === 0,
          message:
            content.trim().length === 0
              ? `Bloco ${blockIndex} apagado em "${loaded.note.title}".`
              : `Bloco ${blockIndex} atualizado em "${loaded.note.title}".`,
        };
      },
    }),

    createNote: tool({
      description:
        "Cria uma nota vazia no workspace ativo. Use quando o usuário pedir para criar uma nota.",
      inputSchema: z.object({
        title: z.string().min(1).max(200),
        collectionId: z
          .string()
          .optional()
          .describe("Pasta de notas (opcional)"),
      }),
      execute: async ({ title, collectionId }) => {
        if (collectionId) {
          const collection = await prisma.collection.findFirst({
            where: {
              id: collectionId,
              workspaceId,
              isNoteCollection: true,
            },
            select: { id: true },
          });
          if (!collection) {
            return { error: "Coleção de notas inválida neste workspace." };
          }
        }

        const note = await prisma.note.create({
          data: {
            title,
            content: { type: "doc", content: [] },
            userId,
            workspaceId,
            collectionId: collectionId ?? null,
          },
          select: { id: true, title: true, collectionId: true },
        });

        return {
          created: true,
          note,
          message: `Nota "${note.title}" criada.`,
        };
      },
    }),

    renameNote: tool({
      description:
        "Renomeia uma nota do workspace ativo. Use quando o usuário pedir para mudar o título.",
      inputSchema: z.object({
        noteId: z.string().min(1).describe("Id da nota"),
        title: z.string().min(1).max(200).describe("Novo título"),
      }),
      execute: async ({ noteId, title }) => {
        const existing = await prisma.note.findUnique({
          where: { id: noteId, workspaceId },
          select: { id: true, title: true },
        });
        if (!existing) {
          return { error: "Nota não encontrada neste workspace." };
        }

        const note = await prisma.note.update({
          where: { id: existing.id },
          data: { title },
          select: { id: true, title: true, collectionId: true },
        });

        return {
          updated: true,
          note,
          previousTitle: existing.title,
          message: `Nota renomeada de "${existing.title}" para "${note.title}".`,
        };
      },
    }),

    moveNote: tool({
      description:
        "Move uma nota para outra pasta de notas (ou remove da pasta com collectionId null). Use listNoteCollections para achar o id da pasta.",
      inputSchema: z.object({
        noteId: z.string().min(1).describe("Id da nota"),
        collectionId: z
          .string()
          .nullable()
          .describe(
            "Id da pasta de notas destino, ou null para tirar da pasta",
          ),
      }),
      execute: async ({ noteId, collectionId }) => {
        const existing = await prisma.note.findUnique({
          where: { id: noteId, workspaceId },
          select: {
            id: true,
            title: true,
            collectionId: true,
            collection: { select: { id: true, name: true } },
          },
        });
        if (!existing) {
          return { error: "Nota não encontrada neste workspace." };
        }

        if (collectionId) {
          const collection = await prisma.collection.findFirst({
            where: {
              id: collectionId,
              workspaceId,
              isNoteCollection: true,
            },
            select: { id: true, name: true },
          });
          if (!collection) {
            return { error: "Pasta de notas inválida neste workspace." };
          }

          const note = await prisma.note.update({
            where: { id: existing.id },
            data: { collectionId: collection.id },
            select: {
              id: true,
              title: true,
              collectionId: true,
              collection: { select: { id: true, name: true } },
            },
          });

          return {
            updated: true,
            note,
            previousCollectionId: existing.collectionId,
            message: `Nota "${note.title}" movida para "${collection.name}".`,
          };
        }

        const note = await prisma.note.update({
          where: { id: existing.id },
          data: { collectionId: null },
          select: { id: true, title: true, collectionId: true },
        });

        return {
          updated: true,
          note,
          previousCollectionId: existing.collectionId,
          message: `Nota "${note.title}" removida da pasta.`,
        };
      },
    }),

    createCollection: tool({
      description:
        "Cria uma coleção no workspace ativo. isNoteCollection=true = pasta de notas; false = coleção de recursos (links).",
      inputSchema: z.object({
        name: z.string().min(1).max(120),
        isNoteCollection: z
          .boolean()
          .describe(
            "true = pasta de notas; false = coleção de recursos/links",
          ),
        description: z.string().max(500).optional(),
        color: z.string().max(40).optional(),
      }),
      execute: async ({ name, isNoteCollection, description, color }) => {
        const baseSlug = slugify(name, { lower: true, strict: true }) || "colecao";
        let slug = baseSlug;
        let attempt = 0;

        while (attempt < 8) {
          const existing = await prisma.collection.findFirst({
            where: { workspaceId, slug },
            select: { id: true },
          });
          if (!existing) break;
          attempt += 1;
          slug = `${baseSlug}-${attempt + 1}`;
        }

        try {
          const collection = await prisma.collection.create({
            data: {
              name,
              slug,
              userId,
              workspaceId,
              isNoteCollection,
              ...(description !== undefined ? { description } : {}),
              ...(color !== undefined ? { color } : {}),
            },
            select: {
              id: true,
              name: true,
              slug: true,
              isNoteCollection: true,
              description: true,
              color: true,
            },
          });

          return {
            created: true,
            collection,
            message: isNoteCollection
              ? `Pasta de notas "${collection.name}" criada.`
              : `Coleção de recursos "${collection.name}" criada.`,
          };
        } catch {
          return {
            error: "Não foi possível criar a coleção (slug duplicado?).",
          };
        }
      },
    }),

    createResource: tool({
      description:
        "Cria um RECURSO (link/bookmark) em uma coleção de recursos do workspace ativo. Não cria notas.",
      inputSchema: z.object({
        title: z.string().min(1).max(200),
        url: z.string().url().max(2000),
        collectionId: z
          .string()
          .min(1)
          .describe("Id da coleção de recursos (isNoteCollection=false)"),
        description: z.string().max(1000).optional(),
        categoryIds: z
          .array(z.string())
          .max(20)
          .optional()
          .describe("Ids de categorias existentes no workspace (opcional)"),
      }),
      execute: async ({
        title,
        url,
        collectionId,
        description,
        categoryIds = [],
      }) => {
        const collection = await prisma.collection.findFirst({
          where: {
            id: collectionId,
            workspaceId,
            isNoteCollection: false,
          },
          select: { id: true, name: true },
        });
        if (!collection) {
          return {
            error:
              "Coleção de recursos inválida. Use listResourceCollections ou createCollection com isNoteCollection=false.",
          };
        }

        if (categoryIds.length > 0) {
          const validCategories = await prisma.category.findMany({
            where: { id: { in: categoryIds }, workspaceId },
            select: { id: true },
          });
          if (validCategories.length !== categoryIds.length) {
            return { error: "Uma ou mais categorias são inválidas." };
          }
        }

        try {
          const resource = await prisma.resource.create({
            data: {
              title,
              url,
              description: description ?? null,
              collectionId,
              fetchedAt: new Date(),
              categories: {
                connect: categoryIds.map((id) => ({ id })),
              },
            },
            select: {
              id: true,
              title: true,
              url: true,
              description: true,
              collectionId: true,
            },
          });

          return {
            created: true,
            resource,
            message: `Recurso "${resource.title}" criado em "${collection.name}".`,
          };
        } catch {
          return {
            error:
              "Não foi possível criar o recurso (URL duplicada nesta coleção?).",
          };
        }
      },
    }),

    deleteNote: tool({
      description:
        "Exclui permanentemente uma nota do workspace ativo. Só use com pedido explícito do usuário. Requer confirmação do usuário antes de executar.",
      inputSchema: z.object({
        noteId: z.string().min(1).describe("Id da nota a excluir"),
      }),
      needsApproval: true,
      execute: async ({ noteId }) => {
        const note = await prisma.note.findUnique({
          where: { id: noteId, workspaceId },
          select: { id: true, title: true },
        });
        if (!note) {
          return { error: "Nota não encontrada neste workspace." };
        }

        await prisma.note.delete({ where: { id: note.id } });

        return {
          deleted: true,
          note: { id: note.id, title: note.title },
          message: `Nota "${note.title}" excluída.`,
        };
      },
    }),

    deleteCollection: tool({
      description:
        "Exclui uma coleção do workspace ativo (pasta de notas ou coleção de recursos). Cascata: notas/recursos dentro também são removidos. Só use com pedido explícito. Requer confirmação do usuário.",
      inputSchema: z.object({
        collectionId: z.string().min(1).describe("Id da coleção"),
      }),
      needsApproval: true,
      execute: async ({ collectionId }) => {
        const collection = await prisma.collection.findFirst({
          where: { id: collectionId, workspaceId },
          select: {
            id: true,
            name: true,
            isNoteCollection: true,
            _count: { select: { notes: true, resources: true } },
          },
        });
        if (!collection) {
          return { error: "Coleção não encontrada neste workspace." };
        }

        await prisma.collection.delete({ where: { id: collection.id } });

        return {
          deleted: true,
          collection: {
            id: collection.id,
            name: collection.name,
            isNoteCollection: collection.isNoteCollection,
            notesRemoved: collection._count.notes,
            resourcesRemoved: collection._count.resources,
          },
          message: collection.isNoteCollection
            ? `Pasta de notas "${collection.name}" excluída (${collection._count.notes} nota(s)).`
            : `Coleção de recursos "${collection.name}" excluída (${collection._count.resources} recurso(s)).`,
        };
      },
    }),

    deleteResource: tool({
      description:
        "Exclui um RECURSO (link/bookmark) do workspace ativo. Não exclui notas. Só use com pedido explícito. Requer confirmação do usuário.",
      inputSchema: z.object({
        resourceId: z.string().min(1).describe("Id do recurso"),
      }),
      needsApproval: true,
      execute: async ({ resourceId }) => {
        const resource = await prisma.resource.findFirst({
          where: {
            id: resourceId,
            collection: { workspaceId, isNoteCollection: false },
          },
          select: {
            id: true,
            title: true,
            url: true,
            collectionId: true,
          },
        });
        if (!resource) {
          return { error: "Recurso não encontrado neste workspace." };
        }

        await prisma.resource.delete({ where: { id: resource.id } });

        return {
          deleted: true,
          resource,
          message: `Recurso "${resource.title}" excluído.`,
        };
      },
    }),

    createAgentSkill: tool({
      description:
        "Cria uma skill reutilizável do Agent (prompt nomeado). Use quando o usuário pedir para criar/salvar uma skill, um prompt pronto, ou um atalho `/Nome`. Skills pessoais ficam só com o autor; workspace ficam disponíveis ao time. O usuário ativa depois com `/Título` no chat.",
      inputSchema: z.object({
        title: z
          .string()
          .trim()
          .min(1)
          .max(150)
          .describe("Nome curto da skill (aparece no /picker)"),
        prompt: z
          .string()
          .trim()
          .min(1)
          .max(10000)
          .describe(
            "Instruções que o Agent deve seguir quando a skill for selecionada",
          ),
        description: z
          .string()
          .trim()
          .max(500)
          .optional()
          .describe("Resumo curto opcional para a lista de skills"),
        requiresNote: z
          .boolean()
          .optional()
          .default(false)
          .describe("Se true, a skill só faz sentido com uma nota aberta"),
        visibility: z
          .enum(["personal", "workspace"])
          .optional()
          .default("personal")
          .describe("personal = só o usuário; workspace = time do workspace"),
      }),
      execute: async ({
        title,
        prompt,
        description,
        requiresNote,
        visibility,
      }) => {
        const skill = await prisma.agentSkill.create({
          data: {
            title,
            description: description?.trim() ? description.trim() : null,
            prompt,
            requiresNote: requiresNote ?? false,
            visibility: visibility ?? "personal",
            userId,
            workspaceId: visibility === "workspace" ? workspaceId : null,
          },
          select: {
            id: true,
            title: true,
            description: true,
            requiresNote: true,
            visibility: true,
          },
        });

        return {
          created: true,
          skill,
          message: `Skill "${skill.title}" criada (${skill.visibility === "workspace" ? "workspace" : "pessoal"}). Use /${skill.title} no chat para ativar.`,
        };
      },
    }),
  } as const;
}

export type WorkspaceToolName = keyof ReturnType<typeof createWorkspaceTools>;
