import { ContentBoards } from "@/components/boards/ContentBoards";
import { Container } from "@/components/shared/Container";

export default function BoardsPage() {
  return (
    <Container as="section" itemSpacing="xl">
      <ContentBoards />
    </Container>
  );
}
