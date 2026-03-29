import { Container } from "@/components/shared/Container";

export default function SettingsPage() {
  return (
    <Container as="section">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="text-muted-foreground">Configurações gerais do workspace.</p>
    </Container>
  );
}
