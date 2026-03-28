import { ContentNotes } from "@/components/notes/ContentNotes";
import { Container } from "@/components/shared/Container";

export default function NotesPage() {
  return (
    <Container as="section" itemSpacing="xl">
      <ContentNotes />
    </Container>
  );
}
