import { ContentKanban } from "@/components/kanban/ContentKanban";
import { Container } from "@/components/shared/Container";

export default function KanbanPage() {
  return (
    <Container as="section" itemSpacing="xl">
      <ContentKanban />
    </Container>
  );
}
