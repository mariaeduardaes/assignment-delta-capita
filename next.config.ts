import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: false,
  },
  experimental: {
    serverActionsBodySizeLimit: "10mb", // ou mais, dependendo do tamanho dos PDFs
  },
};

export default nextConfig;
