"use client"
import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cookie } from "next/font/google";
import Image from "next/image";
const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

const games = [
  {
    title: "Quiz",
    image: "/bliss/images/quiz.jpg",
    description:
      "It's a mental state assessment quiz. Based on your answers, a playlist is created to improve your mental state.",
    link: "/bliss/quiz",
  },
  {
    title: "Sudoku",
    image: "/bliss/images/sudoku.jpg",
    description:
      "Fill a 9x9 grid with digits so that every row, column, and 3x3 box contains all digits from 1 to 9.",
    link: "/bliss/sudoku",
  },
  {
    title: "Memory Game",
    image: "/bliss/images/memorygame.jpg",
    description:
      "Flip cards to find identical pairs. Train your memory and have fun.",
    link: "/bliss/memory-game",
  },
  {
    title: "Jokes And Quotes",
    image: "/bliss/images/laugh.jpg",
    description:
      "Uplift your mood with jokes and quotes. Share with your friends and enjoy.",
    link: "/bliss/joke-quote",
  },
  {
    title: "Mood Map",
    image: "/bliss/images/moodmap.jpg",
    description:
      "Track your mood via a video feed and share your emotional insights with friends.",
    link: "/bliss/mood-map",
  },
  {
    title: "Simon Game",
    image: "/bliss/images/simon_game.png",
    description:
      "Repeat the pattern shown by the game. Test your memory and reflexes!",
    link: "/bliss/simon",
  },
  {
    title: "Hangman Game",
    image: "/bliss/images/Hangman.png",
    description:
      "A health-themed Hangman game where you guess words related to pregnancy and the menstrual cycle, one letter at a time!",
    link: "/bliss/hangman",
  },
];


export default function Bliss() {
  return (
    <div className="flex min-h-screen justify-center items-center mx-auto bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <div className="flex-1 overflow-y-auto transition-all duration-300">
        <div className="p-6 max-w-7xl mx-auto flex justify-center items-center flex-col ">
            <motion.h1
            initial={{ opacity: 0, y: -30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`${cookie.className} text-4xl md:text-6xl p-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600`}
            >
            Blissful Games Hub
            </motion.h1>
            <motion.h2
            initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl font-semibold text-pink-500 mb-2 text-center"
            >
            Play, Relax, and Elevate Your Mood
            </motion.h2>
            <motion.p
            initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            className="text-sm text-gray-700 dark:text-gray-300 mb-8 text-center max-w-2xl mx-auto"
            >
            Discover a curated collection of games and activities designed to boost your mental well-being, sharpen your mind, and bring a smile to your day. Choose your favorite and start your journey to a happier you!
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {/* Decorative background elements */}
                <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.25, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="pointer-events-none absolute -z-10 top-10 left-10 w-72 h-72 bg-pink-200 rounded-full blur-3xl"
                />
                <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.18, scale: 1 }}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                className="pointer-events-none absolute -z-10 bottom-20 right-20 w-80 h-80 bg-purple-200 rounded-full blur-3xl"
                />
                <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 0.12, scale: 1 }}
                transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
                className="pointer-events-none absolute -z-10 top-1/2 left-1/2 w-96 h-96 bg-pink-100 rounded-full blur-2xl"
                />
                {games.map((game, index) => (
                <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{  boxShadow: "0 8px 32px rgba(236, 72, 153, 0.18)" }}
                transition={{
                delay: index * 0.07,
                duration: 0.5,
                ease: "easeOut",
                }}
                className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 flex flex-col hover:shadow-xl transition-all overflow-hidden group"
                >
                <div className="relative">
                <Image
                   width={400}
                   height={400}
                   src={game.image}
                   alt={game.title}
                   className="h-40 w-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                 />
         
                </div>
                <div className="flex flex-col flex-1 p-5">
                <h2 className="text-lg font-bold text-gray-800 dark:text-pink-300 mb-1 flex items-center gap-2">
                  <span>{game.title}</span>
                  <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className="inline-block"
                  >
                  🎮
                  </motion.span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-1">
                  {game.description}
                </p>
                <Link
                  href={game.link}
                  className="relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:from-pink-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                >
                  <span className="relative z-10">
                  {["Mood Map", "Simon Game"].includes(game.title) ? "Visit" : "Play"}
                  </span>
                  <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative z-10"
                  >
                  <ChevronRight size={18} />
                  </motion.span>
                  <span className="absolute inset-0 rounded-lg bg-pink-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                </Link>
                </div>
                <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 rounded-full px-3 py-1 text-xs font-semibold text-pink-600 dark:text-pink-300 shadow group-hover:scale-105 transition-transform"
                >
                New
                </motion.div>
                </motion.div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
