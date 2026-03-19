import { TaskList } from "@tiptap/extension-list/task-list";

export const CustomTaskList = TaskList.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: "my-4 ml-0 space-y-1 list-none",
      },
    };
  },
});
