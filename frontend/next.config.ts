import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the dev server via LAN IP (phone/other PC).
  // Without this, Next.js 16 blocks /_next assets from non-localhost hosts.
  allowedDevOrigins: ["192.168.99.117", "127.0.0.1"],
};

export default nextConfig;
