import { z } from "zod";

export const MAX_KANBAN_COLUMNS = 20;

export const createKanbanBoardSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  icon: z.string().max(60).optional(),
});

export type CreateKanbanBoardSchema = z.infer<typeof createKanbanBoardSchema>;

export const updateKanbanBoardSchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).nullable().optional(),
    icon: z.string().max(60).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateKanbanBoardSchema = z.infer<typeof updateKanbanBoardSchema>;

export const createKanbanColumnSchema = z.object({
  name: z.string().min(1).max(80),
  color: z.string().max(32).nullable().optional(),
});

export type CreateKanbanColumnSchema = z.infer<typeof createKanbanColumnSchema>;

export const updateKanbanColumnSchema = z
  .object({
    name: z.string().min(1).max(80).optional(),
    color: z.string().max(32).nullable().optional(),
    beforeColumnId: z.string().nullable().optional(),
    afterColumnId: z.string().nullable().optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.color !== undefined ||
      value.beforeColumnId !== undefined ||
      value.afterColumnId !== undefined,
    { message: "At least one field must be provided" },
  );

export type UpdateKanbanColumnSchema = z.infer<typeof updateKanbanColumnSchema>;

const columnTargetSchema = z
  .object({
    columnId: z.string().min(1).optional(),
    columnName: z.string().min(1).max(80).optional(),
  })
  .refine((value) => Boolean(value.columnId || value.columnName), {
    message: "columnId or columnName is required",
  });

export const createKanbanCardSchema = columnTargetSchema.and(
  z.object({
    title: z.string().min(1).max(120),
    description: z.string().max(10_000).nullable().optional(),
    assigneeId: z.string().min(1).nullable().optional(),
  }),
);

export type CreateKanbanCardSchema = z.infer<typeof createKanbanCardSchema>;

export const updateKanbanCardSchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(10_000).nullable().optional(),
    assigneeId: z.string().min(1).nullable().optional(),
    columnId: z.string().min(1).optional(),
    columnName: z.string().min(1).max(80).optional(),
    beforeCardId: z.string().nullable().optional(),
    afterCardId: z.string().nullable().optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.assigneeId !== undefined ||
      value.columnId !== undefined ||
      value.columnName !== undefined ||
      value.beforeCardId !== undefined ||
      value.afterCardId !== undefined,
    { message: "At least one field must be provided" },
  );

export type UpdateKanbanCardSchema = z.infer<typeof updateKanbanCardSchema>;

export const moveKanbanCardSchema = columnTargetSchema.and(
  z.object({
    beforeCardId: z.string().nullable().optional(),
    afterCardId: z.string().nullable().optional(),
  }),
);

export type MoveKanbanCardSchema = z.infer<typeof moveKanbanCardSchema>;
