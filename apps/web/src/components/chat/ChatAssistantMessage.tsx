"use client";

import { isToolUIPart, type ToolUIPart } from "ai";
import { MessageResponse } from "@/components/ai-elements/message";
import type { NoteEditToolName, NoteEditToolResult } from "@/lib/ai/tools";
import { NOTE_EDIT_TOOLS } from "./agentToolLabels";
import {
  ChatDeleteConfirmation,
  isDeleteApprovalTool,
} from "./ChatDeleteConfirmation";
import { ChatToolPlanCard } from "./ChatToolPlanCard";
import type { AiUIMessage } from "./hook/useAiChat";

export function ChatAssistantMessage({
  message,
  noteId,
  addToolOutput,
  addToolApprovalResponse,
}: {
  message: AiUIMessage;
  noteId?: string;
  addToolOutput: (args: {
    tool: NoteEditToolName;
    toolCallId: string;
    output: NoteEditToolResult;
  }) => void;
  addToolApprovalResponse: (args: {
    id: string;
    approved: boolean;
    reason?: string;
  }) => void | PromiseLike<void>;
}) {
  return (
    <div className="min-w-0 overflow-x-hidden text-sm leading-relaxed text-foreground">
      {message.parts.map((part, idx) => {
        if (part.type === "text") {
          if (!part.text.trim()) return null;
          return (
            <MessageResponse key={`${message.id}-t-${idx}`}>
              {part.text}
            </MessageResponse>
          );
        }

        if (isToolUIPart(part)) {
          const toolPart = part as ToolUIPart;
          const toolName = toolPart.type.replace(/^tool-/, "");

          if (isDeleteApprovalTool(toolName)) {
            return (
              <ChatDeleteConfirmation
                key={toolPart.toolCallId}
                part={toolPart}
                onRespond={(approvalId, approved) => {
                  void addToolApprovalResponse({
                    id: approvalId,
                    approved,
                  });
                }}
              />
            );
          }

          if (!NOTE_EDIT_TOOLS.has(toolName) || !noteId) {
            return null;
          }
          return (
            <ChatToolPlanCard
              key={toolPart.toolCallId}
              part={toolPart}
              noteId={noteId}
              onResolve={(toolCallId, resolvedName, result) =>
                addToolOutput({
                  tool: resolvedName,
                  toolCallId,
                  output: result,
                })
              }
            />
          );
        }

        return null;
      })}
    </div>
  );
}
