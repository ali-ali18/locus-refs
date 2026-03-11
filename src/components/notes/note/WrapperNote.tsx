"use client";

import { ArrowLeftIcon, ConfusedIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { EmptyApp } from "@/components/base/EmptyApp";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNote } from "@/hook/notes/useNotes";
import { PageHeaderNote } from "./PageHeaderNote";

interface Props {
  id: string;
}

export function WrapperNote({ id }: Props) {
  const { data: note, isLoading } = useNote(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-32 rounded-xl" aria-hidden />
        <Skeleton className="w-full h-14 rounded-xl" aria-hidden />
      </div>
    );
  }

  if (!note) {
    return (
      <EmptyApp
        className="rounded-xl border"
        title="Ops! Não conseguimos encontrar a sua nota..."
        description="Não foi possível encontrar a nota que você está procurando, verifique se o link está correto ou tente novamente mais tarde."
        icon={ConfusedIcon}
        classNameIcon="size-6"
        action={
          <Button
            variant="outline"
            rounded="xl"
            nativeButton={false}
            render={
              <Link href="/dashboard/notes">
                <Icon icon={ArrowLeftIcon} /> Voltar para as notas
              </Link>
            }
          />
        }
      />
    );
  }

  return <PageHeaderNote title={note.title} icon={note.icon} id={id} />;
}
