export type BuiltInAgentSkillId =
  | "summarize-note"
  | "continue-writing"
  | "extract-actions"
  | "plan-from-note"
  | "rewrite-tone"
  | "find-related";

/** Built-in slug ou id de skill do usuário (cuid/uuid). */
export type AgentSkillId = BuiltInAgentSkillId | (string & {});

export interface AgentSkill {
  id: BuiltInAgentSkillId;
  label: string;
  description: string;
  /** Prompt canônico enviado como mensagem do usuário. */
  prompt: string;
  /** Se true, a skill só faz sentido com uma nota aberta. */
  requiresNote: boolean;
}

export const AGENT_SKILLS: AgentSkill[] = [
  {
    id: "summarize-note",
    label: "Resumir nota",
    description: "Gera um resumo claro da nota atual",
    prompt:
      "Resuma a nota atual em português: pontos principais, decisões e próximos passos (se houver). Seja conciso.",
    requiresNote: true,
  },
  {
    id: "continue-writing",
    label: "Continuar escrevendo",
    description: "Continua o texto a partir do fim ou da seleção",
    prompt:
      "Continue escrevendo a nota atual no mesmo tom e estilo. Se houver trecho selecionado, continue a partir dele; caso contrário, continue do fim. Proponha a edição com as ferramentas disponíveis.",
    requiresNote: true,
  },
  {
    id: "extract-actions",
    label: "Extrair ações",
    description: "Lista de tarefas a partir da nota",
    prompt:
      "Extraia action items da nota atual como uma lista de tarefas clara e acionável. Proponha inserir/atualizar na nota com as ferramentas de edição.",
    requiresNote: true,
  },
  {
    id: "plan-from-note",
    label: "Plano da nota",
    description: "Plano estruturado com base no conteúdo",
    prompt:
      "Com base na nota atual, monte um plano estruturado em passos numerados e acionáveis. Se fizer sentido, proponha aplicar o plano na nota.",
    requiresNote: true,
  },
  {
    id: "rewrite-tone",
    label: "Reescrever tom",
    description: "Tom mais direto e profissional",
    prompt:
      "Reescreva o trecho selecionado (ou a seção mais relevante da nota) em tom claro, direto e profissional, sem perder o sentido. Use replaceSelection se houver seleção.",
    requiresNote: true,
  },
  {
    id: "find-related",
    label: "Notas relacionadas",
    description: "Busca no workspace e backlinks",
    prompt:
      "Encontre notas relacionadas no workspace atual (busca + backlinks da nota aberta, se houver). Liste o que encontrou com títulos e por que são relevantes. Não invente notas.",
    requiresNote: false,
  },
];

export function getAgentSkill(id: string | undefined): AgentSkill | null {
  if (!id) return null;
  return AGENT_SKILLS.find((skill) => skill.id === id) ?? null;
}

export function listAgentSkills(options?: {
  hasNote?: boolean;
}): AgentSkill[] {
  const hasNote = options?.hasNote ?? true;
  return AGENT_SKILLS.filter((skill) => (skill.requiresNote ? hasNote : true));
}
