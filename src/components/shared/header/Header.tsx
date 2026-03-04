"use client";

import { authClient } from "@/lib/auth-client";
import { Container } from "../Container";
import { Logo } from "../Logo";
import { DropdownHeader } from "./DropdownHeader";

export function Header() {
  const { data: session, isPending } = authClient.useSession();

  console.log(session);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <Container className="flex items-center justify-between">
        <Logo href="/dashboard" />

        <div>
          <DropdownHeader
            name={session?.user?.name ?? ""}
            email={session?.user?.email ?? ""}
            srcAvatar={session?.user?.image ?? ""}
            isPending={isPending}
          />
        </div>
      </Container>
    </header>
  );
}
