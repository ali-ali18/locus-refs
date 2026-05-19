import { DocFreeIcons, Github } from "@hugeicons/core-free-icons";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { Safari } from "../ui/safari";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

export function CtaContainer() {
  return (
    <LandingWrapper containerClassName="border-b">
      <CtaContent />
    </LandingWrapper>
  );
}

export function CtaContent() {
  return (
    <LandingContent >
      <div className="-mr-3 -ml-3 min-h-[calc(40vh)] relative flex flex-col items-center justify-center py-6">
        <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto px-4 mt-8 mb-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Centralize o conhecimento do time
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pare de perder referências em chats. Crie seu workspace e tenha
              todo o conhecimento estruturado a um clique de distância.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size={"lg"} className="w-full sm:w-auto">
              <Icon icon={Github} /> Ver no GitHub
            </Button>
            <Button
              size={"lg"}
              variant={"secondary"}
              className="w-full sm:w-auto"
            >
              <Icon icon={DocFreeIcons} /> Ler Documentação
            </Button>
          </div>
        </div>
        <div className="w-[95%] mx-3 mt-4 relative mask-[linear-gradient(to_bottom,black_20%,transparent_100%)]">
          <Safari url="kodea.com.br" imageSrc="/banner-cta.png" />
        </div>
      </div>
    </LandingContent>
  );
}
