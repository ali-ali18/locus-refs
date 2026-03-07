import { Loading02Icon } from "@hugeicons/core-free-icons";
import type { Category } from "@/types/categories.type";
import type { CategoryDeleteSchema } from "@/types/schema/category.schema";
import { FieldGroupApp } from "../base";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { useDeleteCategories } from "./hook/useDeleteCategories";

interface FormDeleteCategoriesProps {
  onSuccess: () => void;
  category: Category;
}

export function FormDeleteCategories({
  onSuccess,
  category,
}: FormDeleteCategoriesProps) {
  const { form, onSubmit, isLoading } = useDeleteCategories({
    onSuccess,
    category,
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroupApp<CategoryDeleteSchema>
        control={form.control}
        name="confirm"
        label={`para confirmar a exclusão, digite: categoria/${category.slug}`}
        placeholder={`categoria/${category.slug}`}
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
        <Button
          type="submit"
          disabled={isLoading || !form.formState.isValid}
          rounded="full"
          variant={"destructive"}
        >
          {isLoading ? (
            <>
              <Icon icon={Loading02Icon} className="mr-2 size-4 animate-spin" />
              <span className="sr-only">Excluindo categoria...</span>
            </>
          ) : (
            "Excluir categoria"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
