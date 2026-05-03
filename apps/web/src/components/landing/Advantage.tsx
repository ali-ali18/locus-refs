import {
  CloudServerIcon,
  OpenSourceIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

export function AdvantageContainer() {
  return (
    <LandingWrapper containerClassName="border-b">
      <AdvantageContent />
    </LandingWrapper>
  );
}

function AdvantageContent() {
  return (
    <LandingContent contentClassName="lg:pl-0 lg:pr-0">
      <div className="grid grid-cols-1 md:grid-cols-3 ">
        <AdvantageCard
          icon={UserGroupIcon}
          title="Colaborativo"
          description="Edite com sua equipe em tempo real, acompanhe cada mudança instantaneamente e mantenha todos na mesma sintonia."
        />
        <AdvantageCard
          className="md:border-x"
          icon={CloudServerIcon}
          title="No seu ambiente"
          description="Seus dados ficam no seu ambiente, com total controle sobre banco, infraestrutura e implantação."
        />
        <AdvantageCard
          icon={OpenSourceIcon}
          title="Open Source"
          description="Código aberto e sem amarras: use, adapte, audite e hospede como quiser, com liberdade para evoluir no seu próprio ritmo."
        />
      </div>
    </LandingContent>
  );
}

interface AdvantageCardProps {
  icon: IconSvgElement;
  title: string;
  description: string;
  className?: string;
}

export function AdvantageCard({
  icon,
  title,
  description,
  className,
}: AdvantageCardProps) {
  return (
    <div className={cn("p-3  w-full", className)}>
      <span className="inline-flex gap-2 items-center font-semibold">
        <Icon icon={icon} className="size-5 text-primary" />
        {title}
      </span>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
