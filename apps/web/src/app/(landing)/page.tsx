import { AdvantageContainer } from "@/components/landing/Advantage";
import { DemoContainer } from "@/components/landing/Demo";
import { FaqContainer } from "@/components/landing/Faq";
import { HeroContainer } from "@/components/landing/Hero";
import { StackContainer } from "@/components/landing/Stack";
import { SeparetorLading } from "@/components/landing/structure/Separetor";

export default function LandingPage() {
  return (
    <>
      <HeroContainer />
      <AdvantageContainer />
      <SeparetorLading isStriped />
      <DemoContainer />
      <SeparetorLading isStriped />
      <StackContainer />
      <FaqContainer />
    </>
  );
}
