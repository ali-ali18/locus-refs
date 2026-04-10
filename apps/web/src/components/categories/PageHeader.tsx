import { PlusSignIcon, Tag01FreeIcons } from "@hugeicons/core-free-icons";
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
import { FormCreateCategories } from "./FormCreateCategories";

export function PageHeader() {
  const [openCreate, setOpenCreate] = useState(false);
  return (
    <Item variant={"outline"}>
      <ItemMedia variant={"icon"} className="border p-1.5 rounded-xl">
        <Icon icon={Tag01FreeIcons} className="size-5" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-lg font-medium">
          Faça a gestão das suas categorias
        </ItemTitle>
        <ItemDescription>
          Crie, edite e delete categorias para organizar seus itens.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <DialogApp
          open={openCreate}
          onOpenChange={setOpenCreate}
          trigger={
            <Button variant="outline" rounded={"xl"}>
              <Icon icon={PlusSignIcon} /> Nova categoria
            </Button>
          }
          title="Nova categoria"
          description="Crie uma nova categoria para organizar seus itens."
        >
          <FormCreateCategories onSuccess={() => setOpenCreate(false)} />
        </DialogApp>
      </ItemActions>
    </Item>
  );
}
