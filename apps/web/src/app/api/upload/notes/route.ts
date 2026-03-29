import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { s3Client } from "@/lib/storage";
import { requireWorkspaceAccess } from "@/server/requireSession";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

const MIME_BY_MAGIC: Array<{ bytes: number[]; mime: string }> = [
  { bytes: [0xff, 0xd8, 0xff], mime: "image/jpeg" },
  { bytes: [0x89, 0x50, 0x4e, 0x47], mime: "image/png" },
  { bytes: [0x47, 0x49, 0x46], mime: "image/gif" },
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: "image/webp" }, // RIFF + checked below
];

function detectMimeType(buffer: Buffer): string | null {
  for (const { bytes, mime } of MIME_BY_MAGIC) {
    if (bytes.every((b, i) => buffer[i] === b)) {
      if (mime === "image/webp") {
        // Also validate WEBP signature at bytes 8–11
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

export async function POST(request: NextRequest) {
  const auth = await requireWorkspaceAccess(request);
  if ("error" in auth) return auth.error;
  const { workspaceId } = auth;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado" },
      { status: 400 },
    );
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Arquivo muito grande. O limite é de 5MB." },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: "Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectMimeType(buffer);
  if (!detectedMime) {
    return NextResponse.json(
      { error: "O arquivo não é uma imagem válida." },
      { status: 400 },
    );
  }

  const safeName = file.name.replace(/\s+/g, "-").replace(/[^\w.-]/g, "");
  const key = `${workspaceId}/notes/${randomUUID()}-${safeName}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: detectedMime,
      }),
    );
  } catch {
    return NextResponse.json(
      { error: "Erro ao fazer upload. Tente novamente." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Imagem enviada com sucesso",
      data: { publicUrl: `/storage/${key}` },
    },
    { status: 201 },
  );
}
