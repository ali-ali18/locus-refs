import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { getSession } from "@/server/getSession";

interface Props {
  children: ReactNode;
}

export default async function RedirectedLayout({ children }: Props) {
  const cookieStore = await cookies();
  const inviteRedirect = cookieStore.get("invite_redirect");
  const requestHeaders = await headers();
  const [session, orgs] = await Promise.all([
    getSession(),
    auth.api.listOrganizations({ headers: requestHeaders }).catch(() => []),
  ]);

  if (session) {
    if (inviteRedirect?.value) {
      redirect(getSafeRedirectPath(decodeURIComponent(inviteRedirect.value)));
    }

    if (!orgs || orgs.length === 0) {
      redirect("/workspace/new");
    }

    const activeOrgId = session.session.activeOrganizationId;
    const activeOrg = activeOrgId
      ? orgs.find((org) => org.id === activeOrgId)
      : undefined;
    const firstOrg = activeOrg?.slug ?? orgs[0].slug;

    if (firstOrg) redirect(`/${firstOrg}`);
  }

  return <>{children}</>;
}
