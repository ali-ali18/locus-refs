import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/lib/breadcrumb/route-resolvers";

interface BreadcrumbRendererProps {
  items: BreadcrumbItemType[];
}

interface BreadcrumbRendererItemProps {
  separatorKey: string;
  item: BreadcrumbItemType;
  index: number;
  isLast: boolean;
}

function BreadcrumbRendererItem({
  separatorKey,
  item,
  index,
  isLast,
}: BreadcrumbRendererItemProps) {
  return (
    <>
      {index > 0 && <BreadcrumbSeparator key={separatorKey} />}
      <BreadcrumbItem>
        {isLast || !item.href ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink render={<Link href={item.href} />}>
            {item.label}
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    </>
  );
}

export function BreadcrumbRenderer({ items }: BreadcrumbRendererProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const separatorKey = `sep-${index}`;
          const itemKey = item.href || `item-${index}`;

          return (
            <BreadcrumbRendererItem
              key={itemKey}
              separatorKey={separatorKey}
              item={item}
              index={index}
              isLast={isLast}
            />
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
