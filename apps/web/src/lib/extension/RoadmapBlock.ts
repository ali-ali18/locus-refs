import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { RoadmapBlockView } from "@/components/ui/baseNote/roadmapBlock/RoadmapBlockView";

export type RoadmapItem = {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  statusId: string;
  column: string;
  createdBy: {
    name: string;
    image?: string;
  };
};

export type RoadmapStatus = {
  id: string;
  name: string;
  color: string;
};

export const DEFAULT_ROADMAP_STATUSES: RoadmapStatus[] = [
  { id: "todo", name: "A fazer", color: "#94a3b8" },
  { id: "in-progress", name: "Em andamento", color: "#3b82f6" },
  { id: "done", name: "Concluído", color: "#22c55e" },
];

export const RoadmapBlock = Node.create({
  name: "roadmapBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      items: {
        default: JSON.stringify([]),
        parseHTML: (el) => el.getAttribute("data-items") ?? JSON.stringify([]),
        renderHTML: (attrs) => ({ "data-items": attrs.items as string }),
      },
      statuses: {
        default: JSON.stringify(DEFAULT_ROADMAP_STATUSES),
        parseHTML: (el) =>
          el.getAttribute("data-statuses") ??
          JSON.stringify(DEFAULT_ROADMAP_STATUSES),
        renderHTML: (attrs) => ({ "data-statuses": attrs.statuses as string }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="roadmapBlock"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "roadmapBlock", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RoadmapBlockView, {
      stopEvent: () => true,
    });
  },
});
