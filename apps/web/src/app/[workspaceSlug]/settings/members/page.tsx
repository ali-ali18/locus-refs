import { Container } from "@/components/shared/Container";

export default function MembersPage() {
  return (
    <Container as="section">
      <h1 className="text-2xl font-bold">Membros</h1>
      <p className="text-muted-foreground">
        Gerencie membros e convites do workspace.
      </p>
    </Container>
  );
}
