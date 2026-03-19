import { TaskItem } from "@tiptap/extension-list/task-item";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { TaskItemView } from "@/components/ui/baseNote/taskList/TaskItemView";

export const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TaskItemView);
  },
});
