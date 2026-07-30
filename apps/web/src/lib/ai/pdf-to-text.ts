import { extractText, getDocumentProxy } from "unpdf";

const MAX_PDF_CHARS = 40_000;

function normalizeExtractedText(text: string | string[] | null | undefined): string {
  if (text == null) return "";
  if (Array.isArray(text)) return text.join("\n\n");
  return text;
}

/**
 * Extrai texto de um PDF para injetar no contexto do agent.
 * Retorna string vazia se o PDF for scan/imagem sem texto embutido.
 */
export async function pdfBufferToText(buffer: Buffer): Promise<string> {
  if (!buffer.length) return "";

  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const cleaned = normalizeExtractedText(text)
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleaned) return "";
  if (cleaned.length <= MAX_PDF_CHARS) return cleaned;
  return `${cleaned.slice(0, MAX_PDF_CHARS)}\n\n[…texto truncado]`;
}
