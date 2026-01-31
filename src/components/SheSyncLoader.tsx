"use client";
import { motion } from "framer-motion";

export default function SheSyncLoader() {
  return (
    <main className="font-inter text-gray-800 leading-relaxed">
      <motion.div
        className="fixed inset-0 min-h-screen min-w-screen flex items-center justify-center z-50 overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fce7f3 100%)",
              "linear-gradient(45deg, #fdf2f8 0%, #fce7f3 50%, #f3e8ff 100%)",
              "linear-gradient(225deg, #f3e8ff 0%, #fce7f3 50%, #fdf2f8 100%)",
              "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #fce7f3 100%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated background blur circles */}
        <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-25"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
              top: "-20%",
              left: "-10%",
            }}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 30, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              bottom: "-15%",
              right: "-5%",
            }}
            animate={{
              scale: [1.1, 0.95, 1.1],
              x: [0, -30, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute w-72 h-72 rounded-full blur-3xl opacity-15"
            style={{
              background: "linear-gradient(45deg, #ec4899 0%, #f472b6 100%)",
              top: "50%",
              left: "50%",
              marginLeft: "-144px",
              marginTop: "-144px",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>

        {/* Floating sparkle particles */}
        <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -40, -80],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-col items-center justify-center gap-8 relative z-10">
          {/* Flower Container */}
          <motion.div
            className="relative w-64 h-64"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{
                background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* SVG Flower */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="-120 -120 240 240"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="petal1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="petal2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="petal3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Outer petals - Large */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <motion.path
                    key={`outer-${angle}`}
                    d={`M 0,0 C -18,-50 -35,-90 0,-100 C 35,-90 18,-50 0,0 Z`}
                    fill={angle % 180 === 0 ? "url(#petal1)" : angle % 120 === 0 ? "url(#petal2)" : "url(#petal3)"}
                    opacity="0.85"
                    filter="url(#glow)"
                    style={{
                      transformOrigin: "0 0",
                      transform: `rotate(${angle}deg)`,
                    }}
                    animate={{
                      opacity: [0.6, 0.95, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      delay: angle / 100,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.g>

              {/* Middle petals - Medium */}
              <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              >
                {[0, 72, 144, 216, 288].map((angle) => (
                  <motion.path
                    key={`mid-${angle}`}
                    d={`M 0,0 C -16,-55 -35,-85 0,-95 C 35,-85 16,-55 0,0 Z`}
                    fill={angle % 144 === 0 ? "url(#petal2)" : "url(#petal3)"}
                    opacity="0.7"
                    filter="url(#glow)"
                    style={{
                      transformOrigin: "0 0",
                      transform: `rotate(${angle}deg)`,
                    }}
                    animate={{
                      opacity: [0.5, 0.85, 0.5],
                    }}
                    transition={{
                      duration: 3.5,
                      delay: angle / 120,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.g>

              {/* Center circle with shimmer */}
              <motion.circle
                cx="0"
                cy="0"
                r="18"
                fill="url(#petal1)"
                opacity="0.9"
                filter="url(#glow)"
                animate={{
                  r: [16, 22, 16],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Inner highlight */}
              <circle cx="0" cy="0" r="8" fill="white" opacity="0.5" />
            </svg>
          </motion.div>

          {/* Premium Text Section */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1
              className="text-7xl font-bold tracking-tight"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                SheSync
              </span>
            </motion.h1>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            >
              <p className="text-lg text-gray-700 font-light tracking-wide">
                Know Your Body, Own Your Cycle
              </p>
            </motion.div>

            {/* Menstrual Cycle Phases */}
            <motion.div className="flex justify-center gap-4 pt-4">
              {[
                { phase: "Menstruation", icon: "🌙", color: "from-red-400 to-pink-500" },
                { phase: "Follicular", icon: "🌒", color: "from-pink-400 to-purple-500" },
                { phase: "Ovulation", icon: "🌕", color: "from-purple-400 to-fuchsia-500" },
                { phase: "Luteal", icon: "🌘", color: "from-rose-400 to-pink-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center gap-1.5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 3,
                    delay: i * 0.75,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-lg shadow-lg`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.75,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                    {item.phase.split(" ")[0]}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
