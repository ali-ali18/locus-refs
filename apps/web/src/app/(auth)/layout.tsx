import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { getSafeRedirectPath } from "@/lib/safe-redirect";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const cookieStore = await cookies();
  const inviteRedirect = cookieStore.get("invite_redirect");
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    if (inviteRedirect?.value) {
      redirect(getSafeRedirectPath(decodeURIComponent(inviteRedirect.value)));
    }

    const orgs = await auth.api.listOrganizations({
      headers: await headers(),
    });

    if (!orgs || orgs.length === 0) {
      redirect("/onboarding/workspace/new");
    }

    const firstOrg = orgs[0].slug;

    if (firstOrg) redirect(`/${firstOrg}`);
  }

  return <>{children}</>;
}
