import type { NextConfig } from "next";
import nextWithIntl from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Enable static page optimization
  reactStrictMode: true,

  // Configure image domains for external images
  images: {
    domains: ["divizend.com"],
  },
};

const withNextIntl = nextWithIntl("./i18n.ts");

export default withNextIntl(nextConfig);
