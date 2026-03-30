"use client";

import type { HocuspocusProvider } from "@hocuspocus/provider";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import statusConfig from "@/lib/data/statusConfig";
import type { SaveStatus } from "@/types/saveStatus.type";
import { Editor } from "../../ui/baseNote/Editor";

interface Props {
  content?: string | null;
  onChange?: (content: string) => void;
  status?: SaveStatus;
  provider?: HocuspocusProvider;
}

export function ContentNote({ content, onChange, status = "idle", provider }: Props) {
  const current = statusConfig[status];

  return (
    <div className="flex flex-col relative">
      <div className="sticky min-h-6 top-0 z-10 flex justify-end p-2 pointer-events-none">
        <Badge variant="secondary">
          <AnimatePresence mode="wait">
            <m.span
              key={status}
              className="flex items-center gap-1"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Icon icon={current.icon} />
              <span>{current.label}</span>
            </m.span>
          </AnimatePresence>
        </Badge>
      </div>

      <Editor content={content} onChange={onChange} provider={provider} />
    </div>
  );
}
