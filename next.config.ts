import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // for the Docker image: .next/standalone/server.js with only the traced files
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
