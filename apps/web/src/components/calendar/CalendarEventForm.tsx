"use client";

import {
  Calendar03Icon,
  Clock01Icon,
  Image01Icon,
  Loading02Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { FormEvent, RefObject } from "react";
import {
  Controller,
  type UseFormRegisterReturn,
  type UseFormReturn,
} from "react-hook-form";
import { InputGroupApp } from "@/components/base/InputGroupApp";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import type { CalendarEventDialogSchema } from "@/types/schema/calendar-event.schema";
import {
  initials,
  PRESET_EVENT_COLORS,
  resolveEventHex,
  toDateValue,
} from "./calendar-utils";

type FormValues = CalendarEventDialogSchema;

type Member = {
  userId: string;
  user: { name: string; image?: string | null };
};

interface Props {
  isMobile: boolean;
  isEdit: boolean;
  form: UseFormReturn<FormValues>;
  allMembers: Member[] | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  startTimeInputRef: RefObject<HTMLInputElement | null>;
  endTimeInputRef: RefObject<HTMLInputElement | null>;
  startTimeField: UseFormRegisterReturn<"startTime">;
  endTimeField: UseFormRegisterReturn<"endTime">;
  allDay: boolean;
  visibility: FormValues["visibility"];
  startAt: string;
  assigneeIds: string[];
  previewSrc: string | null | undefined;
  busy: boolean;
  dayLabel: string;
  setDay: (dateStr: string) => void;
  toggleAssignee: (userId: string) => void;
  pickImageFile: (file: File) => void;
  removeImage: () => void;
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}

export function CalendarEventForm({
  isMobile,
  isEdit,
  form,
  allMembers,
  fileInputRef,
  startTimeInputRef,
  endTimeInputRef,
  startTimeField,
  endTimeField,
  allDay,
  visibility,
  startAt,
  assigneeIds,
  previewSrc,
  busy,
  dayLabel,
  setDay,
  toggleAssignee,
  pickImageFile,
  removeImage,
  handleFormSubmit,
  onDelete,
}: Props) {
  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
      <Input
        autoFocus={!isMobile}
        placeholder="Título do evento"
        className="font-medium"
        {...form.register("title")}
      />

      <div className="relative">
        <InputGroupApp
          readOnly
          value={dayLabel}
          className="capitalize"
          firstElement={
            <Icon
              icon={Calendar03Icon}
              className="size-4 text-muted-foreground"
            />
          }
        />
        <input
          type="date"
          className="absolute inset-0 cursor-pointer opacity-0"
          value={toDateValue(startAt)}
          onChange={(e) => {
            if (e.target.value) setDay(e.target.value);
          }}
        />
      </div>

      {!allDay ? (
        <div className="flex items-center gap-2">
          <InputGroupApp
            type="time"
            {...startTimeField}
            ref={(el: HTMLInputElement | null) => {
              startTimeField.ref(el);
              startTimeInputRef.current = el;
            }}
            firstElement={
              <Icon
                icon={Clock01Icon}
                className="size-4 text-muted-foreground"
              />
            }
          />
          <InputGroupApp
            type="time"
            {...endTimeField}
            ref={(el: HTMLInputElement | null) => {
              endTimeField.ref(el);
              endTimeInputRef.current = el;
            }}
          />
        </div>
      ) : null}

      <Controller
        control={form.control}
        name="allDay"
        render={({ field }) => (
          <div className="flex items-center gap-2 text-sm">
            <Switch
              id="cal-allday"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(Boolean(v))}
            />
            <Label htmlFor="cal-allday">Dia inteiro</Label>
          </div>
        )}
      />

      <div className="space-y-2">
        <Label className="text-muted-foreground">Descrição</Label>
        <Textarea
          rows={3}
          placeholder="Detalhes do compromisso…"
          className="resize-none rounded-xl"
          {...form.register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground">Imagem</Label>
        {previewSrc ? (
          <div className="relative overflow-hidden rounded-xl border border-border">
            <img
              src={previewSrc}
              alt=""
              className="h-28 w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-background/80 p-2 backdrop-blur-sm">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
              >
                Trocar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={removeImage}
              >
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon icon={Image01Icon} data-icon="inline-start" />
            Adicionar imagem
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) pickImageFile(file);
          }}
        />
      </div>

      <Controller
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <div className="flex gap-2">
            <Toggle
              variant="outline"
              pressed={field.value === "personal"}
              onPressedChange={(pressed) => {
                if (pressed) {
                  field.onChange("personal");
                  form.setValue("assigneeIds", []);
                }
              }}
            >
              <Icon icon={UserIcon} data-icon="inline-start" />
              Pessoal
            </Toggle>
            <Toggle
              variant="outline"
              pressed={field.value === "workspace"}
              onPressedChange={(pressed) => {
                if (pressed) field.onChange("workspace");
              }}
            >
              <Icon icon={UserGroupIcon} data-icon="inline-start" />
              Workspace
            </Toggle>
          </div>
        )}
      />

      <div className="space-y-2">
        <Label className="text-muted-foreground">Cor</Label>
        <Controller
          control={form.control}
          name="color"
          render={({ field }) => {
            const value = resolveEventHex(field.value);
            return (
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_EVENT_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    title={hex}
                    onClick={() => field.onChange(hex)}
                    className={cn(
                      "size-7 rounded-full border-2 transition-transform",
                      value.toLowerCase() === hex.toLowerCase()
                        ? "scale-110 border-foreground"
                        : "border-transparent hover:scale-105",
                    )}
                    style={{ backgroundColor: hex }}
                  />
                ))}
                <label
                  className={cn(
                    "relative flex size-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border",
                    !PRESET_EVENT_COLORS.some(
                      (h) => h.toLowerCase() === value.toLowerCase(),
                    ) && "scale-110 border-solid border-foreground",
                  )}
                  title="Cor personalizada"
                >
                  <span
                    className="absolute inset-0.5 rounded-full"
                    style={{ backgroundColor: value }}
                  />
                  <input
                    type="color"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    value={value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </label>
              </div>
            );
          }}
        />
      </div>

      {visibility === "workspace" ? (
        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Pessoas (só quem for marcado vê o evento)
          </Label>
          <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
            {(allMembers ?? []).map((m) => {
              const selected = assigneeIds.includes(m.userId);
              return (
                <button
                  key={m.userId}
                  type="button"
                  title={m.user.name}
                  onClick={() => toggleAssignee(m.userId)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-xs transition-colors",
                    selected
                      ? "border-foreground bg-accent"
                      : "border-border hover:bg-muted",
                  )}
                >
                  <Avatar size="sm" className="size-6">
                    <AvatarImage
                      src={m.user.image ?? undefined}
                      alt={m.user.name}
                    />
                    <AvatarFallback className="text-[9px]">
                      {initials(m.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-24 truncate">{m.user.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 pt-1">
        {isEdit ? (
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            onClick={() => void onDelete()}
          >
            Excluir
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={busy}>
          {busy ? (
            <Icon icon={Loading02Icon} className="animate-spin" />
          ) : null}
          {isEdit ? "Salvar" : "Criar evento"}
        </Button>
      </div>
    </form>
  );
}
