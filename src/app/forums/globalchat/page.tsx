/* eslint-disable */

"use client";

import React from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Users,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import GlobalChat from "@/components/GlobalChat";
import { motion, AnimatePresence } from "framer-motion";



const GlobalChatPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-20 py-5 backdrop-blur-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors duration-200 group focus:outline-none"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium hidden xs:inline">Back</span>
              </button>
              <div className="hidden sm:block h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <MessageCircle className="h-6 w-6 text-black" />
                  <Sparkles className="h-3 w-3 text-pink-500 absolute -top-1 -right-1" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-black leading-tight">
                    Global Chat
                  </h1>
                  <p className="text-xs text-gray-600 hidden sm:block">
                    Connect, Share, Support
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users className="h-4 w-4" />
                <span>Safe Space</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Heart className="h-4 w-4" />
                <span>Mental Wellness</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chat Section */}
          <AnimatePresence>
            <motion.section
              key="chat"
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="w-full lg:w-2/3 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden flex flex-col min-h-[60vh] max-h-[80vh]"
            >
              <GlobalChat className="h-full p-2 sm:p-4" />
            </motion.section>
          </AnimatePresence>

          {/* Wellness Panel */}
          <AnimatePresence>
            <motion.aside
              key="wellness"
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="hidden lg:flex flex-col w-1/3 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden min-h-[60vh] max-h-[80vh]"
            >
              {/* Image Section */}
              <div className="relative h-1/2 min-h-[180px]">
                <img
                  src="/assets/globalchat.png"
                  alt="Global Chat Wellness"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              {/* Wellness Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    💝 Wellness Corner
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-pink-50/80 rounded-xl p-4 border border-pink-100">
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Daily Reminder
                      </p>
                      <p className="text-xs text-gray-600 italic">
                        "Your mental health is just as important as your physical health. Take time to nurture both."
                      </p>
                    </div>
                    <div className="bg-purple-50/80 rounded-xl p-4 border border-purple-100">
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Community Guidelines
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Be kind and supportive</li>
                        <li>• Respect privacy and boundaries</li>
                        <li>• Share positive energy</li>
                        <li>• Listen with empathy</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    🌸 Remember: You are valued and your voice matters
                  </p>
                </div>
              </div>
            </motion.aside>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default GlobalChatPage;
