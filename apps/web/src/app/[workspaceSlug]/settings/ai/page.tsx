"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/shared/Container";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAiModels,
  useAiSettings,
  useUpdateAiSettings,
} from "@/hook/ai/useAiSettings";
import { cn } from "@/lib/utils";

export default function AiSettingsPage() {
  const { data: models, isLoading: modelsLoading } = useAiModels();
  const { data: settings, isLoading: settingsLoading } = useAiSettings();
  const { mutate: updateSettings, isPending } = useUpdateAiSettings();

  const [systemPrompt, setSystemPrompt] = useState<string | undefined>(
    undefined,
  );

  const currentSystemPrompt =
    systemPrompt !== undefined ? systemPrompt : (settings?.systemPrompt ?? "");

  const isLoading = modelsLoading || settingsLoading;

  const handleSaveSystemPrompt = () => {
    updateSettings(
      { systemPrompt: currentSystemPrompt || null },
      {
        onSuccess: () => toast.success("System prompt salvo!"),
      },
    );
  };

  return (
    <Container as="section" itemSpacing="lg">
      <div>
        <h1 className="text-2xl font-bold">Configurações de IA</h1>
        <p className="text-muted-foreground mt-1">
          Personalize o assistente de IA deste workspace.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-32 rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <h2 className="text-base font-semibold">Modelo padrão</h2>
            <p className="text-sm text-muted-foreground -mt-1">
              Usado pelo assistente quando nenhum modelo é especificado na
              sessão.
            </p>
            <div className="flex flex-col gap-2">
              {models?.map((model) => {
                const isSelected = settings?.defaultModelId === model.id;
                return (
                  <Card
                    key={model.id}
                    onClick={() => {
                      if (!isSelected && !isPending) {
                        updateSettings({ defaultModelId: model.id });
                      }
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
          </div>

          <div className="space-y-3">
            <div>
              <h2 className="text-base font-semibold">System prompt</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Instrução base enviada para o modelo em toda conversa. Deixe
                vazio para usar o padrão do sistema.
              </p>
            </div>
            <Textarea
              value={currentSystemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Ex: Você é um assistente especialista em desenvolvimento de software. Sempre responda em português e de forma direta."
              rows={5}
              className="rounded-xl resize-none font-mono text-sm"
            />
            <div className="flex items-center justify-between">
              {currentSystemPrompt && (
                <Button
                  variant="ghost"
                  size="sm"
                  rounded="xl"
                  onClick={() => setSystemPrompt("")}
                >
                  Usar padrão do sistema
                </Button>
              )}
              <Button
                size="sm"
                rounded="xl"
                onClick={handleSaveSystemPrompt}
                disabled={
                  isPending ||
                  currentSystemPrompt === (settings?.systemPrompt ?? "")
                }
                className="ml-auto"
              >
                Salvar
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
