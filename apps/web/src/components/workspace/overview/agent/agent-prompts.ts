import {
  BubbleChatIcon,
  Calendar03Icon,
  Folder01Icon,
  KanbanIcon,
  Note01FreeIcons,
  Task01FreeIcons,
} from "@hugeicons/core-free-icons";
import type { AgentSkillId } from "@/lib/ai/skills";

export type AgentPrompt = {
  id: string;
  label: string;
  hint: string;
  prompt: string;
  icon: typeof BubbleChatIcon;
  skillId?: AgentSkillId;
};

export const AGENT_PROMPTS: AgentPrompt[] = [
  {
    id: "day",
    label: "Priorizar o dia",
    hint: "O que fazer primeiro hoje",
    prompt:
      "Com base na agenda e no workspace, me ajuda a priorizar o que fazer hoje.",
    icon: Task01FreeIcons,
  },
  {
    id: "agenda",
    label: "Resumo da agenda",
    hint: "Eventos de hoje em foco",
    prompt: "Resuma meus eventos de hoje e diga o que precisa de atenção.",
    icon: Calendar03Icon,
  },
  {
    id: "week",
    label: "Resumo da semana",
    hint: "Avanços e pendências do time",
    prompt:
      "Faça um resumo do que a equipe avançou recentemente no workspace e o que ficou pendente.",
    icon: BubbleChatIcon,
  },
  {
    id: "notes",
    label: "O que revisar",
    hint: "Notas que merecem atenção",
    prompt:
      "Olhe as notas do workspace e diga quais valem revisar agora, com um motivo curto para cada uma.",
    icon: Note01FreeIcons,
  },
  {
    id: "collections",
    label: "Organizar coleções",
    hint: "Sugestões de organização",
    prompt:
      "Analise as coleções do workspace e sugira como organizar melhor o conteúdo (agrupar, renomear ou criar coleções).",
    icon: Folder01Icon,
  },
  {
    id: "kanban",
    label: "Status do kanban",
    hint: "Cards e gargalos",
    prompt:
      "Resuma o estado dos kanbans do workspace: o que está em progresso, o que está parado e o que precisa de ação.",
    icon: KanbanIcon,
  },
];
