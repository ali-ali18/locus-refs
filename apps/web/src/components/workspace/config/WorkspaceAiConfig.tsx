"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAiModels,
  useAiSettings,
  useUpdateAiSettings,
} from "@/hook/ai/useAiSettings";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { cn } from "@/lib/utils";
import { WorkspaceAgentSkills } from "./WorkspaceAgentSkills";

export function WorkspaceAiConfig() {
  const { currentMember } = useWorkspaceMembers();
  const isAdmin =
    currentMember?.role === "admin" || currentMember?.role === "owner";

  const { data: models, isLoading: modelsLoading } = useAiModels();
  const { data: settings, isLoading: settingsLoading } = useAiSettings();
  const { mutate: updateSettings, isPending } = useUpdateAiSettings();

  const [systemPrompt, setSystemPrompt] = useState<string | undefined>(
    undefined,
  );

  const currentSystemPrompt =
    systemPrompt !== undefined ? systemPrompt : (settings?.systemPrompt ?? "");

  const isLoading = modelsLoading || settingsLoading;
  const promptDirty = currentSystemPrompt !== (settings?.systemPrompt ?? "");

  const handleSaveSystemPrompt = () => {
    updateSettings(
      { systemPrompt: currentSystemPrompt || null },
      { onSuccess: () => toast.success("System prompt salvo!") },
    );
  };

  return (
    <div className="space-y-8">
      {isAdmin ? (
        <>
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-semibold">Modelo padrão</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Modelo usado pelo assistente quando nenhum outro for
                especificado.
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {models?.map((model) => {
                  const isSelected = settings?.defaultModelId === model.id;
                  return (
                    <Card
                      key={model.id}
                      onClick={() => {
                        if (!isSelected && !isPending)
                          updateSettings({ defaultModelId: model.id });
                      }}
                      className={cn(
                        "cursor-pointer p-4 transition-colors hover:border-primary",
                        isSelected && "border-primary bg-primary/5",
                        isPending && "pointer-events-none opacity-60",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {model.description}
                          </div>
                          <div className="text-xs text-muted-foreground/60">
                            {model.provider}
                          </div>
                        </div>
                        {isSelected && (
                          <Icon
                            icon={CheckmarkCircle02Icon}
                            className="size-5 shrink-0 text-primary"
                          />
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-base font-semibold">System prompt</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Instrução base enviada ao modelo em toda conversa. Vazio =
                padrão do sistema.
              </p>
            </div>

            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-xl" />
            ) : (
              <>
                <Textarea
                  value={currentSystemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Ex: Você é um assistente especialista em desenvolvimento. Responda sempre em português e de forma direta."
                  rows={5}
                  className="resize-none rounded-xl font-mono text-sm"
                />
                <div className="flex items-center gap-2">
                  {currentSystemPrompt ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSystemPrompt("")}
                    >
                      Usar padrão
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    onClick={handleSaveSystemPrompt}
                    disabled={isPending || !promptDirty}
                    className="ml-auto"
                  >
                    Salvar
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
      <Separator />
      <WorkspaceAgentSkills />
    </div>
  );
}
