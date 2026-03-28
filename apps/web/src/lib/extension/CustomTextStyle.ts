import { TextStyle } from "@tiptap/extension-text-style";

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
