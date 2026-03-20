import {
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  MoreHorizontal,
  QuoteDownIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../button";
import {
  BUBBLE_MENU_GROUPS,
  PRIMARY_ACTIONS,
} from "../Bubble/BubbleMenuConfig";
import { LinkPopover } from "../link/LinkPopover";

interface Props {
  editor: Editor;
}

export function DropdownNote({ editor }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const activeMarks = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      link: editor.isActive("link"),
      heading1: editor.isActive("heading", { level: 1 }),
      heading2: editor.isActive("heading", { level: 2 }),
      heading3: editor.isActive("heading", { level: 3 }),
      blockquote: editor.isActive("blockquote"),
      taskList: editor.isActive("taskList"),
    }),
  });

  const isActive = (mark?: string) => {
    if (!mark) return false;
    return activeMarks[mark as keyof typeof activeMarks] ?? false;
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { from, to } = state.selection;
        return from !== to || dropdownOpen || linkPopoverOpen;
      }}
      updateDelay={100}
      appendTo={() => document.body}
      options={{
        placement: "top",
        offset: 8,
      }}
    >
      <div
        className="flex items-center gap-1 rounded-xl border bg-popover px-1 py-1 shadow-sm"
        role="toolbar"
        tabIndex={-1}
        aria-label="Ações do editor"
        onMouseDown={(e) => e.preventDefault()}
      >
        {PRIMARY_ACTIONS.filter((action) => action.label !== "Link").map(
          (action) => (
            <Button
              key={action.label}
              variant="ghost"
              size="icon"
              rounded="xl"
              className={
                isActive(action.mark) ? "bg-muted dark:bg-muted/50" : undefined
              }
              nativeButton={false}
              onClick={() => action.onSelect(editor)}
              render={<span>{action.icon && <Icon icon={action.icon} />}</span>}
            />
          ),
        )}
        <LinkPopover
          editor={editor}
          onOpenChange={setLinkPopoverOpen}
          isActive={activeMarks.link}
        />

        <DropdownMenu
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
        >
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              rounded="xl"
              type="button"
              nativeButton={false}
              render={
                <span>
                  <Icon icon={MoreHorizontal} />
                </span>
              }
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="rounded-xl my-1 min-w-64">
            {BUBBLE_MENU_GROUPS.map((group, index) => (
              <DropdownMenuGroup
                key={group.label ? `group-${group.label}` : `group-${index}`}
              >
                {group.label && (
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                )}

                {group.items.map((item, ii) => {
                  if (item.kind === "separator") {
                    return (
                      <DropdownMenuSeparator
                        key={`separator-${group.label ?? "group"}-${ii}`}
                      />
                    );
                  }

                  if (item.kind === "action") {
                    return (
                      <DropdownMenuItem
                        className="rounded-xl"
                        key={`action-${group.label ?? "group"}-${item.label}-${ii}`}
                        onClick={() => item.onSelect(editor)}
                      >
                        {item.icon && <Icon icon={item.icon} />}
                        {item.label}
                      </DropdownMenuItem>
                    );
                  }

                  if (item.kind === "submenu") {
                    return (
                      <DropdownMenuSub
                        key={`submenu-${group.label ?? "group"}-${item.label}-${ii}`}
                      >
                        <DropdownMenuSubTrigger className="rounded-xl">
                          {item.icon && <Icon icon={item.icon} />}
                          {item.label}
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent className="rounded-xl mx-2 w-42">
                          {item.children.map((child, ci) => {
                            const isColor =
                              "value" in child && child.kind === "color";
                            if (isColor) {
                              return (
                                <DropdownMenuItem
                                  key={`submenu-child-${group.label ?? "group"}-${item.label}-${(child as { label: string }).label}-${ci}`}
                                  onClick={() =>
                                    (
                                      child as {
                                        onSelect: (editor: Editor) => void;
                                      }
                                    ).onSelect(editor)
                                  }
                                  className="rounded-xl gap-2"
                                >
                                  <div
                                    className={`size-4 rounded-xl border bg-accent-foreground`}
                                    style={{
                                      backgroundColor: (
                                        child as { value: string }
                                      ).value,
                                    }}
                                  />
                                  {(child as { label: string }).label}
                                </DropdownMenuItem>
                              );
                            }
                            const actionChild = child as {
                              icon?: IconSvgElement;
                              label: string;
                              onSelect: (editor: Editor) => void;
                            };
                            return (
                              <DropdownMenuItem
                                key={`submenu-child-${group.label ?? "group"}-${item.label}-${actionChild.label}-${ci}`}
                                onClick={() => actionChild.onSelect(editor)}
                                className="rounded-xl"
                              >
                                {actionChild.icon && (
                                  <Icon icon={actionChild.icon} />
                                )}
                                {actionChild.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    );
                  }

                  return null;
                })}
              </DropdownMenuGroup>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Formatação</DropdownMenuLabel>
              {[
                {
                  label: "Título 1",
                  icon: Heading01Icon,
                  active: activeMarks.heading1,
                  onSelect: () =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run(),
                },
                {
                  label: "Título 2",
                  icon: Heading02Icon,
                  active: activeMarks.heading2,
                  onSelect: () =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run(),
                },
                {
                  label: "Título 3",
                  icon: Heading03Icon,
                  active: activeMarks.heading3,
                  onSelect: () =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run(),
                },
              ].map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  className={`rounded-xl${item.active ? " bg-muted" : ""}`}
                  onClick={item.onSelect}
                >
                  <Icon icon={item.icon} />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Bloco</DropdownMenuLabel>
              <DropdownMenuItem
                className={`rounded-xl${activeMarks.blockquote ? " bg-muted" : ""}`}
                onClick={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
              >
                <Icon icon={QuoteDownIcon} />
                Citação
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </BubbleMenu>
  );
}
