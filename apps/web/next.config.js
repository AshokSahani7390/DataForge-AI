/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@dataforge/shared", "@dataforge/database", "undici", "firebase", "@firebase/storage"],
};

module.exports = nextConfig;
