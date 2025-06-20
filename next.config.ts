import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/menu',
        destination: '/?panel=menu',
      },
      {
        source: '/heizung',
        destination: '/?panel=heizung',
      },
      {
        source: '/elektrik',
        destination: '/?panel=elektrik',
      },
      {
        source: '/klima',
        destination: '/?panel=klima',
      },
    ];
  },
};

export default nextConfig;
