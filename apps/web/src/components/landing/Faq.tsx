"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

interface FaqItem {
  id: string;
  title: string;
  description: string;
}

const faqItems: FaqItem[] = [
  {
    id: "how-it-works",
    title: "Como funciona a captura de referências?",
    description:
      "Você pode adicionar novas referências simplesmente colando uma URL. O sistema busca automaticamente o título, descrição e imagens do site para criar um card visual.",
  },
  {
    id: "team-access",
    title: "Como o conteúdo é compartilhado com a equipe?",
    description:
      "Todo conteúdo vive dentro de um Workspace. Basta convidar os membros do seu time para o Workspace e todos terão acesso instantâneo para consultar e editar as notas e referências.",
  },
  {
    id: "open-source",
    title: "A plataforma é gratuita?",
    description:
      "Sim, o projeto é open-source e gratuito. Você pode usá-lo livremente ou até mesmo realizar o self-host da aplicação na sua própria infraestrutura caso prefira.",
  },
  {
    id: "export",
    title: "Posso exportar meus dados no futuro?",
    description:
      "Com certeza. Prezamos pela liberdade dos seus dados. Você poderá exportar suas referências e notas estruturadas a qualquer momento para não ficar preso à plataforma.",
  },
];

export function FaqContainer() {
  return (
    <LandingWrapper containerClassName="border-b" id="faq">
      <FaqContent />
    </LandingWrapper>
  );
}

export function FaqContent() {
  return (
    <LandingContent as={"section"}>
      <div className="h-12 border-b -mr-3 -ml-3 lg:-ml-3.5" />
      <div className="flex items-start flex-col lg:flex-row -ml-3 -mr-3">
        <div className="flex-1 h-full py-6 pl-4 border-b lg:border-none w-full">
          <h3 className="text-xl font-semibold tracking-tight">
            Dúvidas Frequentes
          </h3>
          <p className="text-sm leading-6 text-muted-foreground mt-2 lg:max-w-sm">
            Tudo o que você precisa saber sobre como organizar as referências e
            notas do seu time.
          </p>
        </div>
        <div className="flex-1 w-full">
          <Accordion
            className="w-full lg:border-l"
            defaultValue={["how-it-works"]}
          >
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className={"px-0"}>
                <AccordionTrigger className="items-center px-3 lg:px-6 py-6 hover:no-underline cursor-pointer">
                  <div className="space-y-1">
                    <span className="block text-base font-medium tracking-tight">
                      {item.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-3 lg:pl-6">
                  <p className="max-w-sm text-sm leading-6 text-muted-foreground pb-2">
                    {item.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <div className="h-12 border-t -mr-3 -ml-3 lg:-ml-3.5" />
    </LandingContent>
  );
}
