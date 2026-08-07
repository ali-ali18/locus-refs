"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/workspace";
import { api } from "@/lib/api";
import type { CalendarEvent } from "@/types/calendar-event.type";
import type {
  CreateCalendarEventSchema,
  UpdateCalendarEventSchema,
} from "@/types/schema/calendar-event.schema";
import { calendarEventKeys } from "./calendarEventKeys";

export function useCalendarEvents(params: {
  from: string;
  to: string;
  visibility?: "personal" | "workspace" | "all";
}) {
  const { workspaceId } = useWorkspace();
  const visibility = params.visibility ?? "all";

  return useQuery({
    queryKey: calendarEventKeys.range(
      workspaceId,
      params.from,
      params.to,
      visibility,
    ),
    queryFn: async () => {
      const { data } = await api.get<{ data: CalendarEvent[] }>(
        "/api/calendar/events",
        {
          params: {
            from: params.from,
            to: params.to,
            visibility,
          },
        },
      );
      return data.data;
    },
    enabled: !!workspaceId && !!params.from && !!params.to,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useCalendarEventMutations() {
  const queryClient = useQueryClient();
  const { workspaceId } = useWorkspace();

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: calendarEventKeys.all(workspaceId),
    });
  };

  const createEvent = useMutation({
    mutationFn: async (input: CreateCalendarEventSchema) => {
      const { data } = await api.post<{ data: CalendarEvent }>(
        "/api/calendar/events",
        input,
      );
      return data.data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Evento criado.");
    },
    onError: () => toast.error("Não foi possível criar o evento."),
  });

  const updateEvent = useMutation({
    mutationFn: async (input: { id: string } & UpdateCalendarEventSchema) => {
      const { id, ...payload } = input;
      const { data } = await api.patch<{ data: CalendarEvent }>(
        `/api/calendar/events/${id}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Evento atualizado.");
    },
    onError: () => toast.error("Não foi possível atualizar o evento."),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/calendar/events/${id}`);
      return id;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Evento excluído.");
    },
    onError: () => toast.error("Não foi possível excluir o evento."),
  });

  return {
    createEvent: createEvent.mutateAsync,
    updateEvent: updateEvent.mutateAsync,
    deleteEvent: deleteEvent.mutateAsync,
    isCreating: createEvent.isPending,
    isUpdating: updateEvent.isPending,
    isDeleting: deleteEvent.isPending,
  };
}
