"use client";

import { Doc01FreeIcons, GithubIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { DotPattern } from "../ui/dot-pattern";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

export function HeroContainer() {
  return (
    <LandingWrapper containerClassName="border-b" isStriped>
      <HeroContent />
    </LandingWrapper>
  );
}

export function HeroContent() {
  return (
    <LandingContent contentClassName="min-h-[calc(45vh)] flex flex-col items-center justify-center gap-4">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "mask-[linear-gradient(to_right,white,transparent,transparent)]",
        )}
      />

      <div className="w-full flex flex-col h-full items-center justify-center gap-4 relative z-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold">
            Compartilhe o que sua equipe constrói.
          </h1>
          <p className="text-muted-foreground text-lg">
            Colete, organize e disponibilize conhecimento para todo o time.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">
          <Button
            size="lg"
            className="h-11 px-5 gap-2 text-sm font-medium w-full sm:w-auto"
          >
            <Icon icon={GithubIcon} className="size-4" /> Repositório
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="h-11 px-5 gap-2 text-sm font-medium w-full sm:w-auto"
          >
            <Icon icon={Doc01FreeIcons} className="size-4" /> Documentação
          </Button>
        </div>

        <span className="text-sm text-muted-foreground font-medium">
          Rode localmente ou na sua própria infraestrutura.
        </span>
      </div>
    </LandingContent>
  );
}
