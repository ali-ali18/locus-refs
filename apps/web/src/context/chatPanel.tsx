"use client";

import { createContext, useCallback, useContext, useState } from "react";

export interface AttachedSelection {
  noteId: string;
  from: number;
  to: number;
  text: string;
}

interface ChatPanelContextValue {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  attachedSelection: AttachedSelection | null;
  attachSelection: (selection: AttachedSelection) => void;
  clearAttachedSelection: () => void;
}

const ChatPanelContext = createContext<ChatPanelContextValue | null>(null);

export function ChatPanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [attachedSelection, setAttachedSelection] =
    useState<AttachedSelection | null>(null);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const attachSelection = useCallback((selection: AttachedSelection) => {
    setAttachedSelection(selection);
    setOpen(true);
  }, []);

  const clearAttachedSelection = useCallback(
    () => setAttachedSelection(null),
    [],
  );

  return (
    <ChatPanelContext.Provider
      value={{
        open,
        toggle,
        setOpen,
        attachedSelection,
        attachSelection,
        clearAttachedSelection,
      }}
    >
      {children}
    </ChatPanelContext.Provider>
  );
}

export function useChatPanel() {
  const ctx = useContext(ChatPanelContext);
  if (!ctx)
    throw new Error("useChatPanel must be used within ChatPanelProvider");
  return ctx;
}
