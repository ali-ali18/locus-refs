"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateWorkspaceSchema,
  createWorkspaceSchema,
} from "@refstash/shared";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function FormCreateWorkspace() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
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
    const { error } = await authClient.organization.create({
      name: data.name,
      slug: data.slug,
    });

    if (error) {
      toast.error(error.message ?? "Erro ao criar workspace");
      return;
    }

    router.push(`/${data.slug}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome do workspace</Label>
        <Input
          id="name"
          placeholder="Minha empresa"
          {...register("name")}
          onChange={handleNameChange}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" placeholder="minha-empresa" {...register("slug")} />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Criando..." : "Criar workspace"}
      </Button>
    </form>
  );
}
