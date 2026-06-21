"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { popInviteRedirectCookie } from "@/lib/invite-cookie";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { type FormSchema, formSchema } from "@/types/schema/auth.schema";

export function useLogin() {
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const revealPassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const onSubmit = async (data: FormSchema) => {
    const { data: signInData } = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        rememberMe: false,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onError: (error) => {
          setIsLoading(false);

          if (error.error.status === 401) {
            return setError("Credenciais inválidas");
          }

          setError(error.error.message ?? "Erro ao fazer login");
        },
      },
    );
    const nextUserName = signInData?.user?.name.split(" ")[0] ?? null;
    setUserName(nextUserName);

    if (nextUserName) {
      toast.success(`Bem-vindo de volta, ${nextUserName}`);
      const invite = popInviteRedirectCookie();
      if (invite) {
        router.push(getSafeRedirectPath(invite));
      } else {
        const [{ data: sessionData }, { data: orgs }] = await Promise.all([
          authClient.getSession(),
          authClient.organization.list(),
        ]);
        const activeOrgId = sessionData?.session.activeOrganizationId;
        const activeOrg = activeOrgId
          ? orgs?.find((org) => org.id === activeOrgId)
          : undefined;
        const firstSlug = activeOrg?.slug ?? orgs?.[0]?.slug;
        router.push(firstSlug ? `/${firstSlug}` : "/workspace/new");
      }
    }

    return nextUserName;
  };

  return {
    form,
    passwordType,
    revealPassword,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    userName,
  };
}
