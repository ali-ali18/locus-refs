import {
  createTLSchema,
  defaultBindingSchemas,
  defaultShapeSchemas,
} from "@tldraw/tlschema";

/**
 * Schema do tldraw usado pelo servidor (DO).
 *
 * Espelha exatamente o schema que o cliente conhece — qualquer shape
 * customizada que o cliente usar precisa ser registrada aqui também.
 *
 * Por enquanto usamos só as shapes/bindings nativas (sticky notes, setas,
 * geo, etc.). Pra adicionar custom shapes, segue o padrão do starter kit
 * oficial:
 *
 *   'my-shape': {
 *     props: { text: { type: 'string', default: '' } },
 *     migrations: { currentVersion: 1, migrators: {} },
 *   }
 */
export const schema = createTLSchema({
  shapes: { ...defaultShapeSchemas },
  bindings: { ...defaultBindingSchemas },
});
