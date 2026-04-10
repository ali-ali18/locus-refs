"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Users } from "@hugeicons/core-free-icons";
import type { InviteMemberSchema } from "@refstash/shared";
import { inviteMemberSchema } from "@refstash/shared";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputGroupApp } from "@/components/base";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkspaceInvitations } from "@/hook/workspace/useWorkspaceInvitations";

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const { inviteMember, isInviting } = useWorkspaceInvitations();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteMemberSchema>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: "member" },
  });

  async function onSubmit(data: InviteMemberSchema) {
    await inviteMember(data);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="default" rounded="xl" type="button" />}
      >
        <Icon icon={Users} /> Criar um convite
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar um novo membro</DialogTitle>
          <DialogDescription>
            Envie um convite para um novo membro do workspace.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-email">Email</Label>
            <InputGroupApp
              firstElement={<Icon icon={Mail} />}
              id="invite-email"
              type="email"
              placeholder="email@exemplo.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Função</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent className={"rounded-xl"}>
                    <SelectGroup>
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isInviting} rounded="xl">
              {isInviting ? "Enviando..." : "Enviar convite"}{" "}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
