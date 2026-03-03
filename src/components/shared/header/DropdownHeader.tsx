import {
  ChevronDown,
  LogOut,
  User02FreeIcons,
} from "@hugeicons/core-free-icons";
import { DropdownMenuApp } from "@/components/base/DropdownMenuApp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "../Icon";
import { ToggleButton } from "../ToggleButton";

interface Props {
  srcAvatar?: string;
  name: string;
  email: string;
  isPending: boolean;
}

const menuItems = [
  {
    icon: User02FreeIcons,
    label: "Perfil",
    href: "/perfil",
  },
  {
    icon: LogOut,
    label: "Sair",
  },
];

export function DropdownHeader({
  srcAvatar,
  name = "Usuario",
  email = "usuario@email.com",
  isPending,
}: Props) {
  
  const nextName = name.split(" ")[0];
  if (isPending) return <Skeleton className="w-16 h-10 rounded-full" />;
  return (
    <DropdownMenuApp
      contentClassName="w-84 px-4 py-3 flex flex-col gap-2 rounded-3xl mt-3"
      trigger={
        <div className="flex items-center gap-2 hover:bg-muted group-aria-expanded:bg-muted rounded-full transition-all duration-300 pr-3">
          <Avatar size="lg">
            <AvatarImage src={srcAvatar} alt={`Avatar de ${name}`} />
            <AvatarFallback>
              <Icon icon={User02FreeIcons} className="size-5" />
            </AvatarFallback>
          </Avatar>
          <Icon icon={ChevronDown} className="size-5" />
        </div>
      }
    >
      <DropdownMenuGroup className="flex gap-2.5 items-center">
        <Avatar size="lg" className="">
          <AvatarImage src={srcAvatar} alt={`Avatar de ${name}`} />
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

      <DropdownMenuGroup className="space-y-2.5 mt-4">
        {menuItems.map((item) => (
          <DropdownMenuItem key={item.label} className="rounded">
            <Icon icon={item.icon} className="size-5" />
            {item.label}
          </DropdownMenuItem>
        ))}
        <ToggleButton className="mt-5" />
      </DropdownMenuGroup>
    </DropdownMenuApp>
  );
}
