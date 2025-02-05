import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination:
          "https://docs.google.com/presentation/d/1GaoEtU69S7YOjw9sFDs3oIEL8wkDOZ6rIE2wrnjDcz0/edit",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
