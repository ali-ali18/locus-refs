"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type UpdateWorkspaceSchema,
  updateWorkspaceSchema,
} from "@refstash/shared";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { WorkspaceLogo } from "@/components/sidebar/WorkspaceLogo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { LogoPicker } from "@/components/workspace/LogoPicker";
import { useWorkspace } from "@/context/workspace";
import { useWorkspaceSettings } from "@/hook/workspace/useWorkspaceSettings";

export function WorkspaceConfig() {
  const { workspaceName, workspaceSlug, workspaceLogo } = useWorkspace();
  const { updateWorkspace, deleteWorkspace, isUpdating, isDeleting } =
    useWorkspaceSettings();
  const [logoFile, setLogoFile] = useState<File | undefined>();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateWorkspaceSchema>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspaceName,
      slug: workspaceSlug,
      logo: workspaceLogo ?? undefined,
    },
  });

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    register("name").onChange(e);
    const slug = e.target.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setValue("slug", slug, { shouldValidate: true });
  }

  const currentSlug = watch("slug");
  const isFormDirty = isDirty || !!logoFile;

  async function onSubmit(data: UpdateWorkspaceSchema) {
    await updateWorkspace({
      name: data.name ?? workspaceName,
      slug: data.slug ?? workspaceSlug,
      logo: data.logo,
      logoFile,
    });
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/${currentSlug || workspaceSlug}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Configurações do workspace</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as informações e preferências do seu workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex items-end gap-3">
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger
                  type="button"
                  className="group dark:bg-input/30 relative flex items-center justify-center size-10 shrink-0 rounded-xl cursor-pointer border transition-all focus-visible:outline-none"
                >
                  <WorkspaceLogo
                    logo={field.value ?? null}
                    className="size-5"
                    withBackground={false}
                  />
                  <span className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/15 transition-colors" />
                </PopoverTrigger>
                <PopoverContent side="right" className="w-80 p-3">
                  <LogoPicker
                    showLabel={false}
                    value={field.value ?? null}
                    onChange={(val) => field.onChange(val)}
                    onFileChange={(files) => setLogoFile(files?.[0])}
                  />
                </PopoverContent>
              </Popover>
            )}
          />

          <div className="flex flex-col gap-2 flex-1">
            <Label htmlFor="ws-name">Nome</Label>
            <Input
              id="ws-name"
              placeholder="Meu workspace"
              {...register("name")}
              onChange={handleNameChange}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ws-slug">Slug (URL)</Label>
          <Input
            id="ws-slug"
            placeholder="meu-workspace"
            {...register("slug")}
          />
          {errors.slug ? (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">{url}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isUpdating || !isFormDirty}
            rounded={"xl"}
          >
            {isUpdating ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>

      <Separator />

      <Item variant="muted">
        <ItemContent>
          <ItemTitle className="font-medium">Deletar workspace</ItemTitle>
          <ItemDescription>
            Remove permanentemente o workspace e todos os seus dados.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" type="button" rounded={"xl"} />
              }
            >
              Deletar
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deletar workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os dados do workspace
                  serão permanentemente removidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => deleteWorkspace()}
                >
                  {isDeleting ? "Deletando..." : "Deletar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ItemActions>
      </Item>
    </div>
  );
}
