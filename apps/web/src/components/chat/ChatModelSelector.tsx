"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAiModels,
  useAiSettings,
  useUpdateAiSettings,
} from "@/hook/ai/useAiSettings";

export function ChatModelSelector() {
  const { data: models } = useAiModels();
  const { data: settings } = useAiSettings();
  const { mutate: updateSettings, isPending } = useUpdateAiSettings();

  if (!models || !settings) return null;

  return (
    <Select
      value={settings.defaultModelId}
      onValueChange={(value) => {
        if (value && value !== settings.defaultModelId) {
          updateSettings({ defaultModelId: value });
        }
      }}
      disabled={isPending}
    >
      <SelectTrigger
        size="sm"
        className="h-7 rounded-xl border-sidebar-border bg-sidebar-accent/50 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" side="bottom">
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
