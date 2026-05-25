"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { NoteEditToolInput, NoteEditToolResult } from "@/lib/ai/tools";

export interface EnumeratedBlock {
  index: number;
  type: string;
  preview: string;
}

interface NoteEditorActions {
  getSelectionContext: () => SelectionContext;
  applyGeneratedText: (text: string, target: PendingProposalTarget) => boolean;
  getEnumeratedBlocks: () => EnumeratedBlock[];
  applyToolOperation: (op: NoteEditToolInput) => NoteEditToolResult;
}

export interface SelectionContext {
  hasSelection: boolean;
  from: number | null;
  to: number | null;
  text: string;
}

export interface PendingProposalTarget {
  type: "selection" | "note";
  selectionText?: string;
  from?: number;
  to?: number;
}

interface PendingProposal {
  noteId: string;
  text: string;
  target: PendingProposalTarget;
}

interface NoteEditorContextValue {
  registerNoteEditor: (
    noteId: string,
    actions: NoteEditorActions,
  ) => () => void;
  canInsertIntoNote: (noteId?: string) => boolean;
  pendingProposal: PendingProposal | null;
  getSelectionContext: (noteId?: string) => SelectionContext | null;
  queueProposalReview: (noteId: string, text: string) => boolean;
  clearPendingProposal: (noteId?: string) => void;
  applyPendingProposal: (noteId: string) => boolean;
  getEnumeratedBlocks: (noteId?: string) => EnumeratedBlock[];
  applyToolOperation: (
    noteId: string,
    op: NoteEditToolInput,
  ) => NoteEditToolResult;
}

const NoteEditorContext = createContext<NoteEditorContextValue | null>(null);

export function NoteEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeEditor, setActiveEditor] = useState<{
    noteId: string;
    actions: NoteEditorActions;
  } | null>(null);
  const [pendingProposal, setPendingProposal] =
    useState<PendingProposal | null>(null);

  const registerNoteEditor = useCallback(
    (noteId: string, actions: NoteEditorActions) => {
      setActiveEditor({ noteId, actions });

      return () => {
        setActiveEditor((current) =>
          current?.noteId === noteId ? null : current,
        );
      };
    },
    [],
  );

  const canInsertIntoNote = useCallback(
    (noteId?: string) => !!noteId && activeEditor?.noteId === noteId,
    [activeEditor],
  );

  const getSelectionContext = useCallback(
    (noteId?: string) => {
      if (!noteId || activeEditor?.noteId !== noteId) return null;
      return activeEditor.actions.getSelectionContext();
    },
    [activeEditor],
  );

  const queueProposalReview = useCallback(
    (noteId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || activeEditor?.noteId !== noteId) return false;

      const selection = activeEditor.actions.getSelectionContext();
      const target: PendingProposalTarget = selection.hasSelection
        ? {
            type: "selection",
            selectionText: selection.text,
            from: selection.from ?? undefined,
            to: selection.to ?? undefined,
          }
        : { type: "note" };

      setPendingProposal({ noteId, text: trimmed, target });
      return true;
    },
    [activeEditor],
  );

  const clearPendingProposal = useCallback((noteId?: string) => {
    setPendingProposal((current) => {
      if (!current) return null;
      if (noteId && current.noteId !== noteId) return current;
      return null;
    });
  }, []);

  const applyPendingProposal = useCallback(
    (noteId: string) => {
      if (!pendingProposal || pendingProposal.noteId !== noteId) return false;
      if (activeEditor?.noteId !== noteId) return false;

      const applied = activeEditor.actions.applyGeneratedText(
        pendingProposal.text,
        pendingProposal.target,
      );
      if (!applied) return false;

      setPendingProposal(null);
      return true;
    },
    [activeEditor, pendingProposal],
  );

  const getEnumeratedBlocks = useCallback(
    (noteId?: string): EnumeratedBlock[] => {
      if (!noteId || activeEditor?.noteId !== noteId) return [];
      return activeEditor.actions.getEnumeratedBlocks();
    },
    [activeEditor],
  );

  const applyToolOperation = useCallback(
    (noteId: string, op: NoteEditToolInput): NoteEditToolResult => {
      if (activeEditor?.noteId !== noteId) {
        return { status: "error", reason: "Editor não está ativo nesta nota." };
      }
      return activeEditor.actions.applyToolOperation(op);
    },
    [activeEditor],
  );

  return (
    <NoteEditorContext.Provider
      value={{
        registerNoteEditor,
        canInsertIntoNote,
        pendingProposal,
        getSelectionContext,
        queueProposalReview,
        clearPendingProposal,
        applyPendingProposal,
        getEnumeratedBlocks,
        applyToolOperation,
      }}
    >
      {children}
    </NoteEditorContext.Provider>
  );
}

export function useNoteEditor() {
  const ctx = useContext(NoteEditorContext);
  if (!ctx) {
    throw new Error("useNoteEditor must be used within NoteEditorProvider");
  }

  return ctx;
}
