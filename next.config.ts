import type { NextConfig } from "next";

const repo = process.env.GITHUB_REPOSITORY?.split("/playwright-playground")[1];
const basePath = process.env.BASE_PATH ?? (repo ? `/${repo}` : "");

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  trailingSlash: false,

};

export default nextConfig;

