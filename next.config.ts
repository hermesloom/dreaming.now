import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination:
          "https://docs.google.com/presentation/d/1YsJKmBFVZL3nt3xpBfx1A6Ml2X-Phnve-H_t8KTnsi8/edit",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
