"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";

export function NextEventEmpty({
  workspaceSlug,
  onCreate,
}: {
  workspaceSlug: string;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-background text-muted-foreground shadow-sm">
        <Icon icon={Calendar03Icon} className="size-5" />
      </span>
      <p className="text-sm text-muted-foreground">
        Nada agendado nos próximos dias.
      </p>
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          className="w-full flex-1 rounded-full"
          onClick={onCreate}
        >
          Novo evento
        </Button>
        <Button
          nativeButton={false}
          className="w-full flex-1 rounded-full"
          render={<Link href={`/${workspaceSlug}/calendar`} />}
        >
          Abrir agenda
        </Button>
      </div>
    </div>
  );
}
