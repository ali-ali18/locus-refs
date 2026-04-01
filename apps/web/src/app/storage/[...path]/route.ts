import { GetObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { s3Client } from "@/lib/storage";
import { requireSessionApiOrThrow } from "@/server/requireSession";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  let session: Awaited<ReturnType<typeof requireSessionApiOrThrow>>;
  try {
    session = await requireSessionApiOrThrow();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const prefix = path[0];

  if (prefix !== session.user.id) {
    const member = await prisma.member.findFirst({
      where: { organizationId: prefix, userId: session.user.id },
      select: { id: true },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const key = path.join("/");

  try {
    const object = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: key,
      }),
    );

    const body = object.Body;
    if (!body) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(body as ReadableStream, {
      headers: {
        "Content-Type": object.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
