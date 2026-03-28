export const noteKeys = {
  all: ["notes"] as const,
  detail: (id: string) => ["notes", id] as const,
};
