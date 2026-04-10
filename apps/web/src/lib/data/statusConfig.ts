import {
  Alert01FreeIcons,
  CheckListIcon,
  Loading01Icon,
  Time02FreeIcons,
} from "@hugeicons/core-free-icons";
import type { SaveStatus } from "@/types/saveStatus.type";

export const statusConfig: Record<
  SaveStatus,
  { icon: typeof CheckListIcon; label: string }
> = {
  saved: {
    icon: CheckListIcon,
    label: "Alterações salvas",
  },
  saving: {
    icon: Loading01Icon,
    label: "Salvando...",
  },
  error: {
    icon: Alert01FreeIcons,
    label: "Erro ao salvar",
  },
  idle: {
    icon: Time02FreeIcons,
    label: "Aguardando alterações...",
  },
};

export default statusConfig;
