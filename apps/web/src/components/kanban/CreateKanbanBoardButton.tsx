"use client";

import { Plus } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { CreateKanbanBoardDialog } from "@/components/kanban/CreateKanbanBoardDialog";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";

export function CreateKanbanBoardButton({
  className,
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        <Icon icon={Plus} />
        Novo kanban
      </Button>
      <CreateKanbanBoardDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
