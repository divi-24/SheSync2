"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import herovid from "../../public/assets/hero-gif.gif";
import herovidmobile from "../../public/assets/hero-gif-mobile.gif";

export default function SheSyncLoader() {
  return (
    <main className="font-inter text-gray-800 leading-relaxed">
      <div className="fixed inset-0 min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 z-50">
        <motion.div className="w-screen h-screen flex items-center justify-center">
            <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.1,
              ease: [0.25, 0.25, 0, 1],
              filter: { duration: 1.8 }
            }}
            className="relative w-full h-full"
            >
            {/* Desktop Image */}
            <div className="hidden sm:block w-full h-full">
              <Image
              src={herovid}
              alt="SheSync - Women's Health Platform"
              priority
              height={500}
              width={500}
              className="object-contain w-full h-full"
              style={{ borderRadius: 0 }}
              />
            </div>
            {/* Mobile Image */}
            <div className="block sm:hidden w-full h-full">
              <Image
              src={herovidmobile}
              alt="SheSync - Women's Health Platform (Mobile)"
              priority
              height={500}
              width={500}
              className="object-contain max-w-screen h-full"
              style={{ borderRadius: 0 }}
              />
            </div>

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-purple-500/10 opacity-60" />

            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />
            </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
