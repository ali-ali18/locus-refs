"use client";

import {
  Alert01FreeIcons,
  EyeIcon,
  Github01FreeIcons,
  GoogleIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "../shared/Icon";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export interface PasswordRevealButtonProps {
  type: "password" | "text";
  onReveal: () => void;
  ariaLabel?: string;
}

export function PasswordRevealButton({
  type,
  onReveal,
  ariaLabel,
}: PasswordRevealButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onReveal}
      aria-label={
        ariaLabel ?? (type === "password" ? "Mostrar senha" : "Ocultar senha")
      }
    >
      {type === "password" ? (
        <Icon icon={EyeIcon} />
      ) : (
        <Icon icon={ViewOffIcon} />
      )}
    </Button>
  );
}

export interface AuthFormErrorProps {
  error: string | number | null;
  isLoading?: boolean;
}

export function AuthFormError({ error, isLoading }: AuthFormErrorProps) {
  if (!error || isLoading) return null;
  return (
    <Alert>
      <Icon icon={Alert01FreeIcons} />
      <AlertTitle>Ocorreu um erro</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export interface SocialButtonsProps {
  prefix: "Login" | "Cadastrar";
  isLoading?: boolean;
}

export function SocialButtons({ prefix, isLoading }: SocialButtonsProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-muted-foreground">Ou continue com</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-full cursor-pointer"
          type="button"
          disabled={isLoading}
        >
          <Icon icon={GoogleIcon} className="size-5 mr-1.5" strokeWidth={2} />
          {prefix} com Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-full cursor-pointer"
          type="button"
          disabled={isLoading}
        >
          <Icon
            icon={Github01FreeIcons}
            className="size-5 mr-1.5"
            strokeWidth={2}
          />
          {prefix} com Github
        </Button>
      </div>
    </>
  );
}
