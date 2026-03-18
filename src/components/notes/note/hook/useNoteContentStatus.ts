import { useCallback, useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useNoteMutations } from "@/hook/notes/useNote";
import type { SaveStatus } from "@/types/saveStatus.type";

interface UseNoteContentStatusParams {
  id: string;
}

export function useNoteContentStatus({ id }: UseNoteContentStatusParams) {
  const { updateNote } = useNoteMutations();
  const [status, setStatus] = useState<SaveStatus>("idle");

  const saveContent = useDebounceCallback(async (content: string) => {
    try {
      setStatus("saving");
      await updateNote({ id, content });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, 500);

  const handleContentChange = useCallback(
    (content: string) => {
      saveContent(content);
    },
    [saveContent],
  );

  useEffect(() => {
    if (status === "saved") {
      const timeout = setTimeout(() => {
        setStatus("idle");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [status]);

  return {
    status,
    handleContentChange,
  };
}
