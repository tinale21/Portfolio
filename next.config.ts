import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages — no server, no API routes/middleware
  // in this app, so nothing here needs a Node runtime.
  output: "export",
  basePath: BASE_PATH,
  images: {
    // GitHub Pages has no image-optimization server; ship next/image's
    // source files as-is instead of trying to request /_next/image.
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
