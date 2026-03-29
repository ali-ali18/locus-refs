import { ClaudeFreeIcons } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";

type AuthLayoutProps = {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
  reversePanel?: boolean;
};

export function AuthLayout({
  title,
  description,
  footer,
  children,
  reversePanel = false,
}: AuthLayoutProps) {
  return (
    <section className="h-screen grid grid-cols-1 md:grid-cols-2">
      <div
        className={cn(
          "flex flex-col gap-8 p-8",
          reversePanel && "order-2 md:order-1",
        )}
      >
        <Link href="/login" className="flex items-center gap-2 w-fit">
          <Icon icon={ClaudeFreeIcons} className="size-8" />
          <span className="text-xl font-bold">Locus</span>
        </Link>

        <div className="flex flex-col flex-1 items-center justify-center w-full min-w-0 max-w-md mx-auto gap-6">
          <div className="flex flex-col gap-2 text-center items-center">
            <h1 className="text-2xl font-medium">{title}</h1>
            <p className="text-center text-muted-foreground">{description}</p>
          </div>

          {children}

          <p className="text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>

      <div className="hidden md:block bg-muted" />
    </section>
  );
}
