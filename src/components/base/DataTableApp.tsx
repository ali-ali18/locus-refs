"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FilterIcon,
  Search01Icon,
  SearchListIcon,
} from "@hugeicons/core-free-icons";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { InputGroupApp } from ".";
import { EmpetyApp } from "./EmpetyApp";
import { DropdownMenuApp } from "./DropdownMenuApp";
import { DropdownMenuCheckboxItem } from "../ui/dropdown-menu";

interface DataTableAppProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  emptyComponent?: ReactNode;
  isPagination?: boolean;
  inputPlaceholder?: string;
  inputColumn?: string;
  isFilter?: boolean;
}

export function DataTableApp<TData, TValue>({
  columns,
  data,
  className,
  emptyComponent,
  isPagination = false,
  inputPlaceholder = "Pesquisar...",
  inputColumn,
  isFilter = false,
}: DataTableAppProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <div className="flex items-center gap-2">
        {inputColumn && (
          <InputGroupApp
            placeholder={inputPlaceholder}
            className="max-w-md"
            firstElement={
              <Icon
                icon={Search01Icon}
                className="size-4 text-muted-foreground"
              />
            }
            value={
              (table.getColumn(inputColumn)?.getFilterValue() ?? "") as string
            }
            onChange={(e) =>
              table.getColumn(inputColumn)?.setFilterValue(e.target.value)
            }
          />
        )}

        {isFilter && (
          <DropdownMenuApp
            className="hover:bg-transparent"
            trigger={
              <Button
                nativeButton={false}
                variant="outline"
                size="icon"
                rounded={"xl"}
                render={
                  <span>
                    <Icon
                      icon={FilterIcon}
                      className="size-4 text-muted-foreground"
                    />
                  </span>
                }
              />
            }
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const label = column.columnDef.meta?.label as string;
                return (
                  <DropdownMenuCheckboxItem
                    nativeButton={false}
                    key={column.id}
                    className="capitalize rounded-xl"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuApp>
        )}
      </div>

      <div className={cn("rounded-xl border overflow-hidden", className)}>
        <Table className="rounded-xl">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyComponent ? (
                    emptyComponent
                  ) : (
                    <EmpetyApp
                      title="Nenhum resultado encontrado"
                      description="Não foi possivel encontrar nenhum resultado"
                      icon={SearchListIcon}
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isPagination && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            rounded={"xl"}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <Icon icon={ArrowLeftIcon} />
          </Button>
          <span className="text-sm text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            rounded={"xl"}
          >
            <Icon icon={ArrowRightIcon} />
          </Button>
        </div>
      )}
    </>
  );
}
