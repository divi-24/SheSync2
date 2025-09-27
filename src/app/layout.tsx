// import "./globals.css";
// import NavbarWrapper from "@/components/NavbarWrapper";
// import { AuthProvider } from "@/context/AuthContext";
// import Footer from "@/components/Footer";
// import type { Metadata, Viewport } from "next";
// import { Lexend_Deca } from "next/font/google";

// const lexendDeca = Lexend_Deca({
//   subsets: ['latin'],
//   weight: '400',
//   variable: '--font-lexend-deca'
// });

// // PWA + SEO metadata (without viewport)
// export const metadata: Metadata = {
//   title: "SheSync",
//   description: "SheSync is a comprehensive women's health and wellness platform built with modern web technologies. The platform aims to provide a supportive environment for women to access health resources, connect with healthcare professionals, and engage with a community of like-minded individuals.",
//   applicationName: "SheSync",
//   manifest: "/manifest.json",
//   icons: {
//     icon: "/icon/android-chrome-192x192.png",
//     shortcut: "/icon/android-chrome-192x192.png",
//     apple: "/icon/android-chrome-192x192.png", // for iOS
//   },
// };

// // Separate viewport export
// export const viewport: Viewport = {
//   width: 'device-width',
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false,
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body suppressHydrationWarning={true} className={`${lexendDeca.className} bg-gradient-to-br from-pink-50  via-fuchsia-50 to-fuchsia-100`}>
//         <AuthProvider>
//           <NavbarWrapper />
//           {children}
//           <Footer />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/Footer";
import type { Metadata, Viewport } from "next";
import { Lexend_Deca } from "next/font/google";
import ClientLoaderWrapper from "@/components/ClientLoaderWrapper";

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-lexend-deca'
});

export const metadata: Metadata = {
  title: "SheSync",
  description: "SheSync is a comprehensive women's health and wellness platform built with modern web technologies. The platform aims to provide a supportive environment for women to access health resources, connect with healthcare professionals, and engage with a community of like-minded individuals.",
  applicationName: "SheSync",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon/android-chrome-192x192.png",
    shortcut: "/icon/android-chrome-192x192.png",
    apple: "/icon/android-chrome-192x192.png",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${lexendDeca.className} bg-gradient-to-br from-pink-50  via-fuchsia-50 to-fuchsia-100`}>
        <AuthProvider>
          <ClientLoaderWrapper>
            <NavbarWrapper />
            {children}
            <Footer />
          </ClientLoaderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}