"use client";

import { Header } from "../components/ui/NavbarComponent";
import LogoutBtn from '@/components/LogoutBtn';
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { motion } from "framer-motion";
const menuItems = [
  {
    text: "Home",
    to: "/",
    description: "Welcome page with latest updates and highlights"
  },
  {
    text: "Education",
    to: "/blogs",
    description: "Learn more about health, wellness, and self-care"
  },
  {
    text: "Shop",
    items: [
      {
        text: "Wellness Products",
        to: "/wellnessproducts",
        description: "Explore and purchase curated wellness products"
      },
      {
        text: "Period Products",
        to: "/periodproducts",
        description: "Browse and order menstrual care essentials"
      },
    ],
  },
  {
    text: "Health Tools",
    items: [
      {
        text: "Track Your Health",
        to: "/tracker",
        description: "Monitor your daily health stats and progress"
      },
      {
        text: "Ovulation Calculator",
        to: "/ovulationcalc",
        description: "Predict your ovulation and fertile days"
      },
      {
        text: "PCOS Diagnosis",
        to: "/pcos",
        description: "Get AI-assisted PCOS screening insights"
      },
      {
        text: "Expert Consultation",
        to: "/consultation",
        description: "Book sessions with certified health experts"
      },
      {
        text: "HealthLens",
        to: "/symptomsanalyzer",
        description: "Get detailed AI-powered health assessments"
      },
      {
        text: "Diet-plan",
        to: "/diet-plan",
        description: "Personalized meal and nutrition plans"
      },
    ],
  },
  {
    text: "AI Agents",
    items: [
      {
        text: "Eve",
        to: "/chatbot",
        description: "Your personal AI assistant for women’s health"
      },
      {
        text: "Voice Agent",
        to: "/voice-agent",
        description: "Voice-based AI interaction for quick support"
      },
    ],
  },
  {
    text: "Community",
    items: [
      {
        text: "Parent's Dashboard",
        to: "/parent",
        description: "Manage and monitor your child’s health records"
      },
      {
        text: "Partner's Dashboard",
        to: "/partner",
        description: "Manage and monitor your partner’s health records"
      },
      {
        text: "Forums",
        to: "/forums",
        description: "Join discussions with like-minded individuals"
      },
    ],
  },
  {
    text: "Lifestyle",
    items: [
      {
        text: "Bliss",
        to: "/bliss",
        description: "Mindfulness and relaxation resources"
      },
      // {
      //   text: "Contributors",
      //   to: "/contributors",
      //   description: "Meet the people behind the platform"
      // },
    ],
  },
];

import { useState, useEffect } from "react";

export default function NavbarWrapper() {
  const [authKey, setAuthKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const authenticated = useAuthStatus();

  const handleLogout = () => {
    setAuthKey((k) => k + 1);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by showing consistent placeholder during SSR
  if (!mounted) {
    return (
      <Header
        menuItems={menuItems}
        rightContent={
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-full"></div>
        }
        key={authKey}
      />
    );
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: .2, duration: 0.6 }}
    >
      <Header
      menuItems={menuItems}
      rightContent={
        authenticated === null ? (
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-full"></div>
        ) : authenticated ? (
          <LogoutBtn onLogout={handleLogout} />
        ) : (
            <div className="flex  md:flex-row gap-1 md:gap-3 items-stretch xs:items-center w-full xs:w-auto">
            <a
              href="/login"
              className="md:w-24 w-16 h-fit xs:w-auto bg-pink-500 hover:bg-pink-600 text-white px-2 py-2 md:px-4 sm:py-3 rounded-full font-medium text-sm sm:text-base shadow transition-colors duration-200 text-center"
            >
              Login
            </a>
            <a
              href="/signup"
              className="md:w-24 w-24 h-fit bg-rose-500 hover:bg-rose-600 text-white px-0 py-2 md:px-4 sm:py-3 rounded-full font-medium text-sm sm:text-base shadow transition-colors duration-200 text-center"
            >
              Sign Up
            </a>
            </div>
        )
      }
      key={authKey}
      />
      </motion.div>
  );
}
