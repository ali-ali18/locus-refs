import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
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
      organizationLimit: 5,
      membershipLimit: 50,
    }),
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL as string,
    "http://localhost:3000",
    "http://192.168.0.106:3000",
    process.env.CLOUDFLARE_URL as string,
  ].filter(Boolean),
});
