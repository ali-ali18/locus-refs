import type { FileUIPart } from "ai";

export const CHAT_ACCEPT =
  "application/pdf,text/plain,image/jpeg,image/png,image/webp,image/gif,.pdf,.txt,.jpg,.jpeg,.png,.webp,.gif";

export async function dataUrlToFile(
  part: FileUIPart,
  index: number,
): Promise<File> {
  const res = await fetch(part.url);
  const blob = await res.blob();
  const name = part.filename || `attachment-${index}`;
  return new File([blob], name, {
    type: part.mediaType || blob.type || "application/octet-stream",
  });
}
