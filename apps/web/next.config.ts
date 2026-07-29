import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const monorepoRoot = path.join(__dirname, "../../");

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  // React Compiler via Babel no Turbopack 16.2 custa bastante RAM no dev.
  // Em produção continua ligado; no 16.3+ dá para usar turbopackRustReactCompiler.
  reactCompiler: process.env.NODE_ENV === "production",
  productionBrowserSourceMaps: false,
  output: "standalone",
  outputFileTracingRoot: monorepoRoot,
  // Evita o Turbopack inferir root errado e watchar pastas demais no monorepo.
  turbopack: {
    root: monorepoRoot,
  },
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
  experimental: {
    // Tree-shake imports pesados (ícones/libs) — menos módulos no grafo do Turbopack.
    optimizePackageImports: [
      "@hugeicons/core-free-icons",
      "lucide-react",
      "recharts",
      "date-fns",
      "react-icons",
    ],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
