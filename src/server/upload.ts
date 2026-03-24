"use server";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/storage";

type UploadFolder = "avatars" | "notes";

interface UploadParams {
  name: string;
  contentType: string;
  userId: string;
  folder: UploadFolder;
}

export async function getPresignedUploadUrl({
  name,
  contentType,
  userId,
  folder,
}: UploadParams) {
  const key = `${userId}/${folder}/${randomUUID()}-${name}`;

  const uploadUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 60 },
  );

  const publicUrl = `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${key}`;

  return { uploadUrl, publicUrl };
}
