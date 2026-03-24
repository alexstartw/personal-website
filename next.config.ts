import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "personal-website";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : "",
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
