"use client";

import {
  File,
  Home01FreeIcons,
  Information,
  Menu01FreeIcons,
  Share06Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "../shared/Icon";
import { Logo } from "../shared/Logo";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

export function ContentHeader() {
  return (
    <LandingContent contentClassName="flex items-center justify-between gap-4 lg:gap-0">
      <div className="flex items-center gap-4">
        <Logo href="/" />
        <NavigationMenu className={"hidden sm:block"}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href={"/"} />}
                className={navigationMenuTriggerStyle()}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href={"/docs"} />}
                className={navigationMenuTriggerStyle()}
              >
                Documentação
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="gap-2 hidden sm:flex">
        <Button
          variant={"secondary"}
          nativeButton={false}
          render={<Link href={"/login"} />}
        >
          Entrar
        </Button>
        <Button
          variant={"default"}
          render={<Link href={"/login"} />}
          nativeButton={false}
          className={"text-primary-foreground font-semibold"}
        >
          Cadastrar-se <Icon icon={Share06Icon} />
        </Button>
      </div>

      <div className="sm:hidden">
        <Drawer>
          <DrawerTrigger>
            <Icon icon={Menu01FreeIcons} />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="font-medium text-lg">
              <DrawerTitle>Para onde vamos agora?</DrawerTitle>
              <DrawerDescription>
                Selecione seu destino, e veja a mágica acontecer...
              </DrawerDescription>
            </DrawerHeader>
            <nav className="flex flex-col gap-0.5 p-4 md:gap-1.5 md:text-left">
              <ul className="w-full">
                <li>
                  <Button
                    variant={"ghost"}
                    className="w-full"
                    render={<Link href={"/"} />}
                    nativeButton={false}
                  >
                    <Icon icon={Home01FreeIcons} />
                    Home
                  </Button>
                </li>
                <li>
                  <Button
                    variant={"ghost"}
                    className="w-full"
                    render={<Link href={"/"} />}
                    nativeButton={false}
                  >
                    <Icon icon={Information} />
                    Sobre
                  </Button>
                </li>
                <li>
                  <Button
                    variant={"ghost"}
                    className="w-full"
                    render={<Link href={"/docs"} />}
                    nativeButton={false}
                  >
                    <Icon icon={File} />
                    Documentação
                  </Button>
                </li>
              </ul>
            </nav>
            <DrawerFooter>
              <Button
                variant={"secondary"}
                render={<Link href={"/login"} />}
                nativeButton={false}
              >
                Entrar
              </Button>
              <Button
                className="font-semibold text-primary-foreground"
                render={<Link href={"/register"} />}
                nativeButton={false}
              >
                Cadastrar-se
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </LandingContent>
  );
}

export function ContainerHeader() {
  return (
    <LandingWrapper containerClassName="sticky top-0 z-100 h-[57px] shrink-0 border-t border-b sm:border-t-0">
      <ContentHeader />
    </LandingWrapper>
  );
}
