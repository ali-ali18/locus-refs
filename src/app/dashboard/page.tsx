import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Container } from "@/components/shared/Container";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function DashboardPage() {
  return (
    <Container
      as="section"
      className="flex flex-1 min-h-[calc(100vh-6rem)] items-center justify-center"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>Selecione uma coleção</EmptyTitle>
          <EmptyDescription>
            Escolha uma coleção na barra lateral ou crie uma nova clicando no{" "}
            <strong>+</strong> ao lado de "Recursos".
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </Container>
  );
}
