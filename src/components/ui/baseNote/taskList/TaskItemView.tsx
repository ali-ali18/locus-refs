"use client";

import {
  NodeViewContent,
  type NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react";
import { Checkbox } from "@/components/ui/checkbox";

export function TaskItemView({
  node,
  updateAttributes,
  editor,
}: NodeViewProps) {
  const checked = node.attrs.checked as boolean;

  return (
    <NodeViewWrapper as="li" className="flex items-start gap-2 my-1">
      <div contentEditable={false} className="mt-[3px] shrink-0">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => {
            if (!editor.isEditable) return;
            updateAttributes({ checked: value === true });
          }}
          disabled={!editor.isEditable}
        />
      </div>
      <NodeViewContent
        as="div"
        className={
          checked ? "line-through text-muted-foreground" : "text-foreground"
        }
      />
    </NodeViewWrapper>
  );
}
