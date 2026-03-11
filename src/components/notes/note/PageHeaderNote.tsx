"use client";

import { CheckmarkCircle02Icon, XCircle } from "@hugeicons/core-free-icons";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import { IconPicker } from "../IconPicker";
import { useNoteHeader } from "./hook/useNoteHeader";

interface Props {
  title: string;
  icon?: string | null;
  id: string;
}

export function PageHeaderNote({ title, icon, id }: Props) {
  const {
    titleField,
    icon: currentIcon,
    resolvedIcon,
    showSaved,
    showError,
    errorMessage,
    handleIconChange,
  } = useNoteHeader({ id, initialTitle: title, initialIcon: icon });

  return (
    <div className="space-y-4">
      <div className="h-42 w-full rounded-xl bg-linear-to-br from-[#423E37] via-[#262626] to-[#171717] aspect-video" />

      <div className="flex flex-col gap-2">
        <div className="min-h-[20px] flex items-center gap-2 text-xs">
          <AnimatePresence>
            {showError && errorMessage && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Badge
                  variant="destructive"
                  className="inline-flex items-center gap-2"
                >
                  <Icon icon={XCircle} className="size-3.5" />
                  {errorMessage}
                </Badge>
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSaved && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Badge variant="secondary">
                  <Icon icon={CheckmarkCircle02Icon} className="size-3.5" />
                  <span>Atualização salva com sucesso</span>
                </Badge>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <div className="flex flex-col items-start gap-2">
            <IconPicker
              value={currentIcon}
              onChange={handleIconChange}
              trigger={
                <div className="rounded-2xl p-1.5 cursor-pointer hover:bg-muted/80 transition-colors duration-300">
                  <Icon icon={resolvedIcon} className="size-9" />
                </div>
              }
            />
          </div>

          <form
            className="flex-1 min-w-[12rem] basis-full sm:basis-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <textarea
              {...titleField}
              className="w-full outline-none text-2xl p-2 rounded-xl resize-none leading-snug overflow-hidden font-semibold"
              placeholder="Título da nota"
              rows={1}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
