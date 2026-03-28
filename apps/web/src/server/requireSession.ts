import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./getSession";

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return session;
}

export async function requireSessionApiOrThrow() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
