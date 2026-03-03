import { Plus } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { Icon } from "@/components/shared/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  handleDialog: () => void;
}

export function DashboardHeader({ handleDialog }: DashboardHeaderProps) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border bg-background md:h-62">
      <div className="absolute inset-0 select-none">
        <Image
          src="/banner-collections.png"
          alt="Banner Collections"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 flex flex-col justify-between md:flex-row md:items-center gap-6 p-8 md:p-10">
        <div className="flex flex-col gap-3 max-w-lg">
          <Badge
            variant="secondary"
            className="w-fit bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md"
          >
            Collections
          </Badge>
          <h1 className="text-3xl md:text-4xl text-white font-medium tracking-tight">
            Seus recursos organizados em um só local
          </h1>
        </div>

        <div>
          <Button
            variant="secondary"
            rounded="full"
            size="lg"
            className="font-medium shadow-lg hover:bg-secondary/85"
            onClick={handleDialog}
          >
            <Icon icon={Plus} className="size-5 mr-2" />
            Nova Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
