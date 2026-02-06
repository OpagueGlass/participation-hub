import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://mvbypxdgotiqghrbzdra.supabase.co/storage/v1/object/public/**')],
  }
};

export default nextConfig;
