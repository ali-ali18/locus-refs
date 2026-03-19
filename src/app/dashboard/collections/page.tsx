import { Folder01FreeIcons } from "@hugeicons/core-free-icons";
import { Container } from "@/components/shared/Container";
import { Icon } from "@/components/shared/Icon";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function CollectionsPage() {
  return (
    <Container
      as="section"
      className="flex flex-1 min-h-[calc(100vh-6rem)] items-center justify-center"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="rounded-xl">
            <Icon icon={Folder01FreeIcons} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>Suas coleções aparecerão aqui</EmptyTitle>
          <EmptyDescription>
            No momento você ainda não selecionou nenhuma coleção.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </Container>
  );
}
