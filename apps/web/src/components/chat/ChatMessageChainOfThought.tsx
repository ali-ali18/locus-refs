"use client";

import type { ToolUIPart } from "ai";
import { BrainIcon, WrenchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import {
  getToolCardSnippet,
  getToolCardTitle,
  getToolDoneLabel,
  getToolPendingLabel,
} from "./agentToolLabels";
import {
  cotHeaderLabel,
  getReasoningText,
  getWorkspaceTools,
  toolStepStatus,
} from "./chatMessageParts";
import type { AiUIMessage } from "./hook/useAiChat";

export function ChatMessageChainOfThought({
  message,
  isStreaming,
}: {
  message: AiUIMessage;
  isStreaming: boolean;
}) {
  const reasoningText = getReasoningText(message);
  const workspaceTools = getWorkspaceTools(message);
  const hasReasoning = Boolean(reasoningText.trim());
  const hasContent = hasReasoning || workspaceTools.length > 0;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isStreaming) {
      setOpen(true);
      return;
    }
    if (workspaceTools.length > 0) {
      setOpen(true);
      return;
    }
    if (hasReasoning) {
      const timer = setTimeout(() => setOpen(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [hasReasoning, isStreaming, workspaceTools.length]);

  if (!hasContent) return null;

  return (
    <ChainOfThought open={open} onOpenChange={setOpen} className="mb-1">
      <ChainOfThoughtHeader>
        {cotHeaderLabel({
          isStreaming,
          hasReasoning,
          toolCount: workspaceTools.length,
        })}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {hasReasoning ? (
          <ChainOfThoughtStep
            icon={BrainIcon}
            label="Pensamento"
            description={
              <span className="whitespace-pre-wrap">{reasoningText}</span>
            }
            status={
              isStreaming && workspaceTools.length === 0 ? "active" : "complete"
            }
          />
        ) : null}
        {workspaceTools.map((toolPart: ToolUIPart) => {
          const snippet = getToolCardSnippet(toolPart);
          return (
            <ChainOfThoughtStep
              key={toolPart.toolCallId}
              icon={WrenchIcon}
              label={getToolCardTitle(toolPart)}
              description={
                snippet ||
                (toolPart.state === "output-available" ||
                toolPart.state === "output-error"
                  ? getToolDoneLabel(toolPart)
                  : getToolPendingLabel(toolPart))
              }
              status={toolStepStatus(toolPart.state)}
            />
          );
        })}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}
