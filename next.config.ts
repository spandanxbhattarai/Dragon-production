import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com", 
      "media.istockphoto.com", 
      "plus.unsplash.com",
      "i.pinimg.com",
      "example.com",
      "gyfhwcucgzqzorqmyemk.supabase.co"
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: 'https://dragon-institute-backend.onrender.com/api',
  },
  eslint: {
    // 👇 This disables ESLint during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;