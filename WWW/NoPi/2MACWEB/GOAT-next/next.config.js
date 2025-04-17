/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/py",
        destination: "http://localhost:8000/",
      },
    ];
  },
};

module.exports = nextConfig;
