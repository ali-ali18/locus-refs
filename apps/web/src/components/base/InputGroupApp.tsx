import type { ReactNode } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface InputGroupAppProps extends React.ComponentProps<"input"> {
  firstElement?: ReactNode;
  lastElement?: ReactNode;
  autoComplete?: "on" | "off";
  align?: "inline-start" | "inline-end" | "block-start" | "block-end";
}

export function InputGroupApp({
  firstElement,
  lastElement,
  autoComplete = "on",
  align = "inline-start",
  ...props
}: InputGroupAppProps) {
  return (
    <InputGroup className={cn("rounded-xl", props.className)}>
      {firstElement && <InputGroupAddon>{firstElement}</InputGroupAddon>}
      <InputGroupInput {...props} autoComplete={autoComplete} />
      {lastElement && (
        <InputGroupAddon align={align}>{lastElement}</InputGroupAddon>
      )}
    </InputGroup>
  );
}
