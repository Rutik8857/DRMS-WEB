// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This allows your specific IP to access the dev server without warnings
    allowedDevOrigins: [
      'localhost:3000', 
      '10.166.192.72:3000'
    ],
  },
};

export default nextConfig;