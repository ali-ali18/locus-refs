"use client";

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNoteEditor } from "@/context/noteEditor";
import { markdownToHtml } from "@/lib/ai/markdown-to-html";
import { Icon } from "../../shared/Icon";

interface AiNoteReviewProps {
  noteId: string;
}

function MarkdownPreview({ text }: { text: string }) {
  const html = markdownToHtml(text);

  // biome-ignore lint/security/noDangerouslySetInnerHtml: markdownToHtml escapes raw HTML and emits a fixed tag set locally.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function AiNoteReview({ noteId }: AiNoteReviewProps) {
  const { pendingProposal, applyPendingProposal, clearPendingProposal } =
    useNoteEditor();

  if (!pendingProposal || pendingProposal.noteId !== noteId) return null;

  const isSelectionProposal = pendingProposal.target.type === "selection";

  const handleApply = () => {
    const applied = applyPendingProposal(noteId);

    if (applied) {
      toast.success(
        isSelectionProposal
          ? "Sugestao aplicada ao trecho selecionado."
          : "Conteudo inserido na nota.",
      );
      return;
    }

    toast.error("Nao foi possivel aplicar a sugestao na nota.");
  };

  const handleDiscard = () => {
    clearPendingProposal(noteId);
    toast("Sugestao descartada.");
  };

  return (
    <section className="mb-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Icon icon={PencilEdit02Icon} className="size-4" />
            Revisar sugestao da IA
          </div>
          <p className="text-sm text-muted-foreground">
            {isSelectionProposal
              ? "Verifique o conteudo abaixo antes de substituir o trecho selecionado."
              : "Verifique o conteudo abaixo antes de inserir na nota."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            rounded="xl"
            onClick={handleDiscard}
          >
            <Icon icon={Cancel01Icon} />
            Descartar
          </Button>
          <Button size="sm" rounded="xl" onClick={handleApply}>
            <Icon icon={CheckmarkCircle02Icon} />
            Aplicar
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-4 text-sm leading-relaxed text-foreground [&_a]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_em]:italic [&_h1]:mt-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-1 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-1 [&_h3]:text-base [&_h3]:font-medium [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5">
        <MarkdownPreview text={pendingProposal.text} />
      </div>
    </section>
  );
}
