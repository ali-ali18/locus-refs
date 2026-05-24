"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface ChatPanelContextValue {
  open: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

const ChatPanelContext = createContext<ChatPanelContextValue | null>(null);

export function ChatPanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <ChatPanelContext.Provider value={{ open, toggle, setOpen }}>
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
