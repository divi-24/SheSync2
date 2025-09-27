/* eslint-disable */

"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import herovid from "../../public/assets/hero-gif.gif";
import Image from "next/image";
import {
  Bell,
  ShieldCheck,
  Sparkles,
  Lock,
  Heart
} from "lucide-react";

import HeroSection from "../components/HeroSection";
import CoreFeaturesSection from "../components/CoreFeaturesSection";
import CommunitySupportSection from "../components/CommunitySupportSection";
import EcommerceServicesSection from "../components/EcommerceServicesSection";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ui/Toast";
import {Cookie} from "next/font/google"
import { RainbowButton } from "@/components/ui/rainbow-button";
const  cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
})
export default function SheSyncLanding() {
  const [mounted, setMounted] = useState(false);
  const waitlistRef = useRef<HTMLDivElement>(null);
  const { toasts, success, error, removeToast } = useToast();


  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering the same content on server and client initially
  if (!mounted) {
    return (
      <main className="font-inter text-gray-800 leading-relaxed">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading SheSync...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Only show loading screen once per session */}
      <main className="font-inter text-gray-800 leading-relaxed bg-gradient-to-br from-pink-50  via-fuchsia-50 to-fuchsia-100">
        <HeroSection scrollToWaitlist={scrollToWaitlist} />
        <CoreFeaturesSection />
        <CommunitySupportSection />
        <EcommerceServicesSection />

        {/* Waitlist Section */}
        <section
        ref={waitlistRef}
        className="py-24 px-4 relative overflow-hidden mx-auto flex justify-center items-center"
        >
        {/* Background decorative elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          whileInView={{ opacity: 0.05, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
          >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: "blur(8px)" }}
            whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-6"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            Early Access Available
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className={`text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-pink-700/70 to-pink-500 bg-clip-text text-transparent mb-6 leading-tight ${cookie.className}`}
          >
            Join the Revolution
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Be among the first to experience the future of women's health and wellness
          </motion.p>
          </motion.div>

          <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(15px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
          >
          <motion.div 
            initial={{ backdropFilter: "blur(0px)" }}
            whileInView={{ backdropFilter: "blur(20px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 relative"
          >
            {/* Subtle gradient border effect */}
            <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(30px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(40px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl -z-10"
            ></motion.div>
            
            <motion.form
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement).value;
              if (email) {
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/waitlist/join`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email,
                  source: 'landing_page'
                }),
                });

                const data = await response.json();

                if (data.success) {
                success(data.message || "Welcome aboard! We'll notify you when we launch.");
                if (form) {
                  form.reset();
                }
                } else {
                error(data.message || 'Something went wrong. Please try again.');
                }
              } catch (err) {
                console.error('Waitlist join error:', err);
                error('Network error. Please check your connection and try again.');
              }
              }
            }}
            className="space-y-6"
            >
            <motion.div 
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="w-full py-4 px-6 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-transparent transition-all duration-300 text-lg"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Heart className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <RainbowButton
              size="lg"
              variant="custom"
              type="submit"
              className="w-full border-2 border-pink-500"
              >
              Join the Waitlist
              </RainbowButton>
            </motion.div>
            </motion.form>

            {/* Features list */}
            <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100"
            >
            {[
              { icon: ShieldCheck, text: "Privacy First", color: "text-green-600" },
              { icon: Bell, text: "Early Access", color: "text-blue-600" },
              { icon: Lock, text: "No Spam Ever", color: "text-purple-600" }
            ].map((item, index) => (
              <motion.div
              key={index}
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: "easeOut" }}
              className="flex items-center gap-3 text-sm text-gray-600"
              >
              <div className={`p-2 rounded-lg bg-gray-50 ${item.color}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="font-medium">{item.text}</span>
              </motion.div>
            ))}
            </motion.div>
          </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-center mt-12"
          >
          <p className="text-sm text-gray-500 mb-4">Trusted by women worldwide</p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
              whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: "easeOut" }}
            >
              <Heart className="w-4 h-4 text-pink-400 fill-current" />
            </motion.div>
            ))}
            <motion.span 
            initial={{ opacity: 0, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm text-gray-600 ml-2"
            >
            Join 1000+ women
            </motion.span>
          </div>
          </motion.div>
        </div>
        </section>

        {/* Floating Action Button */}
        <motion.button
        onClick={scrollToWaitlist}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-400 to-pink-500 text-white w-14 h-14 rounded-full cursor-pointer shadow-2xl flex items-center justify-center text-xl z-[9999] border-2 border-white/20 backdrop-blur-sm hover:shadow-pink-300/50 transition-all duration-300"
        >
        <span className="animate-pulse">🌸</span>
        </motion.button>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </main>
  
    </>
  );
}