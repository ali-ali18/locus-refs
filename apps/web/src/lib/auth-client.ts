import {
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { workspaceAc, workspaceRoles } from "./workspace-ac";

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    organizationClient({
      ac: workspaceAc,
      roles: workspaceRoles,
      dynamicAccessControl: {
        enabled: true,
      },
    }),
  ],
});

export const { signIn, signUp, useSession } = authClient;
