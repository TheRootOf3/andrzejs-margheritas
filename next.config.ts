import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

// Ensure required environment variables are present
const requiredEnvVars = [
  'GITHUB_ID',
  'GITHUB_SECRET',
  'ALLOWED_GITHUB_USER',
  'GITHUB_TOKEN',
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default nextConfig;
