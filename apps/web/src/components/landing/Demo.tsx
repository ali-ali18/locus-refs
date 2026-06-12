"use client";

import {
  NoteIcon,
  SearchList01Icon,
  Share07Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "../shared/Icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

interface DemoItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: IconSvgElement;
  previewLabel: string;
}

const demoItems: DemoItem[] = [
  {
    id: "capture",
    title: "Captura por link",
    description:
      "Adicione novas referências a partir de URLs e concentre o material relevante sem depender de processos manuais.",
    image: "/landing/novo-recurso-base-ui.webp",
    imageAlt: "Modal de novo recurso com link e preview automático",
    icon: Share07Icon,
    previewLabel: "Coleta automática",
  },
  {
    id: "notes",
    title: "Notas em formato de workspace",
    description:
      "Organize conhecimento em paginas editaveis, conecte contexto da equipe e mantenha tudo acessivel em um unico lugar.",
    image: "/landing/ex-notes-in-app.webp",
    imageAlt: "Workspace de notas dentro do aplicativo",
    icon: NoteIcon,
    previewLabel: "Workspace de notas",
  },
  {
    id: "search",
    title: "Mantenha fluxos visíveis",
    description:
      "Transforme referências e notas em uma base pronta para consulta, documentação interna e evolução contínua do time.",
    image: "/landing/ex-board-fluxo-opt.webp",
    imageAlt: "Board de fluxo OPT com etapas do Looker até o Teams",
    icon: SearchList01Icon,
    previewLabel: "Fluxo visível",
  },
];

export function DemoContainer() {
  return (
    <LandingWrapper containerClassName="border-b">
      <DemoContent />
    </LandingWrapper>
  );
}

export function DemoContent() {
  const [activeItemId, setActiveItemId] = useState<DemoItem["id"]>(
    demoItems[0]?.id ?? "capture",
  );
  const [displayedItem, setDisplayedItem] = useState<DemoItem>(demoItems[0]);
  const [isImageVisible, setIsImageVisible] = useState(true);

  const activeItem =
    demoItems.find((item) => item.id === activeItemId) ?? demoItems[0];

  useEffect(() => {
    if (activeItem.id === displayedItem.id) {
      return;
    }

    setIsImageVisible(false);

    const timeoutId = window.setTimeout(() => {
      setDisplayedItem(activeItem);
      setIsImageVisible(true);
    }, 140);

    return () => window.clearTimeout(timeoutId);
  }, [activeItem, displayedItem.id]);

  return (
    <LandingContent as="section">
      <div className="-ml-3 -mr-3 lg:-ml-3.5 border-b py-8">
        <div className="grid grid-cols-1 items-center gap-4 px-5 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-xl space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight">
              Capture referências, organize notas e mantenha o contexto vivo
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Combine o scraping automático, notas em formato de workspace e
              uma base pronta para o time registrar, consultar e evoluir
              conhecimento.
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full lg:w-fit lg:justify-self-end"
            size="lg"
            nativeButton={false}
            render={<Link href="/docs" />}
          >
            Documentação
          </Button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="-mr-3 -ml-3 border-b lg:border-r lg:border-b-0 lg:px-5">
          <Accordion
            value={[activeItemId]}
            onValueChange={(value) => {
              const nextItemId = value[0];

              if (nextItemId) {
                setActiveItemId(nextItemId);
              }
            }}
            className="w-full"
          >
            {demoItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className={"px-0 lg:-ml-5.5 lg:-mr-5"}
              >
                <AccordionTrigger className="items-center gap-4 px-3 py-6 hover:no-underline">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border bg-muted/30 text-primary">
                    <Icon icon={item.icon} className="size-4.5" />
                  </span>
                  <div className="space-y-1">
                    <span className="block text-base font-medium tracking-tight">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-10">
                  <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="-mr-3 -ml-3 p-4 lg:ml-3 lg:p-3.5">
          <Image
            src={displayedItem.image}
            width={1200}
            height={800}
            alt={displayedItem.imageAlt}
            className={`aspect-video h-full w-full rounded object-cover transition-opacity duration-300 ${
              isImageVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </LandingContent>
  );
}
