import { ContentCalendar } from "@/components/calendar/ContentCalendar";

export default function CalendarPage() {
  return (
    <section className="flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden">
      <ContentCalendar />
    </section>
  );
}
