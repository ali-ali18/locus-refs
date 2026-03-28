import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "http://192.168.0.106:3000",
    "http://localhost:3000",
    ...(process.env.CLOUDFLARE_URL ? [process.env.CLOUDFLARE_URL] : []),
  ],
};

export default nextConfig;
