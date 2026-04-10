"use client";

import {
  Folder,
  Note01FreeIcons,
  Tag,
  Users,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { FormCreateCollection } from "@/components/collections/FormCreateCollection";
import { FormCreateNote } from "@/components/notes/FormCreateNote";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogApp } from "../../base/DialogApp";

export function QuickCreate() {
  const [openNote, setOpenNote] = useState(false);
  const [openCollection, setOpenCollection] = useState(false);

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Centro de criação</CardTitle>
        <CardDescription>Todas funcionalidades de criação estão aqui</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-2.5">
          <DialogApp
            open={openNote}
            onOpenChange={setOpenNote}
            trigger={
              <Button rounded="xl">
                <Icon icon={Note01FreeIcons} />
                <span>Nota</span>
              </Button>
            }
            title="Crie uma nova nota"
            description="Adicione um título e um ícone para sua nova nota."
          >
            <FormCreateNote />
          </DialogApp>

          <DialogApp
            open={openCollection}
            onOpenChange={setOpenCollection}
            trigger={
              <Button rounded="xl">
                <Icon icon={Folder} />
                <span>Coleção</span>
              </Button>
            }
            title="Nova coleção"
            description="Crie uma coleção para organizar suas notas."
          >
            <FormCreateCollection onSuccess={() => setOpenCollection(false)} />
          </DialogApp>

          <Button rounded="xl" disabled>
            <Icon icon={Users} />
            <span>Convite</span>
          </Button>

          <Button rounded="xl" disabled>
            <Icon icon={Tag} />
            <span>Categoria</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
