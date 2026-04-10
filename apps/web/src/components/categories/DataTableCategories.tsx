import { useState } from "react";
import { useCategories } from "@/hook/categories/useCategories";
import type { Category } from "@refstash/shared";
import { DataTableApp } from "../base/DataTableApp";
import { DialogApp } from "../base/DialogApp";
import { columnsCategories } from "./columns";
import { FormDeleteCategories } from "./FormDeleteCategories";
import { FormEditCategories } from "./FormEditCategories";

export function DataTableCategories() {
  const { data: categories = [] } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-4">
      <DialogApp
        open={!!editingCategory}
        onOpenChange={(open) =>
          setEditingCategory(open ? editingCategory : null)
        }
        title="Editar categoria"
        description="Edite uma categoria para organizar seus itens."
      >
        <FormEditCategories
          category={editingCategory}
          onSuccess={() => setEditingCategory(null)}
        />
      </DialogApp>

      <DialogApp
        open={!!deletingCategory}
        onOpenChange={(open) =>
          setDeletingCategory(open ? deletingCategory : null)
        }
        title="Excluir categoria"
        description="Excllua uma categoria que não é mais necessária."
      >
        {deletingCategory && (
          <FormDeleteCategories
            category={deletingCategory}
            onSuccess={() => setDeletingCategory(null)}
          />
        )}
      </DialogApp>

      <DataTableApp
        inputColumn="name"
        inputPlaceholder="Pesquise por uma categoria..."
        isFilter={true}
        columns={columnsCategories({
          onEdit: setEditingCategory,
          onDelete: setDeletingCategory,
        })}
        data={categories}
        isPagination={true}
      />
    </div>
  );
}
