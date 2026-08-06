"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCalendarEventMutations } from "@/hook/calendar/useCalendarEvents";
import { useIsMobile } from "@/hook/use-mobile";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { api } from "@/lib/api";
import type { CalendarEvent } from "@/types/calendar-event.type";
import {
  type CalendarEventDialogSchema,
  calendarEventDialogSchema,
} from "@/types/schema/calendar-event.schema";
import {
  addOneHour,
  DEFAULT_EVENT_COLOR,
  mergeDateAndTime,
  normalizeTime,
  resolveEventHex,
  timeToMinutes,
  toTimeValue,
} from "../calendar-utils";

type FormValues = CalendarEventDialogSchema;

interface Args {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  defaultStartAt?: Date;
  defaultEndAt?: Date;
  defaultAllDay?: boolean;
}

export function useCalendarEventDialog({
  open,
  onOpenChange,
  event,
  defaultStartAt,
  defaultEndAt,
  defaultAllDay = false,
}: Args) {
  const isMobile = useIsMobile();
  const {
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCalendarEventMutations();
  const { allMembers } = useWorkspaceMembers();
  const isEdit = !!event;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const startTimeInputRef = useRef<HTMLInputElement | null>(null);
  const endTimeInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
    null,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(calendarEventDialogSchema),
    defaultValues: {
      title: "",
      description: "",
      startAt: new Date().toISOString(),
      endAt: null,
      allDay: false,
      remindAt: null,
      visibility: "personal",
      color: DEFAULT_EVENT_COLOR,
      imageUrl: null,
      assigneeIds: [],
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  useEffect(() => {
    if (!open) return;
    setPendingImageFile(null);
    setPendingPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (event) {
      form.reset({
        title: event.title,
        description: event.description ?? "",
        startAt: event.startAt,
        endAt: event.endAt,
        allDay: event.allDay,
        remindAt: event.remindAt,
        visibility: event.visibility,
        color: resolveEventHex(event.color),
        imageUrl: event.imageUrl,
        assigneeIds: (event.assignees ?? []).map((a) => a.userId),
        startTime: toTimeValue(event.startAt),
        endTime: event.endAt ? toTimeValue(event.endAt) : "",
      });
      return;
    }
    const start = defaultStartAt ?? new Date();
    const end = defaultEndAt ?? new Date(start.getTime() + 60 * 60 * 1000);
    form.reset({
      title: "",
      description: "",
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      allDay: defaultAllDay,
      remindAt: null,
      visibility: "personal",
      color: DEFAULT_EVENT_COLOR,
      imageUrl: null,
      assigneeIds: [],
      startTime: toTimeValue(start),
      endTime: toTimeValue(end),
    });
  }, [open, event, defaultStartAt, defaultEndAt, defaultAllDay, form]);

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    };
  }, [pendingPreviewUrl]);

  const startTimeField = form.register("startTime");
  const endTimeField = form.register("endTime");

  const allDay = form.watch("allDay");
  const visibility = form.watch("visibility");
  const startAt = form.watch("startAt");
  const imageUrl = form.watch("imageUrl");
  const assigneeIds = form.watch("assigneeIds") ?? [];
  const previewSrc = pendingPreviewUrl ?? imageUrl;
  const busy = isCreating || isUpdating || isDeleting || isUploading;

  const dayLabel = format(new Date(startAt), "EEEE, d 'de' MMMM", {
    locale: ptBR,
  });

  const setDay = (dateStr: string) => {
    const day = new Date(`${dateStr}T12:00:00`);
    const start = normalizeTime(form.getValues("startTime") || "");
    const end = normalizeTime(form.getValues("endTime") || "");
    const nextStart = allDay || !start ? day : mergeDateAndTime(day, start);
    const nextEnd = allDay ? day : end ? mergeDateAndTime(day, end) : null;
    form.setValue("startAt", nextStart.toISOString(), { shouldDirty: true });
    form.setValue("endAt", nextEnd ? nextEnd.toISOString() : null, {
      shouldDirty: true,
    });
  };

  const toggleAssignee = (userId: string) => {
    const next = assigneeIds.includes(userId)
      ? assigneeIds.filter((id) => id !== userId)
      : [...assigneeIds, userId];
    form.setValue("assigneeIds", next, { shouldDirty: true });
  };

  const clearPendingPreview = () => {
    setPendingPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPendingImageFile(null);
  };

  const pickImageFile = (file: File) => {
    clearPendingPreview();
    setPendingImageFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    clearPendingPreview();
    form.setValue("imageUrl", null, { shouldDirty: true });
  };

  const uploadPendingImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ data: { publicUrl: string } }>(
        "/api/upload/calendar",
        formData,
      );
      return data.data.publicUrl;
    } catch {
      toast.error("Não foi possível enviar a imagem.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = form.handleSubmit(
    async (values) => {
      const day = new Date(values.startAt);
      const startValue = normalizeTime(values.startTime);
      const endTimeValue = normalizeTime(values.endTime || "");
      const startAtIso = mergeDateAndTime(day, startValue).toISOString();

      let endAtIso: string | null = null;
      if (values.allDay) {
        endAtIso = startAtIso;
      } else if (endTimeValue) {
        const endValue =
          timeToMinutes(endTimeValue) <= timeToMinutes(startValue)
            ? addOneHour(startValue)
            : endTimeValue;
        endAtIso = mergeDateAndTime(day, endValue).toISOString();
      }

      let nextImageUrl = values.imageUrl || null;
      if (pendingImageFile) {
        const uploaded = await uploadPendingImage(pendingImageFile);
        if (!uploaded) return;
        nextImageUrl = uploaded;
      }

      const { startTime: _s, endTime: _e, ...rest } = values;
      const payload = {
        ...rest,
        startAt: startAtIso,
        endAt: endAtIso,
        description: values.description || null,
        remindAt: values.remindAt || null,
        color: values.color || null,
        imageUrl: nextImageUrl,
        assigneeIds:
          values.visibility === "workspace" ? (values.assigneeIds ?? []) : [],
      };

      if (isEdit && event) {
        await updateEvent({ id: event.id, ...payload });
      } else {
        await createEvent(payload);
      }
      clearPendingPreview();
      onOpenChange(false);
    },
    (errors) => {
      const message =
        errors.endTime?.message ||
        errors.startTime?.message ||
        errors.title?.message ||
        errors.root?.message ||
        "Revise os horários do evento.";
      toast.error(String(message));
    },
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    (document.activeElement as HTMLElement | null)?.blur();
    const start = startTimeInputRef.current?.value;
    const end = endTimeInputRef.current?.value;
    if (start) form.setValue("startTime", normalizeTime(start));
    if (end !== undefined) {
      form.setValue("endTime", end ? normalizeTime(end) : "");
    }
    void onSubmit(e);
  };

  const onDelete = async () => {
    if (!event) return;
    await deleteEvent(event.id);
    clearPendingPreview();
    onOpenChange(false);
  };

  return {
    isMobile,
    isEdit,
    form,
    allMembers,
    fileInputRef,
    startTimeInputRef,
    endTimeInputRef,
    startTimeField,
    endTimeField,
    allDay,
    visibility,
    startAt,
    assigneeIds,
    previewSrc,
    busy,
    dayLabel,
    setDay,
    toggleAssignee,
    pickImageFile,
    removeImage,
    handleFormSubmit,
    onDelete,
  };
}
