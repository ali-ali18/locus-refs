"use client";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copyToClipboard } from "@/lib/clipboard";
import { useRemoveMember } from "./hooks/useRemoveMember";
import { Spinner } from "@/components/ui/spinner";

interface RemoveMemberDialogProps {
  memberId: string;
  memberName: string;
  memberEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RemoveMemberDialog({
  memberId,
  memberName,
  memberEmail,
  open,
  onOpenChange,
}: RemoveMemberDialogProps) {
  const {
    confirmEmail,
    setConfirmEmail,
    handleConfirm,
    isRemoving,
    isConfirmed,
    reset,
  } = useRemoveMember(memberId, memberEmail, () => onOpenChange(false));

  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await copyToClipboard(memberEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover membro</AlertDialogTitle>
          <AlertDialogDescription className="wrap-break-word">
            Você está prestes a remover <strong>{memberName}</strong> do
            workspace. Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <p className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground justify-center sm:justify-start">
            Digite
            <Button
              variant="secondary"
              type="button"
              rounded={"xl"}
              onClick={handleCopy}
              className="break-all px-1.5 h-8"
            >
              {memberEmail}
              <Icon
                icon={copied ? Tick02Icon : Copy01Icon}
                className="size-3.5 shrink-0"
              />
            </Button>
            para confirmar
          </p>
          <Input
            placeholder={memberEmail}
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            className="rounded-xl"
          />
        </div>

        <AlertDialogFooter>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isRemoving}
          >
            {isRemoving ? <><Spinner /> Removendo...</> : "Remover"}
          </Button>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
