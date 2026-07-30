import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/lib/storage";
import { deleteObjects } from "@/server/upload";
import { requireWorkspaceAccess } from "@/server/requireSession";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const PDF_EXTENSIONS = new Set(["pdf"]);
const TEXT_EXTENSIONS = new Set(["txt"]);

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const PDF_MAX_BYTES = 10 * 1024 * 1024;
const TEXT_MAX_BYTES = 1 * 1024 * 1024;

const MIME_BY_MAGIC: Array<{ bytes: number[]; mime: string }> = [
  { bytes: [0xff, 0xd8, 0xff], mime: "image/jpeg" },
  { bytes: [0x89, 0x50, 0x4e, 0x47], mime: "image/png" },
  { bytes: [0x47, 0x49, 0x46], mime: "image/gif" },
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: "image/webp" },
  { bytes: [0x25, 0x50, 0x44, 0x46], mime: "application/pdf" }, // %PDF
];

function detectImageOrPdfMime(buffer: Buffer): string | null {
  for (const { bytes, mime } of MIME_BY_MAGIC) {
    if (bytes.every((b, i) => buffer[i] === b)) {
      if (mime === "image/webp") {
        if (
          buffer[8] !== 0x57 ||
          buffer[9] !== 0x45 ||
          buffer[10] !== 0x42 ||
          buffer[11] !== 0x50
        ) {
          continue;
        }
      }
      return mime;
    }
  }
  return null;
}

/** TXT não tem magic bytes confiáveis — valida UTF-8 sem NUL. */
function isValidPlainText(buffer: Buffer): boolean {
  if (buffer.includes(0x00)) return false;
  try {
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    return decoded.length > 0 || buffer.length === 0;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado", code: "MISSING_FILE" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isPdf = PDF_EXTENSIONS.has(ext);
  const isImage = IMAGE_EXTENSIONS.has(ext);
  const isText = TEXT_EXTENSIONS.has(ext);

  if (!isPdf && !isImage && !isText) {
    return NextResponse.json(
      {
        error: "Tipo não permitido. Use PDF, TXT, JPG, PNG, WebP ou GIF.",
        code: "INVALID_TYPE",
      },
      { status: 400 },
    );
  }

  const maxBytes = isPdf
    ? PDF_MAX_BYTES
    : isText
      ? TEXT_MAX_BYTES
      : IMAGE_MAX_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isPdf
          ? "PDF muito grande. O limite é de 10MB."
          : isText
            ? "TXT muito grande. O limite é de 1MB."
            : "Imagem muito grande. O limite é de 5MB.",
        code: "FILE_TOO_LARGE",
      },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let contentType: string;

  if (isText) {
    if (!isValidPlainText(buffer)) {
      return NextResponse.json(
        {
          error: "O arquivo não é um texto UTF-8 válido.",
          code: "INVALID_TEXT",
        },
        { status: 400 },
      );
    }
    contentType = "text/plain; charset=utf-8";
  } else {
    const detectedMime = detectImageOrPdfMime(buffer);
    if (!detectedMime) {
      return NextResponse.json(
        { error: "Arquivo inválido ou corrompido.", code: "INVALID_FILE" },
        { status: 400 },
      );
    }
    if (isPdf && detectedMime !== "application/pdf") {
      return NextResponse.json(
        { error: "O arquivo não é um PDF válido.", code: "INVALID_PDF" },
        { status: 400 },
      );
    }
    if (isImage && !detectedMime.startsWith("image/")) {
      return NextResponse.json(
        { error: "O arquivo não é uma imagem válida.", code: "INVALID_IMAGE" },
        { status: 400 },
      );
    }
    contentType = detectedMime;
  }

  const safeName = file.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
  const key = `${workspaceId}/chat/${randomUUID()}-${safeName}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
  } catch {
    return NextResponse.json(
      { error: "Erro ao fazer upload. Tente novamente.", code: "UPLOAD_FAILED" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Arquivo enviado com sucesso",
      data: {
        publicUrl: `/storage/${key}`,
        contentType,
        filename: safeName || file.name,
      },
    },
    { status: 201 },
  );
}

/** Remove anexos do chat que nao foram enviados / falharam no envio. */
export async function DELETE(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  const body = (await request.json().catch(() => ({}))) as {
    urls?: unknown;
  };

  const urls = Array.isArray(body.urls)
    ? body.urls.filter((u): u is string => typeof u === "string")
    : [];

  if (urls.length === 0) {
    return NextResponse.json(
      { error: "urls e obrigatorio", code: "MISSING_URLS" },
      { status: 400 },
    );
  }

  const prefix = `${workspaceId}/chat/`;
  const keys: string[] = [];

  for (const url of urls) {
    if (!url.startsWith("/storage/")) continue;
    const key = url.slice("/storage/".length);
    if (!key.startsWith(prefix)) continue;
    if (key.includes("..")) continue;
    keys.push(key);
  }

  if (keys.length === 0) {
    return NextResponse.json(
      { error: "Nenhuma url valida para este workspace", code: "INVALID_URLS" },
      { status: 400 },
    );
  }

  await deleteObjects(keys);

  return NextResponse.json({
    message: "Anexos removidos",
    data: { deleted: keys.length },
  });
}
