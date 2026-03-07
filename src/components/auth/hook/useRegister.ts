"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { type RegisterSchema, registerSchema } from "@/types/schema/auth.schema";

export function useRegister() {
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password",
  );
  const [confirmPasswordType, setConfirmPasswordType] = useState<
    "password" | "text"
  >("password");

  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const revealPassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const revealConfirmPassword = () => {
    setConfirmPasswordType((prev) =>
      prev === "password" ? "text" : "password",
    );
  };

  const onSubmit = async (data: RegisterSchema) => {
    const { data: signUpData } = await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onError: (error) => {
          setIsLoading(false);
          if (error.error.status === 422) {
            return setError("E-mail já cadastrado");
          }
          setError(error.error.message ?? "Erro ao realizar cadastro");
        },
      },
    );
    const nextUserName = signUpData?.user?.name.split(" ")[0] ?? null;
    setUserName(nextUserName);
    if (nextUserName) {
      toast.success(`Seja bem-vindo, ${nextUserName}`);
      router.push("/dashboard");
    }
  };

  if (userName) {
    toast.success(`Seja bem-vindo, ${userName}`);
  }

  return {
    form,
    passwordType,
    confirmPasswordType,
    revealPassword,
    revealConfirmPassword,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    userName,
  };
}
