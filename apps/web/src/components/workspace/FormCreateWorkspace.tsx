/** biome-ignore-all lint/performance/noImgElement: The image runs on the client side */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateWorkspaceSchema,
  createWorkspaceSchema,
} from "@refstash/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone";
import { IconPicker } from "@/components/notes/IconPicker";
import { WorkspaceLogo } from "@/components/sidebar/WorkspaceLogo";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useWorkspaceLogoUpload } from "./hooks/useWorkspaceLogoUpload";

interface Props {
  onSuccess?: () => void;
}

export function FormCreateWorkspace({ onSuccess }: Props) {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File[]>([]);
  const { uploadLogo } = useWorkspaceLogoUpload();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
  });

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    register("name").onChange(e);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setValue("slug", slug, { shouldValidate: true });
  }

  async function onSubmit(data: CreateWorkspaceSchema) {
    const { data: org, error } = await authClient.organization.create({
      name: data.name,
      slug: data.slug,
    });

    if (error || !org) {
      toast.error(error?.message ?? "Erro ao criar workspace");
      return;
    }

    if (logoFile[0]) {
      try {
        const logo = await uploadLogo(logoFile[0], org.id);
        await authClient.organization.update({
          organizationId: org.id,
          data: { logo },
        });
      } catch {
        toast.error("Workspace criado, mas falha ao enviar a logo.");
      }
    } else if (data.logo) {
      await authClient.organization.update({
        organizationId: org.id,
        data: { logo: data.logo },
      });
    }

    if (onSuccess) {
      toast.success(`Workspace "${data.name}" criado!`);
      onSuccess();
    } else {
      router.push(`/${data.slug}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome do workspace</Label>
        <Input
          id="name"
          placeholder="Meu espaço"
          {...register("name")}
          onChange={handleNameChange}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" placeholder="meu-espaco" {...register("slug")} />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Logo</Label>
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              {(field.value || logoFile[0]) && (
                <div className="flex items-center justify-center size-14 rounded-xl bg-muted self-start">
                  {logoFile[0] ? (
                    <img
                      src={URL.createObjectURL(logoFile[0])}
                      alt="preview"
                      className="size-full object-cover rounded-xl"
                    />
                  ) : (
                    <WorkspaceLogo logo={field.value} className="size-6" />
                  )}
                </div>
              )}
              <Tabs
                className={"cursor-pointer"}
                defaultValue="icon"
                onValueChange={() => {
                  field.onChange(undefined);
                  setLogoFile([]);
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="icon" className="flex-1">
                    Ícone
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex-1">
                    Imagem
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="icon" className="mt-2">
                  <IconPicker
                    value={field.value ?? null}
                    onChange={(name) => field.onChange(name ?? undefined)}
                  />
                </TabsContent>

                <TabsContent value="image" className="mt-2">
                  <Dropzone
                    accept={{ "image/*": [] }}
                    maxSize={5 * 1024 * 1024}
                    src={logoFile.length ? logoFile : undefined}
                    onDrop={(files) => {
                      const file = files[0];
                      if (!file) return;
                      setLogoFile([file]);
                      const reader = new FileReader();
                      reader.onload = (e) =>
                        field.onChange(e.target?.result as string);
                      reader.readAsDataURL(file);
                    }}
                  >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </TabsContent>
              </Tabs>
            </div>
          )}
        />
      </div>

      <div className="flex gap-2 mt-2">
        {onSuccess && (
          <AlertDialogFooter className="ml-auto">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={isSubmitting}>
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        )}

        {!onSuccess && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className={onSuccess ? "flex-1" : "w-full"}
          >
            {isSubmitting ? "Criando..." : "Criar workspace"}
          </Button>
        )}
      </div>
    </form>
  );
}
