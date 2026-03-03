"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Collection } from "@/types/collection.type";
import { CreateCategoryInlineDialog } from "./CreateCategoryInlineDialog";
import { ResourceDialogMetadataPreview } from "./ResourceDialogMetadataPreview";
import { ResourceDialogStepDetailsForm } from "./ResourceDialogStepDetailsForm";
import { ResourceDialogStepUrlForm } from "./ResourceDialogStepUrlForm";
import { useCreateResourceDialog } from "./useCreateResourceDialog";
import type { Category } from "../services/useCategory";
import type { Metadata } from "../services/useFetchMetadata";
import type { CreateResourcePayload } from "../services/useResource";

export interface CreateResourceDialogMetadataState {
  metadata: Metadata | null;
  isFetchingMetadata: boolean;
  metadataError: Error | null;
}

export interface CreateResourceDialogCategoryActions {
  categories: Category[];
  onCreateCategory: (
    name: string,
  ) => Promise<{ message: string; category: Category }>;
  isCreatingCategory: boolean;
}

export interface CreateResourceDialogResourceActions {
  onCreateResource: (payload: CreateResourcePayload) => Promise<unknown>;
  isCreating: boolean;
}

interface CreateResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFetchMetadataRequest: (url: string) => void;
  metadataState: CreateResourceDialogMetadataState;
  defaultCollectionId: string | null;
  collections: Collection[];
  categoryActions: CreateResourceDialogCategoryActions;
  resourceActions: CreateResourceDialogResourceActions;
}

export function CreateResourceDialog({
  open,
  onOpenChange,
  onFetchMetadataRequest,
  metadataState,
  defaultCollectionId,
  collections,
  categoryActions,
  resourceActions,
}: CreateResourceDialogProps): React.ReactElement {
  const { metadata, isFetchingMetadata, metadataError } = metadataState;
  const { categories, onCreateCategory, isCreatingCategory } = categoryActions;
  const { onCreateResource, isCreating } = resourceActions;

  const {
    step,
    formStep1,
    formStep2,
    newCategoryName,
    setNewCategoryName,
    isCreateCategoryDialogOpen,
    setIsCreateCategoryDialogOpen,
    onStep1Submit,
    onStep2Submit,
    handleBack,
    handleCreateCategory,
  } = useCreateResourceDialog({
    open,
    defaultCollectionId,
    metadata,
    onOpenChange,
    onFetchMetadataRequest,
    onCreateCategory,
    onCreateResource,
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-2xl")}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Novo Recurso
            </DialogTitle>
            <DialogDescription>
              Crie um novo recurso para centralizar o que você precisa para o seu
              dia a dia.
            </DialogDescription>
          </DialogHeader>

          {step === 1 && (
            <ResourceDialogStepUrlForm
              control={formStep1.control}
              formState={formStep1.formState}
              isFetchingMetadata={isFetchingMetadata}
              metadataError={metadataError}
              onCancel={() => onOpenChange(false)}
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
        isCreating={isCreatingCategory}
        onCreate={handleCreateCategory}
      />
    </>
  );
}
