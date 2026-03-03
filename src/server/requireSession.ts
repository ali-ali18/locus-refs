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
