/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // Vercel 部署配置
  trailingSlash: true,
}

module.exports = nextConfig
