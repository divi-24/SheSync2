import { motion, useInView } from "framer-motion";
import { MessageCircle, BookOpen, Video } from "lucide-react";
import { Cookie } from "next/font/google";
import { useRef } from "react";
const cookie = Cookie({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-cookie'
})
const colors = {
    primary: "#ec4899",
    accent: "#f59e0b",
    purple: "#e1bee7"
};

const communityFeatures = [
    {
        icon: <MessageCircle size={28} color={colors.accent} />,
        title: "Community Forum",
        description: "Connect with women worldwide in a safe, supportive environment"
    },
    {
        icon: <BookOpen size={28} color={colors.primary} />,
        title: "Health Resources",
        description: "Access expert articles, guides, and educational content"
    },
    {
        icon: <Video size={28} color={colors.purple.replace('#e1bee7', '#9c27b0')} />,
        title: "Expert Consultations",
        description: "Book sessions with certified health professionals"
    }
];

export default function CommunitySupportSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Container variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
                duration: 0.8
            }
        }
    };

    // Card variants with advanced blur effects
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 60,
            scale: 0.8,
            filter: "blur(20px)",
            rotateX: 15
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotateX: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
                duration: 1.2
            }
        },
        hover: {
            y: -8,
            scale: 1.02,
            filter: "blur(0px)",
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 10
            }
        }
    };

    // Title variants with complex blur animation
    const titleVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            filter: "blur(30px)",
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 80,
                damping: 20,
                duration: 1.5
            }
        }
    };

    // Floating background elements
    const floatingVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 0.3,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <section ref={ref} className="py-20 px-4 relative overflow-hidden flex justify-center items-center mx-auto">
            {/* Animated background elements */}
            <motion.div
                variants={floatingVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl -z-10"
            />
            <motion.div
                variants={floatingVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: 0.3 }}
                className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl -z-10"
            />
            <motion.div
                variants={floatingVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ delay: .3 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-pink-200/10 to-purple-200/10 rounded-full blur-3xl -z-10"
            />

            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={titleVariants}
                        className={`text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-pink-700/70 to-pink-500 bg-clip-text text-transparent mb-6 leading-tight ${cookie.className}`}
                    >
                        Community & Support
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={isInView ? {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)"
                        } : {}}
                        transition={{
                            delay: 0.8,
                            duration: 1,
                            ease: "easeOut"
                        }}
                        className="text-lg text-purple-700 max-w-xl mx-auto"
                    >
                        Connect, learn, and grow with a supportive community of women on similar journeys
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
                >
                    {communityFeatures.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={cardVariants}
                            whileHover="hover"
                            className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 relative group cursor-pointer"
                            style={{ perspective: "1000px" }}
                        >
                            {/* Enhanced gradient border effect */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(30px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(40px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl -z-10"
          ></motion.div>
                            {/* Glowing backdrop effect */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={isInView ? {
                                    opacity: 0.1,
                                    scale: 1
                                } : {}}
                                transition={{
                                    delay: 0.5 + (index * 0.15),
                                    duration: 2,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-transparent to-purple-400/20 rounded-3xl -z-5 blur-2xl"
                            />

                            <motion.div
                                initial={{ opacity: 0, x: -30, filter: "blur(15px)" }}
                                animate={isInView ? {
                                    opacity: 1,
                                    x: 0,
                                    filter: "blur(0px)"
                                } : {}}
                                transition={{
                                    delay: 0.5 + (index * 0.1),
                                    duration: 0.8,
                                    ease: "easeOut"
                                }}
                                className="flex items-center mb-6 "
                            >
                                <motion.div
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: 5,
                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                    className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shadow-md"
                                >
                                    {feature.icon}
                                </motion.div>
                                <motion.h3
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                    className="text-xl font-semibold text-pink-500"
                                >
                                    {feature.title}
                                </motion.h3>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={isInView ? {
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)"
                                } : {}}
                                transition={{
                                    delay: 0.2 + (index * 0.1),
                                    duration: 0.8,
                                    ease: "easeOut"
                                }}
                                className="text-gray-600 text-base leading-relaxed"
                            >
                                {feature.description}
                            </motion.p>

                            {/* Subtle shimmer effect on hover */}
                            <motion.div
                                initial={{ opacity: 0, x: "-100%" }}
                                whileHover={{
                                    opacity: [0, 0.5, 0],
                                    x: "100%",
                                    transition: { duration: 0.8, ease: "easeInOut" }
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
