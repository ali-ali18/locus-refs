import { BubbleChatIcon, UserListFreeIcons } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Icon } from "@/components/shared/Icon";
import { Card } from "@/components/ui/card";

const sections = [
  {
    href: "settings/members",
    icon: UserListFreeIcons,
    title: "Membros",
    description: "Gerencie membros e convites do workspace.",
  },
  {
    href: "settings/ai",
    icon: BubbleChatIcon,
    title: "Assistente de IA",
    description: "Escolha o modelo de IA padrão deste workspace.",
  },
];

export default function SettingsPage() {
  return (
    <Container as="section" itemSpacing="md">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Configurações gerais do workspace.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="block">
            <Card className="p-4 transition-colors hover:border-primary">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <Icon icon={section.icon} className="size-4" />
                </div>
                <div className="space-y-1">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {section.description}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
