/* eslint-disable */

import { motion } from "framer-motion";
import { ShoppingBag, Video } from "lucide-react";
import {Cookie} from "next/font/google"
const  cookie = Cookie({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-cookie'
})

export default function EcommerceServicesSection() {
        return (
                <motion.section 
                        initial={{ opacity: 0, filter: "blur(20px)" }}
                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="py-20 px-4 mx-auto flex justify-center items-center"
                >
                        <div className="max-w-[1200px] mx-auto">
                                <motion.div
                                        initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                        className="text-center mb-16"
                                >
                                        <motion.h2 
                                                initial={{ opacity: 0, y: 30, filter: "blur(20px)", scale: 0.9 }}
                                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                                                className={`text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-pink-700/70 to-pink-500 bg-clip-text text-transparent mb-6 leading-tight ${cookie.className}`}
                                        >
                                                Shop & Services
                                        </motion.h2>
                                        <motion.p 
                                                initial={{ opacity: 0, filter: "blur(10px)" }}
                                                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                                                className="text-lg text-purple-700 max-w-xl mx-auto"
                                        >
                                                Access curated wellness products and book expert consultations all in one place
                                        </motion.p>
                                </motion.div>
                                
                                <div className="flex flex-col md:flex-row gap-5 md:gap-8 lg:gap-14 items-center">
                                        <motion.div
                                                initial={{ 
                                                        opacity: 0, 
                                                        
                                                        filter: "blur(25px)",
                                                        backdropFilter: "blur(0px)",
                                                        scale: 0.9
                                                }}
                                                whileInView={{ 
                                                        opacity: 1, 
                                                       
                                                        filter: "blur(0px)",
                                                        backdropFilter: "blur(20px)",
                                                        scale: 1
                                                }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                                className="bg-white/80 flex flex-col justify-center items-center backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 relative"
                                        >
                                                <motion.div 
                                                        initial={{ opacity: 0, scale: 0.8, filter: "blur(40px)" }}
                                                        whileInView={{ opacity: 1, scale: 1, filter: "blur(30px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.5, delay: 0.5 }}
                                                        className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl -z-10"
                                                />
                                                <motion.div
                                                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                                                >
                                                        <ShoppingBag size={48} className="mb-6 text-pink-400" />
                                                </motion.div>
                                                <motion.h3 
                                                        initial={{ opacity: 0, filter: "blur(8px)" }}
                                                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                                                        className="text-xl font-semibold text-pink-500 mb-4"
                                                >
                                                        Wellness Shop
                                                </motion.h3>
                                                <motion.p 
                                                        initial={{ opacity: 0, filter: "blur(8px)" }}
                                                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
                                                        className="text-gray-600 text-base leading-relaxed mb-8 text-center"
                                                >
                                                        Discover carefully selected health and wellness products tailored for women's unique needs.
                                                </motion.p>
                                                <motion.button 
                                                        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                                                        className="bg-yellow-400 text-white py-3 px-8 rounded-full text-base font-semibold cursor-pointer shadow-md hover:bg-yellow-500 transition"
                                                >
                                                        Explore Shop
                                                </motion.button>
                                        </motion.div>
                                        
                                        <motion.div
                                                initial={{ 
                                                        opacity: 0,  
                                                        filter: "blur(25px)",
                                                        backdropFilter: "blur(0px)",
                                                        scale: 0.9
                                                }}
                                                whileInView={{ 
                                                        opacity: 1, 
                                                        filter: "blur(0px)",
                                                        backdropFilter: "blur(20px)",
                                                        scale: 1
                                                }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                                className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100 relative flex flex-col justify-center items-center"
                                        >
                                                <motion.div 
                                                        initial={{ opacity: 0, scale: 0.8, filter: "blur(40px)" }}
                                                        whileInView={{ opacity: 1, scale: 1, filter: "blur(30px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.5, delay: 0.7 }}
                                                        className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl -z-10"
                                                />
                                                <motion.div
                                                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                                                >
                                                        <Video size={48} className="mb-6 text-purple-400" />
                                                </motion.div>
                                                <motion.h3 
                                                        initial={{ opacity: 0, filter: "blur(8px)" }}
                                                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                                                        className="text-xl font-semibold text-pink-500 mb-4"
                                                >
                                                        Expert Consultations
                                                </motion.h3>
                                                <motion.p 
                                                        initial={{ opacity: 0, filter: "blur(8px)" }}
                                                        whileInView={{ opacity: 1, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
                                                        className="text-gray-600 text-base leading-relaxed mb-8 text-center"
                                                >
                                                        Book personalized sessions with certified healthcare professionals and wellness experts.
                                                </motion.p>
                                                <motion.button 
                                                        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                                                        className="bg-pink-400 text-white py-3 px-8 rounded-full text-base font-semibold cursor-pointer shadow-md hover:bg-pink-500 transition"
                                                >
                                                        Book Session
                                                </motion.button>
                                        </motion.div>
                                </div>
                        </div>
                </motion.section>
        );
}
