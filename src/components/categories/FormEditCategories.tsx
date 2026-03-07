import { Loading02Icon } from "@hugeicons/core-free-icons";
import type { Category } from "@/types/categories.type";
import type { CategorySchema } from "@/types/schema/category.schema";
import { FieldGroupApp } from "../base";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { useCategoryForm } from "./hook/useCategoryForm";

interface FormEditCategoriesProps {
  onSuccess: () => void;
  category: Category | null;
}

export function FormEditCategories({ onSuccess, category }: FormEditCategoriesProps) {
  const { form, onSubmit, isLoading } = useCategoryForm({
    onSuccess,
    category,
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroupApp<CategorySchema>
        control={form.control}
        name="name"
        label="Nome da categoria"
        placeholder="Ex: Frontend, Livros..."
        className="rounded-xl"
      />

      <DialogFooter className="mt-2">
        <Button
          type="button"
          variant="secondary"
          rounded="full"
          onClick={() => onSuccess()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} rounded="full">
          {isLoading ? (
            <>
              <Icon icon={Loading02Icon} className="mr-2 size-4 animate-spin" />
              <span className="sr-only">Salvando...</span>
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
