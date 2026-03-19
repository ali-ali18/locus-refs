import { TextStyle } from "@tiptap/extension-text-style";

/**
 * Corrige um comportamento do `removeEmptyTextStyle()` do Tiptap:
 * ao fazer `unsetColor()`/`unsetBackgroundColor()`, o comando pode remover
 * o `textStyle` em nós *de bloco* (ex.: itens de lista/blockquote),
 * afetando cores de todo o conteúdo dentro desses blocos.
 *
 * Aqui removemos apenas em nós inline, mantendo o reset limitado à seleção.
 */
export const CustomTextStyle = TextStyle.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      removeEmptyTextStyle:
        () =>
        ({ tr }) => {
          const { from, to } = tr.selection;

          tr.doc.nodesBetween(from, to, (node, pos) => {
            if (!node.isInline) return;

            const textStyleMarks = node.marks.filter(
              (mark) => mark.type === this.type,
            );

            const hasAnyNonEmptyAttr = textStyleMarks.some((mark) =>
              Object.values(mark.attrs).some((value) => !!value),
            );

            if (!hasAnyNonEmptyAttr) {
              const start = Math.max(pos, from);
              const end = Math.min(pos + node.nodeSize, to);

              if (start < end) {
                tr.removeMark(start, end, this.type);
              }
            }
          });

          return true;
        },
    };
  },
});
