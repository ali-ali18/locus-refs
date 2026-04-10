import { Container } from "@/components/shared/Container";
import { WrapperOverview } from "@/components/workspace/overview/WrapperOverview";

export default function WorkspacePage() {
  return (
    <Container as="section" className="my-6">
      <WrapperOverview />
    </Container>
  );
}
