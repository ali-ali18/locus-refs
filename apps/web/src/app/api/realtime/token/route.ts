import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/server/getSession";

export async function GET(request: NextRequest) {
  if (!process.env.REALTIME_JWT_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured", code: "MISSING_JWT_SECRET" },
      { status: 500 },
    );
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workspaceId = request.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json(
      { error: "Missing workspaceId", code: "MISSING_PARAMS" },
      { status: 400 },
    );
  }

  const member = await prisma.member.findFirst({
    where: { organizationId: workspaceId, userId: session.user.id },
    select: { id: true },
  });
  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = jwt.sign(
    {
      userId: session.user.id,
      workspaceId,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    },
    process.env.REALTIME_JWT_SECRET,
    { expiresIn: "1h" },
  );

  return NextResponse.json({ token });
}
