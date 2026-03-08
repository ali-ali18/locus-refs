import {
  ChevronDown,
  LogOut,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { DropdownMenuApp } from "@/components/base/DropdownMenuApp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { Icon } from "../Icon";
import { ToggleButton } from "../ToggleButton";

export function DropdownHeader() {
  const { data: session, isPending } = authClient.useSession();
  
  const router = useRouter();

  const name = session?.user?.name ?? "Guest";
  const email = session?.user?.email ?? "Não informado/Não autenticado";

  const nextName = session?.user?.name?.split(" ")[0];
  const avatarSrc =
    session?.user?.image === "" ? undefined : session?.user?.image ?? "";

  const menuItems = [
    {
      icon: User02FreeIcons,
      label: "Perfil",
      href: "/perfil",
    },
    {
      icon: LogOut,
      label: "Sair",
      onClick: async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
          },
        });
      },
    },
  ];

  if (isPending) return <Skeleton className="w-16 h-10 rounded-full" />;

  return (
    <DropdownMenuApp
      contentClassName="w-84 px-4 py-3 flex flex-col gap-2 rounded-3xl mt-3"
      trigger={
        <div className="flex items-center gap-2 hover:bg-muted group-aria-expanded:bg-muted rounded-full transition-all duration-300 pr-3">
          <Avatar size="lg">
            <AvatarImage src={avatarSrc} alt={`Avatar de ${name}`} />
            <AvatarFallback>
              <Icon icon={User02FreeIcons} className="size-5" />
            </AvatarFallback>
          </Avatar>
          <Icon icon={ChevronDown} className="size-5" />
        </div>
      }
      header={
        <DropdownMenuGroup className="flex gap-2.5 items-center">
          <Avatar size="lg" className="">
            <AvatarImage src={avatarSrc} alt={`Avatar de ${name}`} />
            <AvatarFallback>
              <Icon icon={User02FreeIcons} className="size-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-base font-medium">{nextName}</p>
            <span className="text-sm text-muted-foreground line-clamp-1">
              {email}
            </span>
          </div>
        </DropdownMenuGroup>
      }
      items={menuItems}
      footer={<ToggleButton className="mt-5" />}
    />
  );
}
