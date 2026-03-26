import Image from "@tiptap/extension-image";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageBlockView } from "@/components/ui/baseNote/imageBlock/ImageBlockView";

export interface ImageUploadOptions {
  uploadImage: (file: File) => Promise<string>;
}

export const ImageUpload = Image.extend<ImageUploadOptions>({
  name: "image",

  addOptions() {
    return {
      ...this.parent?.(),
      uploadImage: () => Promise.resolve(""),
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 60,
        parseHTML: (el) => Number(el.getAttribute("data-width") ?? 60),
        renderHTML: (attrs) => ({ "data-width": attrs.width }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView);
  },

  addProseMirrorPlugins() {
    const uploadImage = this.options.uploadImage;

    return [
      new Plugin({
        key: new PluginKey("imageUploadPaste"),
        props: {
          handleDOMEvents: {
            paste: (view, event) => {
              const items = Array.from(
                (event as ClipboardEvent).clipboardData?.items ?? [],
              );
              const imageItem = items.find((item) =>
                item.type.startsWith("image/"),
              );

              if (!imageItem) return false;

              event.preventDefault();
              const file = imageItem.getAsFile();
              if (!file) return false;

              uploadImage(file).then((url) => {
                if (!url) return;
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url });
                const tr = view.state.tr.replaceSelectionWith(node);
                view.dispatch(tr);
              });

              return true;
            },
          },
        },
      }),
    ];
  },
});
