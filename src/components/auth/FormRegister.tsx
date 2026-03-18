"use client";

import { Loading02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { FieldGroupApp } from "@/components/base";
import type { RegisterSchema } from "@/types/schema/auth.schema";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
import {
  AuthFormError,
  PasswordRevealButton,
  SocialButtons,
} from "./AuthFormParts";
import { useRegister } from "./hook/useRegister";

interface Props extends React.ComponentProps<"form"> {}

export function FormRegister({ children, ...props }: Props) {
  const {
    form,
    passwordType,
    confirmPasswordType,
    revealPassword,
    revealConfirmPassword,
    onSubmit,
    error,
    isLoading,
  } = useRegister();

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={onSubmit} {...props}>
      <AuthFormError error={error} isLoading={isLoading} />

      <FieldGroup className="flex flex-col gap-4">
        <FieldGroupApp<RegisterSchema>
          name="name"
          label="Nome"
          control={form.control}
          placeholder="Seu nome"
        />
        <FieldGroupApp<RegisterSchema>
          name="email"
          label="Email"
          control={form.control}
          placeholder="me@example.com"
          firstElement={<Icon icon={Mail01Icon} />}
        />
        <FieldGroupApp<RegisterSchema>
          name="password"
          label="Senha"
          control={form.control}
          align="inline-end"
          placeholder="Mypassword123@"
          type={passwordType}
          lastElement={
            <PasswordRevealButton
              type={passwordType}
              onReveal={revealPassword}
            />
          }
        />
        <FieldGroupApp<RegisterSchema>
          name="confirmPassword"
          label="Confirmar senha"
          control={form.control}
          align="inline-end"
          placeholder="Repita a senha"
          type={confirmPasswordType}
          lastElement={
            <PasswordRevealButton
              type={confirmPasswordType}
              onReveal={revealConfirmPassword}
            />
          }
        />
      </FieldGroup>

      <Button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 cursor-pointer rounded-full group"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <Icon icon={Loading02Icon} className="size-4 animate-spin" />
        ) : (
          "Cadastrar"
        )}
      </Button>

      <SocialButtons prefix="Cadastrar" isLoading={isLoading} />
    </form>
  );
}
