import { TaskList } from "@tiptap/extension-list/task-list";

export const CustomTaskList = TaskList.extend({
  addOptions() {
    const parent = this.parent?.();
    return {
      itemTypeName: parent?.itemTypeName ?? "taskItem",
      HTMLAttributes: {
        class: "my-4 ml-0 space-y-1 list-none",
      },
    };
  },
});
