import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const serverBase = process.env.SERVER_BASE_URL;
    const simulatorBase = process.env.SIMULATOR_BASE_URL;

    const rules = [] as { source: string; destination: string }[];

    if (serverBase) {
      rules.push(
        { source: "/api/:path*", destination: `${serverBase}/:path*` },
        { source: "/ws", destination: `${serverBase}/ws` }
      );
    }

    if (simulatorBase) {
      rules.push({ source: "/telemetry", destination: `${simulatorBase}/telemetry` });
    }

    return rules;
  },
};

export default nextConfig;
