"use client";

import type { ToolUIPart } from "ai";
import { CheckIcon, XIcon } from "lucide-react";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";

const DELETE_TOOLS = new Set([
  "deleteNote",
  "deleteCollection",
  "deleteResource",
  "deleteKanbanBoard",
]);

export function isDeleteApprovalTool(toolName: string): boolean {
  return DELETE_TOOLS.has(toolName);
}

function describeDelete(part: ToolUIPart): string {
  const name = part.type.replace(/^tool-/, "");
  const input = part.input as Record<string, unknown> | undefined;

  switch (name) {
    case "deleteNote":
      return `Excluir permanentemente a nota${typeof input?.noteId === "string" ? ` (${input.noteId.slice(0, 8)}…)` : ""}?`;
    case "deleteCollection":
      return `Excluir a coleção${typeof input?.collectionId === "string" ? ` (${input.collectionId.slice(0, 8)}…)` : ""} e o conteúdo em cascata?`;
    case "deleteResource":
      return `Excluir o recurso${typeof input?.resourceId === "string" ? ` (${input.resourceId.slice(0, 8)}…)` : ""}?`;
    case "deleteKanbanBoard":
      return `Excluir o board Kanban${typeof input?.boardId === "string" ? ` (${input.boardId.slice(0, 8)}…)` : ""}?`;
    default:
      return "Confirmar esta exclusão?";
  }
}

interface ChatDeleteConfirmationProps {
  part: ToolUIPart;
  onRespond: (approvalId: string, approved: boolean) => void;
}

export function ChatDeleteConfirmation({
  part,
  onRespond,
}: ChatDeleteConfirmationProps) {
  if (!part.approval) return null;

  return (
    <Confirmation
      approval={part.approval}
      state={part.state}
      className="mt-2 rounded-xl"
    >
      <ConfirmationTitle>
        <ConfirmationRequest>
          {describeDelete(part)}
          <br />
          Esta ação não pode ser desfeita.
        </ConfirmationRequest>
        <ConfirmationAccepted>
          <span className="inline-flex items-center gap-1.5">
            <CheckIcon className="size-4" />
            Exclusão aprovada
          </span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <span className="inline-flex items-center gap-1.5">
            <XIcon className="size-4" />
            Exclusão recusada
          </span>
        </ConfirmationRejected>
      </ConfirmationTitle>
      <ConfirmationActions>
        <ConfirmationAction
          variant="outline"
          onClick={() => {
            const approvalId = part.approval?.id;
            if (!approvalId) return;
            onRespond(approvalId, false);
          }}
        >
          Recusar
        </ConfirmationAction>
        <ConfirmationAction
          variant="destructive"
          onClick={() => {
            const approvalId = part.approval?.id;
            if (!approvalId) return;
            onRespond(approvalId, true);
          }}
        >
          Excluir
        </ConfirmationAction>
      </ConfirmationActions>
    </Confirmation>
  );
}
