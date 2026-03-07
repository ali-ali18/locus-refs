"use client";

import { HomeFreeIcons, Tag01FreeIcons } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Container } from "../Container";
import { Icon } from "../Icon";
import { Logo } from "../Logo";
import { DropdownHeader } from "./DropdownHeader";

export function Header() {
  const { data: session, isPending } = authClient.useSession();

  const navLinks = [
    {
      IconName: HomeFreeIcons,
      label: "Início",
      href: "/dashboard",
    },
    {
      IconName: Tag01FreeIcons,
      label: "Categorias",
      href: "/dashboard/categories",
    },
  ];

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <Container as="div" className="flex items-center justify-between my-0">
        <div className="flex items-center gap-3">
          <Logo href="/dashboard" />

          <nav>
            <ul className="flex items-center gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Button
                    rounded={"xl"}
                    nativeButton={false}
                    render={
                      <Link href={link.href}>
                        <Icon icon={link.IconName} />
                        {link.label}
                      </Link>
                    }
                    variant={"ghost"}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>

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
