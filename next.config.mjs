/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_STATIC_EXPORT === '1' ? 'export' : undefined,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  }
}

export default nextConfig
