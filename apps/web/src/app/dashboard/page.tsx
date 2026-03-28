import { Saturn01Icon } from "@hugeicons/core-free-icons";
import { Container } from "@/components/shared/Container";
import { Icon } from "@/components/shared/Icon";
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
          <EmptyMedia variant="icon" className="rounded-xl">
            <Icon icon={Saturn01Icon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>Seja bem vindo ao seu espaço</EmptyTitle>
          <EmptyDescription>
            Sua área de trabalho está vazia, selecione algo para continuar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </Container>
  );
}
