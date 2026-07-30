import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/storage";
import { deleteObjects } from "@/server/upload";

/** Anexos do chat expiram após 6 meses. */
export const CHAT_UPLOAD_TTL_MS = 1000 * 60 * 60 * 24 * 30 * 6;

const CHAT_FOLDER_SEGMENT = "/chat/";

/**
 * Lista e remove objetos sob a pasta chat (prefixo .../chat/...)
 * com LastModified mais antigo que o TTL.
 * Pensado para cron (ex.: diario) com CRON_SECRET.
 */
export async function cleanupExpiredChatUploads(options?: {
  olderThanMs?: number;
  dryRun?: boolean;
}): Promise<{ scanned: number; deleted: number; keys: string[] }> {
  const olderThanMs = options?.olderThanMs ?? CHAT_UPLOAD_TTL_MS;
  const cutoff = Date.now() - olderThanMs;
  const bucket = process.env.STORAGE_BUCKET;
  if (!bucket) {
    throw new Error("STORAGE_BUCKET não configurado");
  }

  const expiredKeys: string[] = [];
  let scanned = 0;
  let continuationToken: string | undefined;

  do {
    const page = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      }),
    );

    for (const obj of page.Contents ?? []) {
      if (!obj.Key || !obj.LastModified) continue;
      if (!obj.Key.includes(CHAT_FOLDER_SEGMENT)) continue;
      scanned += 1;
      if (obj.LastModified.getTime() < cutoff) {
        expiredKeys.push(obj.Key);
      }
    }

    continuationToken = page.IsTruncated
      ? page.NextContinuationToken
      : undefined;
  } while (continuationToken);

  if (!options?.dryRun && expiredKeys.length > 0) {
    // deleteObjects em lotes pequenos para não estourar rate limit
    const chunkSize = 100;
    for (let i = 0; i < expiredKeys.length; i += chunkSize) {
      await deleteObjects(expiredKeys.slice(i, i + chunkSize));
    }
  }

  return {
    scanned,
    deleted: options?.dryRun ? 0 : expiredKeys.length,
    keys: expiredKeys,
  };
}

/** Baixa um objeto do storage interno `/storage/{key}` como Buffer. */
export async function getStorageObjectBuffer(
  publicUrl: string,
): Promise<Buffer | null> {
  const key = publicUrl.replace(/^\/storage\//, "");
  if (!key || key.includes("..")) return null;

  const bucket = process.env.STORAGE_BUCKET;
  if (!bucket) return null;

  try {
    const result = await s3Client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    if (!result.Body) return null;
    const bytes = await result.Body.transformToByteArray();
    return Buffer.from(bytes);
  } catch {
    return null;
  }
}
