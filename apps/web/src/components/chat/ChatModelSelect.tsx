"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
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
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { PromptInputButton } from "@/components/ai-elements/prompt-input";
import { ProviderLogo } from "@/components/chat/ProviderLogo";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { cn } from "@/lib/utils";

type ModelOption = NonNullable<ReturnType<typeof useAiModels>["data"]>[number];

const PROVIDER_LABELS: Record<string, string> = {
  anthropic: "Anthropic",
  minimax: "MiniMax",
  atlas: "Atlas Cloud",
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

function RaciocinioSwitcher({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between gap-3 px-1 py-1 text-left outline-none"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      aria-pressed={checked}
    >
      <span className="text-sm text-foreground">Raciocínio</span>
      <Switch checked={checked} tabIndex={-1} className="pointer-events-none" />
    </button>
  );
}

function MobileModelRow({
  model,
  selected,
  thinkingEnabled,
  onSelect,
  onToggleThinking,
}: {
  model: ModelOption;
  selected: boolean;
  thinkingEnabled: boolean;
  onSelect: () => void;
  onToggleThinking: () => void;
}) {
  if (selected) {
    return (
      <div className="rounded-2xl bg-muted/60 p-3.5">
        <button
          type="button"
          className="flex w-full items-start gap-2.5 text-left outline-none"
          onClick={onSelect}
        >
          <ProviderLogo
            provider={model.provider}
            className="mt-0.5 size-4"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">
                {model.label}
              </span>
              <CheckIcon className="ml-auto size-4 shrink-0 text-primary" />
            </div>
            {model.description ? (
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                {model.description}
              </p>
            ) : null}
          </div>
        </button>
        {model.supportsThinking ? (
          <>
            <Separator className="my-3" />
            <RaciocinioSwitcher
              checked={thinkingEnabled}
              onToggle={onToggleThinking}
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-3 text-left outline-none transition-colors hover:bg-muted/50 active:bg-muted"
      onClick={onSelect}
    >
      <ProviderLogo provider={model.provider} className="size-4" />
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {model.label}
      </span>
    </button>
  );
}

function MobileModelDrawer({
  open,
  onOpenChange,
  grouped,
  currentModelId,
  thinkingEnabled,
  onSelectModel,
  onToggleThinking,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grouped: [string, ModelOption[]][];
  currentModelId?: string;
  thinkingEnabled: boolean;
  onSelectModel: (id: string) => void;
  onToggleThinking: () => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="data-[swipe-direction=down]:rounded-t-3xl">
        <DrawerHeader className="flex-row items-center justify-between gap-3 px-4 pt-1 pb-3 text-left">
          <DrawerTitle>Modelos</DrawerTitle>
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label="Fechar"
              />
            }
          >
            <Icon icon={Cancel01Icon} className="size-4" />
          </DrawerClose>
        </DrawerHeader>

        <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {grouped.map(([provider, list]) => (
            <div key={provider} className="mb-4">
              <p className="px-3.5 pb-1.5 text-xs font-medium text-muted-foreground">
                {providerLabel(provider)}
              </p>
              <div className="flex flex-col gap-0.5">
                {list.map((model) => (
                  <MobileModelRow
                    key={model.id}
                    model={model}
                    selected={currentModelId === model.id}
                    thinkingEnabled={thinkingEnabled}
                    onSelect={() => onSelectModel(model.id)}
                    onToggleThinking={onToggleThinking}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
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
      const model = models?.find((m) => m.id === id);
      updateSettings({
        defaultModelId: id,
        ...(model?.supportsThinking ? {} : { thinkingEnabled: false }),
      });
      if (!isMobile) {
        setOpen(false);
      }
    },
    [isMobile, models, updateSettings],
  );

  const handleToggleThinking = useCallback(() => {
    updateSettings({ thinkingEnabled: !thinkingEnabled });
  }, [thinkingEnabled, updateSettings]);

  const trigger = (
    <PromptInputButton
      className="gap-1.5 text-xs"
      size="sm"
      onClick={isMobile ? () => setOpen(true) : undefined}
      type="button"
    >
      {currentModel ? (
        <ProviderLogo provider={currentModel.provider} />
      ) : null}
      <span
        className={cn(
          "max-w-28 truncate sm:max-w-none",
          !currentModel && "text-muted-foreground",
        )}
      >
        {currentModel?.label ?? "Modelo"}
      </span>
      {thinkingEnabled && currentModel?.supportsThinking ? (
        <span className="hidden shrink-0 text-muted-foreground sm:inline">
          Thinking
        </span>
      ) : null}
      {thinkingEnabled && currentModel?.supportsThinking ? (
        <span className="shrink-0 text-muted-foreground sm:hidden">
          Raciocínio
        </span>
      ) : null}
    </PromptInputButton>
  );

  if (isMobile) {
    return (
      <>
        {trigger}
        <MobileModelDrawer
          open={open}
          onOpenChange={setOpen}
          grouped={grouped}
          currentModelId={settings?.defaultModelId}
          thinkingEnabled={thinkingEnabled}
          onSelectModel={handleSelect}
          onToggleThinking={handleToggleThinking}
        />
      </>
    );
  }

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
      <ModelSelectorTrigger render={<PromptInputButton className="gap-1.5 text-xs" size="sm" />}>
        {currentModel ? (
          <ProviderLogo provider={currentModel.provider} />
        ) : null}
        <ModelSelectorName className="max-w-28 flex-none truncate sm:max-w-none">
          {currentModel?.label ?? "Modelo"}
        </ModelSelectorName>
        {thinkingEnabled && currentModel?.supportsThinking ? (
          <span className="shrink-0 text-muted-foreground">Thinking</span>
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
                      <ProviderLogo provider={model.provider} />
                      <ModelSelectorName>{model.label}</ModelSelectorName>
                      {modelThinkingOn ? (
                        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          Thinking
                        </span>
                      ) : null}
                      {isSelected ? (
                        <CheckIcon className="ml-auto size-4 shrink-0" />
                      ) : (
                        <div className="ml-auto size-4 shrink-0" />
                      )}
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
      </ModelSelectorContent>
    </ModelSelector>
  );
}
