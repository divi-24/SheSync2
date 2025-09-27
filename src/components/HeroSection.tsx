import { motion } from "framer-motion";
import Image from "next/image";
import heroimg from "../../public/assets/hero-gif.gif";
import { FlipWords } from "../components/ui/flip-words";
import { RainbowButton } from "./ui/rainbow-button";
import { Cookie } from "next/font/google";
const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};



export default function HeroSection({
  scrollToWaitlist,
}: {
  scrollToWaitlist: () => void;
}) {
  const words = ["Sync", "Health", "Wellness", "Journey", "Community", "Empowerment"];
  return (
    <section className="relative min-h-[85vh] flex items-center px-4 py-6 sm:px-6 justify-center mx-auto w-full">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary gradient orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-24 right-8 sm:right-16 md:right-32 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 bg-gradient-to-br from-pink-200/40 to-rose-200/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-16 left-4 sm:left-10 md:left-20 w-48 h-48 sm:w-72 sm:h-72 md:w-[28rem] md:h-[28rem] bg-gradient-to-tr from-rose-100/40 to-pink-200/30 rounded-full blur-3xl"
      />

      {/* Additional floating elements */}
      <motion.div
        animate="animate"
        className="absolute top-1/3 left-1/4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/20 rounded-full blur-2xl"
      />
      <motion.div
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute bottom-1/4 right-1/3 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-gradient-to-tr from-amber-200/25 to-rose-200/20 rounded-full blur-2xl"
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.08)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/5 to-white/20" />
      </div>

      <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 mx-auto flex flex-col-reverse lg:flex-row gap-10 md:gap-14 lg:gap-16 items-center w-full max-w-7xl"
      >
      {/* Left Content */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 gap-4">
        {/* Heading */}
        <div className="space-y-4">
        <motion.h1
          className={`${cookie.variable} font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-800 flex flex-col justify-center items-center lg:justify-start lg:items-start`}
        >
          <motion.span
          initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.1,
            ease: [0.25, 0.25, 0, 1],
            filter: { duration: 1.8 }
          }}
          className={`text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-500 via-rose-600 to-pink-500 bg-clip-text text-transparent leading-tight ${cookie.className}`}
          >
          Your <FlipWords words={words} />
          </motion.span>
          <p className="flex justify-center items-center gap-1 mt-4">
          <motion.span
            initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true }}
            transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.25, 0.25, 0, 1],
            filter: { duration: 1.8 }
            }}
            className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-medium text-gray-700"
          >
            Where wellness meets wisdom
          </motion.span>
          <motion.span
            animate="animate"
            className="ml-3 inline-block text-2xl sm:text-3xl md:text-4xl"
          >
            🌸
          </motion.span>
          </p>
        </motion.h1>
        </div>

        {/* Impactful Subtitle */}
        <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="text-base sm:text-lg mt-4 sm:mt-6 text-slate-600 font-light leading-relaxed max-w-2xl"
        >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="block mb-2 sm:mb-3 text-base sm:text-lg font-medium text-neutral-500"
        >
          Transform your relationship with your body through personalized insights and supportive community connections.
        </motion.span>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="font-semibold text-pink-600"
        >
          AI-powered insights.
        </motion.span>{" "}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.9 }}
          className="font-semibold text-rose-600"
        >
          Real connections.
        </motion.span>{" "}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          className="font-semibold text-pink-600"
        >
          Your journey.
        </motion.span>
        </motion.p>

        {/* Key Benefits */}
        <motion.div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
        {["Track cycles", "Get insights", "Connect safely", "Grow stronger"].map((benefit, index) => (
          <motion.span
          key={benefit}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2.0 + index * 0.1 }}
          className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
          >
          {benefit}
          </motion.span>
        ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
        <motion.span
          onClick={scrollToWaitlist}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.4 }}
          whileTap={{ scale: 0.98 }}
          className="group relative text-base sm:text-lg font-bold transition-all duration-300 flex justify-center items-center"
        >
          <RainbowButton size="lg" variant="custom">Join the Movement</RainbowButton>
        </motion.span>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-20 inline-flex items-center justify-center min-w-[150px] sm:min-w-[220px] px-6 py-2 rounded-full text-base sm:text-lg font-semibold border-2 border-pink-500 bg-white text-pink-700 hover:bg-pink-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 transition-all duration-300 shadow-sm cursor-pointer"
          aria-label="Discover More"
          tabIndex={0}
          type="button"
          onClick={() => window.location.assign('/dashboard')}
        >
          <span className="relative z-30">Discover More</span>
        </motion.button>
        </motion.div>
      </div>

      {/* Right Visual */}
      <motion.div className="flex justify-center items-center w-full lg:w-1/2 mb-8 lg:mb-0">
        <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.9 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          delay: 0.1,
          ease: [0.25, 0.25, 0, 1],
          filter: { duration: 1.8 }
        }}
        whileHover={{
          scale: 1.02,
          rotateY: -2,
          rotateX: 2,
        }}
        className="relative group perspective-1000"
        >
        <div className="relative transform-gpu transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-pink-500/25 drop-shadow-xl drop-shadow-pink-500/20" >
          <Image
          src={heroimg}
          alt="SheSync - Women's Health Platform"
          width={350}
          height={350}
          priority
          className="rounded-2xl object-contain w-60 h-60 sm:w-80 sm:h-80 md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] mx-auto"
          />

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-transparent to-purple-500/10 rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        </div>
        </motion.div>
      </motion.div>
      </motion.div>
    </section>
  );
}
