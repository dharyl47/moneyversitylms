/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)", // Match all routes (adjust this as needed)
        headers: [
          {
            key: "Cache-Control",
            value: "no-store", // Disable caching
          },
        ],
      },
    ];
  },
};

export default nextConfig;
