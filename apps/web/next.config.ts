import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  allowedDevOrigins: [
    "http://localhost:3000",
    ...(process.env.CLOUDFLARE_URL ? [process.env.CLOUDFLARE_URL] : []),
  ],
  images: {
    domains: ["api.microlink.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-*",
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
