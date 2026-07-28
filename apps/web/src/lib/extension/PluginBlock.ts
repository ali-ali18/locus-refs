import { Node } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { PluginBlockView } from "@/components/ui/baseNote/pluginBlock/PluginBlockView";
import { resolveProvider } from "@/lib/embed/resolveProvider";

export const PluginBlock = Node.create({
  name: "pluginBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-url") ?? "",
        renderHTML: (attrs) => ({ "data-url": attrs.url as string }),
      },
      provider: {
        default: "youtube",
        parseHTML: (el) => el.getAttribute("data-provider") ?? "youtube",
        renderHTML: (attrs) => ({
          "data-provider": attrs.provider as string,
        }),
      },
      providerId: {
        default: "",
        parseHTML: (el) => el.getAttribute("data-provider-id") ?? "",
        renderHTML: (attrs) => ({
          "data-provider-id": attrs.providerId as string,
        }),
      },
      width: {
        default: 60,
        parseHTML: (el) => Number(el.getAttribute("data-width") ?? 60),
        renderHTML: (attrs) => ({ "data-width": attrs.width }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="pluginBlock"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "pluginBlock", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PluginBlockView, {
      stopEvent: () => true,
    });
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("pluginBlockPaste"),
        props: {
          handlePaste(view, event) {
            const text = event.clipboardData?.getData("text/plain")?.trim();
            if (!text || text.includes("\n")) return false;

            const resolved = resolveProvider(text);
            if (!resolved) return false;

            const node = view.state.schema.nodes.pluginBlock?.create({
              url: resolved.url,
              provider: resolved.provider,
              providerId: resolved.providerId,
            });
            if (!node) return false;

            event.preventDefault();
            view.dispatch(view.state.tr.replaceSelectionWith(node));
            return true;
          },
        },
      }),
    ];
  },
});
