import { createTLSchema, defaultShapeSchemas } from "@tldraw/tlschema";

/**
 * Schema padrão do tldraw (todas as shapes built-in).
 * Quando a gente criar custom shapes (v4), adiciona aqui.
 */
export const schema = createTLSchema({
  shapes: defaultShapeSchemas,
});
