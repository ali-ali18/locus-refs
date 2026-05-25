import { generateObject } from "ai";
import { type AiIntent, aiIntentSchema } from "./intent";
import { getModel } from "./models";

interface ClassifyParams {
  userMessage: string;
  hasSelection: boolean;
  hasNoteContext: boolean;
}

const CLASSIFIER_SYSTEM = `Você classifica a intenção da última mensagem do usuário em um chat assistente de notas.

Categorias:
- "chat": pergunta, conversa, dúvida, explicação. NÃO produz conteúdo para inserir na nota.
- "plan": pedido de plano, roadmap, lista de passos, organização estruturada. Pode virar uma nota.
- "suggestion": pedido EXPLÍCITO para escrever, resumir, reescrever, reorganizar, melhorar, ou editar conteúdo de uma nota.

Default: "chat". Só use "suggestion" se houver verbo de ação direto sobre o conteúdo ("escreva", "resuma", "reformule", "melhore", "complete", "adicione um parágrafo sobre X").`;

export async function classifyIntent(
  params: ClassifyParams,
): Promise<AiIntent> {
  if (params.hasSelection) return "suggestion";

  try {
    const model = getModel("claude-haiku-4-5");
    const { object } = await generateObject({
      model: model.build(),
      schema: aiIntentSchema,
      system: CLASSIFIER_SYSTEM,
      prompt: `Mensagem do usuário: """${params.userMessage}"""\n\nContexto: ${
        params.hasNoteContext ? "há uma nota aberta" : "sem nota aberta"
      }.`,
    });
    return object.intent;
  } catch {
    return "chat";
  }
}
