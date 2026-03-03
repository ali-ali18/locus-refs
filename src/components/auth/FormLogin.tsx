"use client";

import { Loading02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { FieldGroupApp } from "@/components/base";
import type { FormSchema } from "@/types/auth.schema";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { FieldGroup } from "../ui/field";
import {
  AuthFormError,
  PasswordRevealButton,
  SocialButtons,
} from "./AuthFormParts";
import { useLogin } from "./hook/useLogin";

interface Props extends React.ComponentProps<"form"> {}

export function FormLogin({ children, ...props }: Props) {
  const { form, passwordType, revealPassword, onSubmit, error, isLoading } =
    useLogin();

  return (
    <form className="flex flex-col gap-6 w-full" onSubmit={onSubmit} {...props}>
      <AuthFormError error={error} isLoading={isLoading} />

      <FieldGroup className="flex flex-col gap-4">
        <FieldGroupApp<FormSchema>
          name="email"
          label="Email"
          control={form.control}
          placeholder="me@example.com"
          firstElement={<Icon icon={Mail01Icon} />}
        />
        <FieldGroupApp<FormSchema>
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
          "Entrar"
        )}
      </Button>

      <SocialButtons prefix="Login" isLoading={isLoading} />
    </form>
  );
}
