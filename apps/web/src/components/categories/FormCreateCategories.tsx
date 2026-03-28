import { Loading02Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import type { CategorySchema } from "@/types/schema/category.schema";
import { FieldGroupApp } from "../base";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { useCategoryForm } from "./hook/useCategoryForm";

interface FormCreateCategoriesProps {
  onSuccess: () => void;
}

export function FormCreateCategories({ onSuccess }: FormCreateCategoriesProps) {
  const { form, onSubmit, isLoading } = useCategoryForm({
    onSuccess,
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FieldGroupApp<CategorySchema>
        control={form.control}
        align="inline-start"
        firstElement={<Icon icon={Tag01Icon} />}
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
          disabled={isLoading}
          onClick={() => form.reset()}
        >
          Limpar
        </Button>
        <Button type="submit" disabled={isLoading} rounded="full">
          {isLoading ? (
            <>
              <Icon icon={Loading02Icon} className="mr-2 size-4 animate-spin" />
              <span className="sr-only">Criando categoria...</span>
            </>
          ) : (
            "Criar categoria"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
