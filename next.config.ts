import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: [
    "gray-matter",
    "unified",
    "remark-parse",
    "remark-gfm",
    "remark-rehype",
    "rehype-raw",
    "rehype-slug",
    "rehype-stringify",
    "rehype-pretty-code",
    "shiki",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
      // Prevent client bundle from trying to resolve server-only modules
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "gray-matter",
        "unified",
        "remark-parse",
        "remark-gfm",
        "remark-rehype",
        "rehype-raw",
        "rehype-slug",
        "rehype-stringify",
        "rehype-pretty-code",
        "shiki",
      ];
    }
    return config;
  },
};

export default nextConfig;
