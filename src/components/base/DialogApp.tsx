import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface Props extends ComponentProps<typeof Dialog> {
  trigger?: ReactElement | string;
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export function DialogApp({
  trigger,
  children,
  className,
  title,
  description,
  footer,
  ...props
}: Props) {
  return (
    <Dialog {...props}>
      {typeof trigger === "string" ? (
        <DialogTrigger>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger render={trigger} />
      )}
      <DialogContent className={cn("w-full max-w-md rounded-2xl", className)}>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          <DialogDescription className="text-sm ">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4.5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
