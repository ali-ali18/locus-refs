export type CalendarEventVisibility = "personal" | "workspace";

export interface CalendarEventPerson {
  id: string;
  name: string;
  image: string | null;
}

export interface CalendarEventAssignee {
  id: string;
  eventId: string;
  userId: string;
  user: CalendarEventPerson;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  remindAt: string | null;
  visibility: CalendarEventVisibility;
  color: string | null;
  imageUrl: string | null;
  userId: string;
  workspaceId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: CalendarEventPerson;
  assignees?: CalendarEventAssignee[];
}
