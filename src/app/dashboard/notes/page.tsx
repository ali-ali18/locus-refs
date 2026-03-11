import { ContentNotes } from "@/components/notes/ContentNotes";
import { PageHeaderNotes } from "@/components/notes/PageHeaderNotes";
import { Container } from "@/components/shared/Container";

export default function NotesPage() {
  return (
    <Container as="section" itemSpacing="xl">
      <PageHeaderNotes />
      <ContentNotes />
    </Container>
  );
}
