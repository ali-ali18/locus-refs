"use server";

import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/storage";

type UploadFolder = "avatars" | "notes";

interface UploadParams {
  name: string;
  contentType: string;
  workspaceId: string;
  folder: UploadFolder;
}

export async function getPresignedUploadUrl({
  name,
  contentType,
  workspaceId,
  folder,
}: UploadParams) {
  const key = `${workspaceId}/${folder}/${randomUUID()}-${name}`;

  const uploadUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 60 },
  );

  const publicUrl = `/storage/${key}`;

  return { uploadUrl, publicUrl };
}

export async function deleteObjects(keys: string[]) {
  if (keys.length === 0) return;
  await Promise.all(
    keys.map((Key) =>
      s3Client.send(
        new DeleteObjectCommand({ Bucket: process.env.STORAGE_BUCKET, Key }),
      ),
    ),
  );
}
