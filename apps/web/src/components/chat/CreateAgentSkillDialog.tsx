"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FieldGroupApp } from "@/components/base";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAgentSkillMutations } from "@/hook/ai/useAgentSkills";
import type { AgentSkill } from "@/types/agent-skill.type";
import {
  type CreateSkillSchema,
  createSchema,
} from "@/types/schema/skill.schema";

const VISIBILITY_LABELS = {
  personal: "Pessoal",
  workspace: "Workspace",
} as const;

const EMPTY_VALUES: CreateSkillSchema = {
  title: "",
  description: "",
  prompt: "",
  requiresNote: false,
  visibility: "personal",
};

export function CreateAgentSkillDialog({
  open,
  onOpenChange,
  skill = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Se passado, o dialog edita a skill. */
  skill?: AgentSkill | null;
}) {
  const isEdit = !!skill;
  const { createSkill, updateSkill, isCreating, isUpdating } =
    useAgentSkillMutations();
  const isPending = isCreating || isUpdating;

  const form = useForm<CreateSkillSchema>({
    resolver: zodResolver(createSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    if (skill) {
      form.reset({
        title: skill.title,
        description: skill.description ?? "",
        prompt: skill.prompt,
        requiresNote: skill.requiresNote,
        visibility: skill.visibility,
      });
      return;
    }
    form.reset(EMPTY_VALUES);
  }, [open, skill, form]);

  const onSubmit = async (data: CreateSkillSchema) => {
    const payload = {
      ...data,
      description: data.description?.trim() ? data.description : null,
    };

    if (skill) {
      await updateSkill({ id: skill.id, ...payload });
    } else {
      await createSkill(payload);
    }

    form.reset(EMPTY_VALUES);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar skill" : "Criar skill"}</DialogTitle>
          <DialogDescription>
            O Agent usa esse prompt quando a skill for selecionada. Pessoal =
            só você; Workspace = o time.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FieldGroupApp<CreateSkillSchema>
            control={form.control}
            name="title"
            label="Nome"
            placeholder="Ex: Revisar tom"
            className="rounded-xl"
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="skill-description">Descrição</Label>
                <Textarea
                  id="skill-description"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Opcional — aparece na lista"
                  className="min-h-16 rounded-xl resize-none"
                />
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="prompt"
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Label htmlFor="skill-prompt">Prompt</Label>
                <Textarea
                  id="skill-prompt"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Instruções que o Agent vai seguir…"
                  className="min-h-28 rounded-xl resize-none font-mono text-sm"
                />
                {fieldState.error ? (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="visibility"
            render={({ field }) => {
              const value = field.value ?? "personal";
              return (
                <div className="space-y-1.5">
                  <Label>Visibilidade</Label>
                  <Select value={value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue>{VISIBILITY_LABELS[value]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="personal">Pessoal</SelectItem>
                      <SelectItem value="workspace">Workspace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            }}
          />

          <Controller
            control={form.control}
            name="requiresNote"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2.5">
                <Label htmlFor="skill-requires-note" className="text-sm">
                  Requer nota aberta
                </Label>
                <Switch
                  id="skill-requires-note"
                  checked={field.value ?? false}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEdit
                ? isUpdating
                  ? "Salvando…"
                  : "Salvar"
                : isCreating
                  ? "Criando…"
                  : "Criar skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
