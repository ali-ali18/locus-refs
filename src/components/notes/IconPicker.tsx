"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ICONS_NAMES, resolveIcon } from "@/lib/icons";
import { Icon } from "../shared/Icon";

interface IconPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const PAGE_SIZE = 18;

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filteredNames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICONS_NAMES;
    return ICONS_NAMES.filter((name) => name.toLowerCase().includes(q));
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filteredNames.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 0), totalPages - 1);

  const pageItems = filteredNames.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  const handleSelect = (name: string | null) => {
    onChange(name);
    setOpen(false);
  };

  const selectedLabel = value ?? "Nenhum ícone selecionado";

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        rounded="xl"
        className="w-full justify-between"
        onClick={() => setOpen(true)}
      >
        <span className="truncate text-sm flex items-center gap-2">
          {value && (
            <span className="border rounded-xl p-1 bg-muted">
              <Icon icon={resolveIcon(value)} className="size-5.5" />
            </span>
          )}
          {selectedLabel}
        </span>
      </Button>

      <CommandDialog
        className="w-full sm:min-w-xl min-h-"
        open={open}
        onOpenChange={setOpen}
        title="Escolher ícone"
        description="Busque e selecione um ícone para a nota."
      >
        <Command>
          <CommandInput
            placeholder="Buscar ícone..."
            onValueChange={(value) => {
              setQuery(value);
              setPage(0);
            }}
          />
          <CommandList className="my-1.5">
            <CommandEmpty>Nenhum ícone encontrado.</CommandEmpty>
            <CommandGroup heading="Ícones">
              <div className="grid grid-cols-6 gap-2 p-1">
                {pageItems.map((name) => {
                  const IconSvg = resolveIcon(name);
                  const isActive = value === name;

                  return (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => handleSelect(name)}
                      className="flex flex-col items-center gap-1 px-2 py-2"
                    >
                      <Icon icon={IconSvg} className="size-5" />
                      <span className="w-full truncate text-xs text-center">
                        {name}
                      </span>
                      {isActive && (
                        <span className="text-[10px] text-emerald-500">
                          Selecionado
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </div>
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
            <Button
              rounded={"xl"}
              type="button"
              variant={"ghost"}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="disabled:opacity-50"
            >
              Anterior
            </Button>
            <span>
              Página {currentPage + 1} de {totalPages}
            </span>
            <Button
              rounded={"xl"}
              variant={"ghost"}
              type="button"
              onClick={() =>
                setPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage >= totalPages - 1}
              className="disabled:opacity-50"
            >
              Próxima
            </Button>
          </div>
        </Command>
      </CommandDialog>
    </div>
  );
}
