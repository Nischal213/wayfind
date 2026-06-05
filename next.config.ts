import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png")]
  }
};

export default nextConfig;
