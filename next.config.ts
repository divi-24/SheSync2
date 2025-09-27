// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async headers() {
//     return [
//       {
//         source: "/(.*)", // applies to all routes
//         headers: [
//           {
//             key: "X-Frame-Options",
//             value: "SAMEORIGIN",
//           },
//           {
//             key: "X-Content-Type-Options",
//             value: "nosniff",
//           },
//           {
//             key: "Referrer-Policy",
//             value: "strict-origin-when-cross-origin",
//           },
//           {
//             key: "Permissions-Policy",
//             // 🎤 important for your Voice AI agent
//             value: "camera=(), microphone=*, geolocation=(), payment=(), usb=()",
//           },
//           {
//             key: "X-XSS-Protection",
//             value: "1; mode=block",
//           },
//           {
//             key: "Strict-Transport-Security",
//             value: "max-age=31536000; includeSubDomains",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable headers in App Router (applies globally)
  async headers() {
    return [
      {
        source: "/:path*", // App Router syntax for all routes
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            // 🎤 important for your Voice AI agent
            value: "camera=(), microphone=*, geolocation=(), payment=(), usb=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  poweredByHeader: false, // security: removes x-powered-by header
};

export default nextConfig;
