import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { sendEmail } from "./email/email";
import { InvitationEmail } from "./email/templates/InvitationEmail";
import prisma from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  //   socialProviders: {
  //     github: {
  //       clientId: process.env.GITHUB_CLIENT_ID as string,
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //     },
  //     google: {
  //       clientId: process.env.GOOGLE_CLIENT_ID as string,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //     },
  //   },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 10,
      membershipLimit: 50,
      sendInvitationEmail: async (data) => {
        const acceptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.id}`;
        await sendEmail({
          to: data.email,
          subject: `${data.inviter.user.name} convidou você para "${data.organization.name}"`,
          react: InvitationEmail({
            inviterName: data.inviter.user.name,
            inviterImage: data.inviter.user.image ?? null,
            organizationName: data.organization.name,
            organizationLogo: data.organization.logo ?? null,
            role: data.role,
            acceptUrl,
          }),
        });
      },
    }),
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL as string,
    "http://localhost:3000",
    "http://192.168.0.106:3000",
    process.env.CLOUDFLARE_URL as string,
  ].filter(Boolean),
});
