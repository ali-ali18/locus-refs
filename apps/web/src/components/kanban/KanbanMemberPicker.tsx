"use client";

import { Cancel01Icon, UnfoldMoreIcon, UserIcon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkspaceMembers } from "@/hook/workspace/useWorkspaceMembers";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function KanbanMemberPicker({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const { data: membersQuery, isLoading } = useWorkspaceMembers();
  const members = membersQuery?.data?.members ?? [];

  const options = useMemo(
    () =>
      members.map((member) => ({
        id: member.userId,
        name: member.user.name,
        image: member.user.image ?? null,
      })),
    [members],
  );

  const selected = options.find((option) => option.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isLoading}
            className="h-10 w-full justify-between rounded-xl px-3 font-normal"
          >
            <span className="flex min-w-0 items-center gap-2">
              {selected ? (
                <>
                  <Avatar className="size-6 overflow-hidden ring-1 ring-border">
                    <AvatarImage
                      alt={selected.name}
                      src={selected.image ?? undefined}
                    />
                    <AvatarFallback className="text-[10px]">
                      {initials(selected.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{selected.name}</span>
                </>
              ) : (
                <>
                  <Icon
                    icon={UserIcon}
                    className="size-4 text-muted-foreground"
                  />
                  <span className="text-muted-foreground">Sem responsável</span>
                </>
              )}
            </span>
            <Icon
              icon={UnfoldMoreIcon}
              className="size-4 shrink-0 opacity-50"
            />
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="w-(--anchor-width) min-w-[280px] overflow-hidden rounded-2xl p-0"
      >
        <Command className="rounded-2xl">
          <CommandInput placeholder="Buscar membro..." />
          <CommandList className="max-h-56 scrollbar-none">
            <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
            <CommandGroup heading="Responsável">
              <CommandItem
                value="sem responsavel none"
                className="rounded-xl gap-2 px-2 py-2"
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground",
                  )}
                >
                  <Icon icon={Cancel01Icon} className="size-3.5" />
                </span>
                <span>Sem responsável</span>
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={`${option.name} ${option.id}`}
                  className="rounded-xl gap-2 px-2 py-2"
                  data-checked={selected?.id === option.id || undefined}
                  onSelect={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                >
                  <Avatar className="size-6 overflow-hidden ring-1 ring-border">
                    <AvatarImage
                      alt={option.name}
                      src={option.image ?? undefined}
                    />
                    <AvatarFallback className="text-[10px]">
                      {initials(option.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{option.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
