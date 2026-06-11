import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { s3Client } from "@/lib/storage";
import { deleteObjects } from "@/server/upload";
import { getSession } from "@/server/getSession";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

const MIME_BY_MAGIC: Array<{ bytes: number[]; mime: string }> = [
  { bytes: [0xff, 0xd8, 0xff], mime: "image/jpeg" },
  { bytes: [0x89, 0x50, 0x4e, 0x47], mime: "image/png" },
  { bytes: [0x47, 0x49, 0x46], mime: "image/gif" },
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: "image/webp" },
];

function detectMimeType(buffer: Buffer): string | null {
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

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado" },
      { status: 400 },
    );
  }

  if (file.size > 5 * 1024 * 1024) {
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
  const key = `${session.user.id}/avatars/${randomUUID()}-${safeName}`;

  // Busca o avatar atual antes de subir o novo
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

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

  // Deleta o avatar antigo do bucket (fire-and-forget — não bloqueia a resposta)
  const oldImage = currentUser?.image;
  if (oldImage?.startsWith(`/storage/${session.user.id}/avatars/`)) {
    const oldKey = oldImage.replace(/^\/storage\//, "");
    deleteObjects([oldKey]).catch(() => {});
  }

  return NextResponse.json(
    { data: { publicUrl: `/storage/${key}` } },
    { status: 201 },
  );
}
