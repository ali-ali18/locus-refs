import { zodResolver } from "@hookform/resolvers/zod";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { useNoteMutations } from "@/hook/notes/useNote";
import { resolveIcon } from "@/lib/icons";
import {
  type UpdateHeaderNoteSchema,
  updateHeaderNoteSchema,
} from "@/types/schema/note.schema";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseNoteHeaderParams {
  id: string;
  initialTitle: string;
  initialIcon?: string | null;
}

export function useNoteHeader({
  id,
  initialTitle,
  initialIcon,
}: UseNoteHeaderParams) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { updateNote } = useNoteMutations();
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [icon, setIcon] = useState<string | null>(initialIcon ?? null);

  const form = useForm<UpdateHeaderNoteSchema>({
    defaultValues: {
      title: initialTitle,
      icon: initialIcon ?? undefined,
    },
    resolver: zodResolver(updateHeaderNoteSchema),
  });

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const saveTitle = useDebounceCallback(async (value: string) => {
    const trimmed = value.trim();

    if (trimmed === initialTitle.trim()) {
      setStatus("idle");
      return;
    }

    form.setValue("title", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const valid = await form.trigger("title");

    if (!valid) {
      setStatus("error");
      return;
    }

    try {
      setStatus("saving");
      await updateNote({ id, title: trimmed });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, 2500);

  const handleIconChange = async (next: string | null) => {
    setIcon(next);

    try {
      setStatus("saving");
      await updateNote({ id, icon: next ?? undefined });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    form.reset({
      title: initialTitle,
      icon: initialIcon ?? undefined,
    });
    autoResize();
  }, [initialTitle, initialIcon]);

  useEffect(() => {
    if (status === "saved") {
      const timeout = setTimeout(() => {
        setStatus("idle");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [status]);

  const {
    register,
    formState: { errors },
  } = form;

  const { ref, ...rest } = register("title");

  const titleField = {
    ...rest,
    ref: (el: HTMLTextAreaElement) => {
      ref(el);
      textareaRef.current = el;
    },
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
      saveTitle(event.target.value);
      autoResize();
    },
    "aria-invalid": Boolean(errors.title) || status === "error",
  };

  const showSaved = status === "saved" && !errors.title;
  const showError = Boolean(errors.title) || status === "error";

  return {
    titleField,
    icon,
    resolvedIcon: resolveIcon(icon ?? "Note02FreeIcons"),
    status,
    showSaved,
    showError,
    errorMessage: errors.title?.message,
    handleIconChange,
  };
}
