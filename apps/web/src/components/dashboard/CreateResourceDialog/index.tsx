"use client";

import type { ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Collection } from "@refstash/shared";
import { useCategories } from "../../../hook/categories/useCategories";
import { useCategory } from "../../../hook/categories/useCategory";
import { useResourceMutations } from "../hooks/useResourceMutations";
import { CreateCategoryInlineDialog } from "./CreateCategoryInlineDialog";
import { ResourceDialogMetadataPreview } from "./ResourceDialogMetadataPreview";
import { ResourceDialogStepDetailsForm } from "./ResourceDialogStepDetailsForm";
import { ResourceDialogStepUrlForm } from "./ResourceDialogStepUrlForm";
import { useCreateResourceDialog } from "./useCreateResourceDialog";

interface CreateResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCollectionId: string | null;
  collections: Collection[];
}

export function CreateResourceDialog({
  open,
  onOpenChange,
  defaultCollectionId,
  collections,
}: CreateResourceDialogProps): ReactElement {
  const { data: categories = [] } = useCategories();
  const { createCategory, isLoading } = useCategory();
  const { createResource, isCreating } = useResourceMutations();

  const {
    step,
    formStep1,
    formStep2,
    metadata,
    isFetchingMetadata,
    metadataError,
    handleOpenChange,
    setNewCategoryName,
    newCategoryName,
    isCreateCategoryDialogOpen,
    setIsCreateCategoryDialogOpen,
    onStep1Submit,
    onStep2Submit,
    handleBack,
    handleCreateCategory,
  } = useCreateResourceDialog({
    open,
    defaultCollectionId,
    onOpenChange,
    onCreateCategory: createCategory,
    onCreateResource: createResource,
  });

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={cn("sm:max-w-2xl")}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Novo Recurso
            </DialogTitle>
            <DialogDescription>
              Crie um novo recurso para centralizar o que você precisa para o
              seu dia a dia.
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <ResourceDialogStepUrlForm
              control={formStep1.control}
              formState={formStep1.formState}
              isFetchingMetadata={isFetchingMetadata}
              metadataError={metadataError}
              onCancel={() => handleOpenChange(false)}
              onSubmit={formStep1.handleSubmit(onStep1Submit)}
            />
          )}

          {step === 2 && (
            <>
              {metadata && (
                <ResourceDialogMetadataPreview metadata={metadata} />
              )}
              <ResourceDialogStepDetailsForm
                control={formStep2.control}
                formState={formStep2.formState}
                urlDisplay={formStep2.watch("url")}
                collections={collections}
                categories={categories}
                isCreating={isCreating}
                onBack={handleBack}
                onOpenCreateCategory={() => setIsCreateCategoryDialogOpen(true)}
                onSubmit={formStep2.handleSubmit(onStep2Submit)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <CreateCategoryInlineDialog
        open={isCreateCategoryDialogOpen}
        onOpenChange={setIsCreateCategoryDialogOpen}
        newCategoryName={newCategoryName}
        onNameChange={setNewCategoryName}
        isCreating={isLoading}
        onCreate={handleCreateCategory}
      />
    </>
  );
}
