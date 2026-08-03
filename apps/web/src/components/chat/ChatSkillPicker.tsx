"use client";

import { Note01Icon, Scroll01Icon } from "@hugeicons/core-free-icons";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Icon } from "@/components/shared/Icon";
import { useAgentSkills } from "@/hook/ai/useAgentSkills";
import { cn } from "@/lib/utils";
import type { AgentSkill } from "@/types/agent-skill.type";

export interface SkillQueryState {
  start: number;
  query: string;
}

export interface ChatSkillPickerHandle {
  /** Retorna true se a tecla foi consumida (setas / Enter / Escape). */
  onKeyDown: (event: ReactKeyboardEvent) => boolean;
}

/** Detecta `/query` no caret (mesmo padrão do @). */
export function detectSkillQuery(
  value: string,
  caret: number,
): SkillQueryState | null {
  const before = value.slice(0, caret);
  const match = before.match(/(^|[\s([{])\/([^\s/]*)$/);
  if (!match) return null;
  const slashIndex = before.lastIndexOf("/");
  return { start: slashIndex, query: match[2] ?? "" };
}

function matchesQuery(label: string, query: string): boolean {
  if (!query) return true;
  return label.toLowerCase().includes(query.toLowerCase());
}

const NAV_KEYS = new Set(["ArrowDown", "ArrowUp", "Enter", "Escape"]);

export const ChatSkillPicker = forwardRef<
  ChatSkillPickerHandle,
  {
    query: string;
    noteId?: string;
    onSelect: (skill: AgentSkill) => void;
    onClose?: () => void;
  }
>(function ChatSkillPicker({ query, noteId, onSelect, onClose }, ref) {
  const { data: skills = [], isLoading } = useAgentSkills();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const itemsRef = useRef<AgentSkill[]>([]);
  const onSelectRef = useRef(onSelect);
  const onCloseRef = useRef(onClose);

  const items = useMemo(
    () =>
      skills
        .filter((skill) => (skill.requiresNote ? !!noteId : true))
        .filter(
          (skill) =>
            matchesQuery(skill.title, query) ||
            matchesQuery(skill.description ?? "", query),
        )
        .slice(0, 10),
    [skills, query, noteId],
  );

  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
  }, [query, items.length]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useImperativeHandle(ref, () => ({
    onKeyDown(event) {
      if (!NAV_KEYS.has(event.key)) return false;

      const list = itemsRef.current;
      if (list.length === 0) {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onCloseRef.current?.();
          return true;
        }
        // Enter com lista vazia: ainda bloqueia submit do chat
        if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
        return false;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        const next = (activeIndexRef.current + 1) % list.length;
        activeIndexRef.current = next;
        setActiveIndex(next);
        return true;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        const next =
          (activeIndexRef.current - 1 + list.length) % list.length;
        activeIndexRef.current = next;
        setActiveIndex(next);
        return true;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        const skill = list[activeIndexRef.current];
        if (skill) onSelectRef.current(skill);
        return true;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current?.();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="absolute bottom-full left-0 z-50 mb-2 w-full max-w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
      <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground">
        Skills
      </p>
      <div className="max-h-64 overflow-y-auto scrollbar-none">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Carregando skills…
          </p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma skill encontrada.
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5 p-0" role="listbox">
            {items.map((skill, index) => {
              const selected = index === activeIndex;
              return (
                <li key={skill.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      selected
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50",
                    )}
                    onClick={() => onSelect(skill)}
                    onMouseEnter={() => {
                      activeIndexRef.current = index;
                      setActiveIndex(index);
                    }}
                  >
                    <Icon
                      icon={Scroll01Icon}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {skill.title}
                    </span>
                    {skill.requiresNote ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        <Icon icon={Note01Icon} className="size-3" />
                        Nota
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {skill.visibility === "personal"
                          ? "Pessoal"
                          : "Workspace"}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
});
