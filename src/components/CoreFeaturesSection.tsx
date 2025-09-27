import { motion } from "framer-motion";
import { Brain, CalendarCheck, Activity, AlertCircle } from "lucide-react";
import {Cookie} from "next/font/google"
const  cookie = Cookie({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-cookie'
})
const colors = {
        primary: "#ec4899",
        accent: "#f59e0b",
        purple: "#e1bee7"
};

const coreFeatures = [
        {
                icon: <Brain size={32} color={colors.primary} />,
                title: "AI Health Assistant",
                description: "Personalized insights and recommendations powered by advanced AI technology"
        },
        {
                icon: <CalendarCheck size={32} color={colors.accent} />,
                title: "Period Tracker",
                description: "Accurate cycle tracking with predictive analytics and custom reminders"
        },
        {
                icon: <Activity size={32} color={colors.purple.replace('#e1bee7', '#9c27b0')} />,
                title: "Symptom Analysis",
                description: "Track and analyze patterns in your symptoms for better health understanding"
        },
        {
                icon: <AlertCircle size={32} color={colors.primary} />,
                title: "Health Alerts",
                description: "Smart notifications for important health events and anomalies"
        }
];

const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
                opacity: 1,
                transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.2
                }
        }
};



export default function CoreFeaturesSection() {
        return (
                <section className="py-20 px-4 mx-auto flex justify-center items-center overflow-hidden">
                        <div className="max-w-[1200px] mx-auto">
                                <motion.div
                                        initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ 
                                                duration: 1,
                                                ease: [0.25, 0.25, 0, 1],
                                                filter: { duration: 1.5 }
                                        }}
                                        className="text-center mb-16"
                                >
                                        <motion.h2 
                                                initial={{ opacity: 0, y: 30, filter: "blur(12px)", scale: 0.9 }}
                                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ 
                                                        duration: 1.2, 
                                                        delay: 0.2, 
                                                        ease: [0.25, 0.25, 0, 1],
                                                        filter: { duration: 1.8 }
                                                }}
                                                className={`text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-pink-700/70 to-pink-500 bg-clip-text text-transparent leading-tight ${cookie.className}`}
                                        >
                                                Core Features
                                        </motion.h2>
                                        <motion.p 
                                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                viewport={{ once: true }}
                                                transition={{ 
                                                        duration: 0.8, 
                                                        delay: 0.6,
                                                        ease: "easeOut"
                                                }}
                                                className="text-lg text-purple-700 max-w-xl mx-auto"
                                        >
                                                Discover how SheSync transforms your health journey with intelligent, personalized features
                                        </motion.p>
                                </motion.div>
                                
                                <motion.div 
                                        variants={containerVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-50px" }}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
                                >
                                        {coreFeatures.map((feature, index) => (
                                                <motion.div
                                                        key={feature.title}
                                                       
                                                        whileHover={{ 
                                                                y: -10,
                                                                scale: 1.02,
                                                                transition: { 
                                                                        duration: 0.3,
                                                                        ease: "easeOut"
                                                                }
                                                        }}
                                                        className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 relative group cursor-pointer"
                                                >
                                                        {/* Enhanced gradient border effect */}
                                                        <motion.div 
                                                                initial={{ 
                                                                        opacity: 0, 
                                                                        scale: 0.5, 
                                                                        filter: "blur(40px)",
                                                                        rotate: -10
                                                                }}
                                                                whileInView={{ 
                                                                        opacity: 1, 
                                                                        scale: 1, 
                                                                        filter: "blur(30px)",
                                                                        rotate: 0
                                                                }}
                                                                viewport={{ once: true }}
                                                                transition={{ 
                                                                        duration: 1.5, 
                                                                        delay: index * 0.2 + 0.5,
                                                                        ease: [0.25, 0.25, 0, 1]
                                                                }}
                                                                className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl -z-10 group-hover:from-pink-400/30 group-hover:via-purple-400/30 group-hover:to-pink-400/30 transition-all duration-500"
                                                        ></motion.div>
                                                        
                                                        {/* Floating background particles effect */}
                                                        <motion.div
                                                                initial={{ opacity: 0, scale: 0 }}
                                                                whileInView={{ opacity: 0.1, scale: 1 }}
                                                                viewport={{ once: true }}
                                                                transition={{ 
                                                                        duration: 2,
                                                                        delay: index * 0.3 + .5,
                                                                        repeat: Infinity,
                                                                        repeatType: "reverse"
                                                                }}
                                                                className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-xl"
                                                        ></motion.div>
                                                        
                                                        <motion.div 
                                                                
                                                                className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md relative overflow-hidden group-hover:shadow-lg transition-shadow duration-300"
                                                        >
                                                                <motion.div
                                                                        className="absolute inset-0 bg-gradient-to-r from-pink-200/50 to-purple-200/50 rounded-full"
                                                                        initial={{ scale: 0, opacity: 0 }}
                                                                        whileInView={{ scale: 1, opacity: 1 }}
                                                                        transition={{ delay: index * 0.2 + 0.3, duration: 0.8 }}
                                                                />
                                                                {feature.icon}
                                                        </motion.div>
                                                        
                                                        <motion.h3 
                                                       
                                                                className="text-lg font-semibold text-pink-500 mb-2"
                                                        >
                                                                {feature.title}
                                                        </motion.h3>
                                                        
                                                        <motion.p 
                                                            
                                                                transition={{ delay: 0.1 }}
                                                                className="text-gray-600 text-base leading-relaxed"
                                                        >
                                                                {feature.description}
                                                        </motion.p>
                                                </motion.div>
                                        ))}
                                </motion.div>
                        </div>
                </section>
        );
}
