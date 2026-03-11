"use client";

import { Note02FreeIcons, PlusSignIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { DialogApp } from "../base/DialogApp";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { FormCreateNote } from "./FormCreateNote";

export function PageHeaderNotes() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      <Item variant={"outline"} className="rounded-xl">
        <ItemMedia variant={"icon"} className="border p-1.5 rounded-xl">
          <Icon icon={Note02FreeIcons} className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-lg font-medium">
            Faça anotações de forma organizada, rápida e eficiente
          </ItemTitle>
          <ItemDescription className="text-sm text-muted-foreground">
            Crie, edite e delete anotações para organizar seus itens.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="outline"
            rounded={"xl"}
            onClick={() => setOpenCreate(true)}
          >
            <Icon icon={PlusSignIcon} />
            <span className="text-sm font-medium hidden sm:block">
              Nova nota
            </span>
          </Button>
        </ItemActions>
      </Item>

      {openCreate && (
        <DialogApp
          open={openCreate}
          onOpenChange={setOpenCreate}
          title="Crie uma nova nota"
          description="Crie uma nova nota para fazer anotações de forma organizada, rápida e eficiente"
        >
          <FormCreateNote />
        </DialogApp>
      )}
    </>
  );
}
