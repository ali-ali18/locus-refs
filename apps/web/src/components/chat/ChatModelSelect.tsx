"use client";

import { CheckIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorSeparator,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  useAiModels,
  useAiSettings,
  useUpdateAiSettings,
} from "@/hook/ai/useAiSettings";
import { useIsMobile } from "@/hook/use-mobile";

type ModelOption = NonNullable<ReturnType<typeof useAiModels>["data"]>[number];

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: "Anthropic",
  minimax: "MiniMax",
};

function providerLabel(provider: string): string {
  return PROVIDER_LABELS[provider] ?? provider;
}

function ThinkingToggleRow({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-3 rounded-b-xl px-3.5 py-3 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
      onClick={onToggle}
    >
      <span className="text-sm text-foreground">Thinking</span>
      <Switch checked={checked} tabIndex={-1} className="pointer-events-none" />
    </button>
  );
}

function ModelHoverDetails({
  model,
  modelThinkingOn,
  onToggleThinking,
}: {
  model: ModelOption;
  modelThinkingOn: boolean;
  onToggleThinking: () => void;
}) {
  return (
    <HoverCardContent
      side="right"
      align="start"
      sideOffset={10}
      className="w-72 overflow-hidden rounded-xl p-0"
    >
      <div className="flex flex-col gap-1 px-3.5 py-3">
        <p className="text-sm font-medium text-foreground">{model.label}</p>
        {model.description ? (
          <p className="text-xs text-muted-foreground">{model.description}</p>
        ) : null}
      </div>
      {model.supportsThinking ? (
        <>
          <Separator />
          <ThinkingToggleRow
            checked={modelThinkingOn}
            onToggle={onToggleThinking}
          />
        </>
      ) : null}
    </HoverCardContent>
  );
}

export function ChatModelSelect() {
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();
  const { mutate: updateSettings } = useUpdateAiSettings();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentModel = models?.find((m) => m.id === settings?.defaultModelId);
  const thinkingEnabled = settings?.thinkingEnabled ?? false;

  const grouped = useMemo(() => {
    const map = new Map<string, ModelOption[]>();
    for (const model of models ?? []) {
      const list = map.get(model.provider);
      if (list) {
        list.push(model);
      } else {
        map.set(model.provider, [model]);
      }
    }
    return Array.from(map);
  }, [models]);

  const handleSelect = useCallback(
    (id: string) => {
      updateSettings({ defaultModelId: id });
      if (isMobile) {
        const model = models?.find((m) => m.id === id);
        if (!model?.supportsThinking) {
          setOpen(false);
        }
        return;
      }
      setOpen(false);
    },
    [isMobile, models, updateSettings],
  );

  return (
    <ModelSelector
      modal="trap-focus"
      onOpenChange={(nextOpen, details) => {
        if (!nextOpen) {
          const target = details.event?.target;
          if (
            target instanceof Element &&
            target.closest('[data-slot="hover-card-content"]')
          ) {
            return;
          }
        }
        setOpen(nextOpen);
      }}
      open={open}
    >
      <ModelSelectorTrigger
        render={<PromptInputButton className="gap-1.5 text-xs" size="sm" />}
      >
        {currentModel ? (
          <ModelSelectorLogo provider={currentModel.provider} />
        ) : null}
        <ModelSelectorName className="max-w-28 flex-none truncate sm:max-w-none">
          {currentModel?.label ?? "Modelo"}
        </ModelSelectorName>
        {thinkingEnabled && currentModel?.supportsThinking ? (
          <span className="hidden shrink-0 text-muted-foreground sm:inline">
            Thinking
          </span>
        ) : null}
      </ModelSelectorTrigger>
      <ModelSelectorContent title="Selecionar modelo">
        <ModelSelectorInput placeholder="Buscar modelos..." />
        <ModelSelectorList>
          <ModelSelectorEmpty>Nenhum modelo encontrado.</ModelSelectorEmpty>
          {grouped.map(([provider, list]) => (
            <ModelSelectorGroup
              heading={providerLabel(provider)}
              key={provider}
            >
              {list.map((model) => {
                const isSelected = settings?.defaultModelId === model.id;
                const modelThinkingOn =
                  isSelected &&
                  thinkingEnabled &&
                  Boolean(model.supportsThinking);

                const item = (
                  <>
                    <ModelSelectorLogo provider={model.provider} />
                    <ModelSelectorName>{model.label}</ModelSelectorName>
                    {isSelected ? (
                      <CheckIcon className="ml-auto size-4 shrink-0" />
                    ) : (
                      <div className="ml-auto size-4 shrink-0" />
                    )}
                  </>
                );

                if (isMobile) {
                  return (
                    <ModelSelectorItem
                      key={model.id}
                      onSelect={() => handleSelect(model.id)}
                      value={`${providerLabel(model.provider)} ${model.label} ${model.id}`}
                    >
                      {item}
                    </ModelSelectorItem>
                  );
                }

                return (
                  <HoverCard key={model.id}>
                    <HoverCardTrigger
                      delay={150}
                      closeDelay={200}
                      render={
                        <ModelSelectorItem
                          onSelect={() => handleSelect(model.id)}
                          value={`${providerLabel(model.provider)} ${model.label} ${model.id}`}
                        />
                      }
                    >
                      {item}
                    </HoverCardTrigger>
                    <ModelHoverDetails
                      model={model}
                      modelThinkingOn={modelThinkingOn}
                      onToggleThinking={() => {
                        updateSettings({
                          defaultModelId: model.id,
                          thinkingEnabled: !modelThinkingOn,
                        });
                      }}
                    />
                  </HoverCard>
                );
              })}
            </ModelSelectorGroup>
          ))}
        </ModelSelectorList>
        {isMobile && currentModel?.supportsThinking ? (
          <>
            <ModelSelectorSeparator />
            <div className="overflow-hidden">
              <ThinkingToggleRow
                checked={thinkingEnabled}
                onToggle={() => {
                  updateSettings({ thinkingEnabled: !thinkingEnabled });
                }}
              />
            </div>
          </>
        ) : null}
      </ModelSelectorContent>
    </ModelSelector>
  );
}
