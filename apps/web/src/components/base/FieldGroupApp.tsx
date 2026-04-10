"use client";

import type { ReactNode } from "react";
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { InputGroupApp } from "./InputGroupApp";

export interface FieldGroupAppProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  control: Control<T>;
  firstElement?: ReactNode;
  lastElement?: ReactNode;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week";
  placeholder?: string;
  align?: "inline-start" | "inline-end" | "block-start" | "block-end";
  className?: string;
}

export function FieldGroupApp<T extends FieldValues>({
  name,
  label,
  control,
  firstElement,
  lastElement,
  type,
  placeholder,
  align = "inline-start",
  className,
}: FieldGroupAppProps<T>) {
  return (
    <Controller<T>
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <InputGroupApp
            {...field}
            className={cn(className)}
            firstElement={firstElement}
            lastElement={lastElement}
            align={align}
            autoComplete="off"
            type={type}
            placeholder={placeholder}
          />
          {fieldState.error && (
            <FieldError>{fieldState.error.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
