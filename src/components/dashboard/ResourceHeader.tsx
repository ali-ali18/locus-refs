"use client";

import { Folder02Icon, Plus, Search01Icon } from "@hugeicons/core-free-icons";
import { type Dispatch, type SetStateAction } from "react";
import { InputGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

interface ResourceHeaderProps {
  title: string;
  resourcesCount: number;
  handleOpenDialogCreateResource: () => void;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export function ResourceHeader({
  title,
  resourcesCount,
  handleOpenDialogCreateResource,
  searchQuery,
  setSearchQuery,
}: ResourceHeaderProps) {
  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      <div className="flex items-center gap-1.5">
        <div className="inline-flex items-center gap-3">
          <span className="p-2 border rounded-xl bg-background shadow-sm">
            <Icon icon={Folder02Icon} className="size-6 text-foreground/80" />
          </span>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        <span className="text-muted-foreground text-sm font-medium ml-1">
          ({resourcesCount} recursos)
        </span>
      </div>

      <div className="w-full flex items-center justify-between gap-2">
        <InputGroupApp
          className="rounded-xl h-10 w-full max-w-md"
          placeholder="Pesquise pelo nome do recurso..."
          align="inline-start"
          firstElement={
            <Icon
              icon={Search01Icon}
              className="size-4 text-muted-foreground"
            />
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button
          variant="secondary"
          rounded="full"
          size="lg"
          onClick={handleOpenDialogCreateResource}
        >
          <Icon icon={Plus} className="size-4" /> Novo Recurso
        </Button>
      </div>

      <Separator />
    </div>
  );
}
