import { z } from "zod";

const isoDateTime = z
  .string()
  .datetime({ offset: true })
  .or(z.string().datetime());

const imageUrlSchema = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (v) => v.startsWith("/storage/") || /^https?:\/\//.test(v),
    "URL de imagem inválida",
  )
  .nullable()
  .optional();

const createCalendarEventSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).nullable().optional(),
    startAt: isoDateTime,
    endAt: isoDateTime.nullable().optional(),
    allDay: z.boolean().optional().default(false),
    remindAt: isoDateTime.nullable().optional(),
    visibility: z
      .enum(["personal", "workspace"])
      .optional()
      .default("personal"),
    color: z
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida")
      .nullable()
      .optional(),
    imageUrl: imageUrlSchema,
    assigneeIds: z.array(z.string().min(1)).optional().default([]),
  })
  .refine(
    (v) => {
      if (!v.endAt) return true;
      return new Date(v.endAt).getTime() >= new Date(v.startAt).getTime();
    },
    { message: "endAt must be >= startAt", path: ["endAt"] },
  );

const updateCalendarEventSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    startAt: isoDateTime.optional(),
    endAt: isoDateTime.nullable().optional(),
    allDay: z.boolean().optional(),
    remindAt: isoDateTime.nullable().optional(),
    visibility: z.enum(["personal", "workspace"]).optional(),
    color: z
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida")
      .nullable()
      .optional(),
    imageUrl: imageUrlSchema,
    assigneeIds: z.array(z.string().min(1)).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Empty update object" });

const listCalendarEventsQuerySchema = z.object({
  from: isoDateTime,
  to: isoDateTime,
  visibility: z
    .enum(["personal", "workspace", "all"])
    .optional()
    .default("all"),
});

const calendarEventDialogSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).nullable().optional(),
    startAt: isoDateTime,
    endAt: isoDateTime.nullable().optional(),
    allDay: z.boolean().optional().default(false),
    remindAt: isoDateTime.nullable().optional(),
    visibility: z
      .enum(["personal", "workspace"])
      .optional()
      .default("personal"),
    color: z
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida")
      .nullable()
      .optional(),
    imageUrl: imageUrlSchema,
    assigneeIds: z.array(z.string().min(1)).optional().default([]),
    startTime: z
      .string()
      .transform((v) => v.slice(0, 5))
      .pipe(z.string().regex(/^\d{2}:\d{2}$/, "Horário inicial inválido")),
    endTime: z
      .string()
      .transform((v) => v.slice(0, 5))
      .pipe(
        z
          .string()
          .regex(/^\d{2}:\d{2}$/, "Horário final inválido")
          .or(z.literal("")),
      ),
  });

type CalendarEventDialogSchema = z.input<typeof calendarEventDialogSchema>;
type CreateCalendarEventSchema = z.infer<typeof createCalendarEventSchema>;
type UpdateCalendarEventSchema = z.infer<typeof updateCalendarEventSchema>;

export {
  createCalendarEventSchema,
  updateCalendarEventSchema,
  listCalendarEventsQuerySchema,
  calendarEventDialogSchema,
  type CreateCalendarEventSchema,
  type UpdateCalendarEventSchema,
  type CalendarEventDialogSchema,
};
