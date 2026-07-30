import { isToolUIPart, type ToolUIPart } from "ai";
import { NOTE_EDIT_TOOLS } from "./agentToolLabels";
import { isDeleteApprovalTool } from "./ChatDeleteConfirmation";
import type { AiUIMessage } from "./hook/useAiChat";

export function getMessageText(message: AiUIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function getReasoningText(message: AiUIMessage): string {
  return message.parts
    .filter((part) => part.type === "reasoning")
    .map((part) => (part as { text: string }).text)
    .join("");
}

export function getFileParts(message: AiUIMessage) {
  return message.parts.filter(
    (part): part is Extract<(typeof message.parts)[number], { type: "file" }> =>
      part.type === "file",
  );
}

export type ChatFilePart = ReturnType<typeof getFileParts>[number];

export function getWorkspaceTools(message: AiUIMessage): ToolUIPart[] {
  return message.parts.filter((part): part is ToolUIPart => {
    if (!isToolUIPart(part)) return false;
    const name = part.type.replace(/^tool-/, "");
    return !NOTE_EDIT_TOOLS.has(name) && !isDeleteApprovalTool(name);
  });
}

export function toolStepStatus(
  state: ToolUIPart["state"],
): "complete" | "active" | "pending" {
  switch (state) {
    case "output-available":
    case "output-error":
    case "output-denied":
      return "complete";
    case "input-streaming":
    case "input-available":
    case "approval-requested":
    case "approval-responded":
      return "active";
    default: {
      const _exhaustive: never = state;
      void _exhaustive;
      return "pending";
    }
  }
}

export function cotHeaderLabel(params: {
  isStreaming: boolean;
  hasReasoning: boolean;
  toolCount: number;
}): string {
  const { isStreaming, hasReasoning, toolCount } = params;
  if (isStreaming) {
    if (toolCount > 0) return `Usando ferramentas (${toolCount})…`;
    return "Pensando…";
  }
  if (hasReasoning && toolCount > 0) {
    return `Raciocínio · ${toolCount} ferramenta${toolCount === 1 ? "" : "s"}`;
  }
  if (toolCount > 0) {
    return `${toolCount} ferramenta${toolCount === 1 ? "" : "s"}`;
  }
  return "Raciocínio";
}
