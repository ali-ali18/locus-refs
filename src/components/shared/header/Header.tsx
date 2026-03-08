"use client";

import { Container } from "../Container";
import { Logo } from "../Logo";
import { DropdownHeader } from "./DropdownHeader";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-4.5 ">
      <Container as="div" className="flex items-center justify-between my-0">
        <div className="flex items-center gap-3">
          <Logo href="/dashboard" />
        </div>

        <DropdownHeader />
      </Container>
    </header>
  );
}
