"use client";

import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./ui/Toast";
import { useState } from "react";
import {Cookie} from "next/font/google"
const  cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
})
export default function Footer() {
    const { toasts, success, error, removeToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <>
            <footer className="bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand + mission */}
                    <div>
                        <div className="flex items-center justify-start gap-2">

                                   <h1 className={`font-bold text-5xl py-1 bg-clip-text text-transparent bg-gradient-to-bl from-pink-400 to-pink-600 ${cookie.className}`}>SheSync</h1> 
                                   <span className="text-4xl pb-2">🌸</span>
                        </div>

                        <p className="mt-3 text-sm text-gray-600">
                            Empowering women’s health & wellness with AI-driven insights, community support,
                            and secure health management.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Explore</h4>
                        <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                            <li><Link href="/about" className="hover:text-pink-600">About</Link></li>
                            <li><Link href="/features" className="hover:text-pink-600">Features</Link></li>
                            <li><Link href="/community" className="hover:text-pink-600">Community</Link></li>
                            <li><Link href="/shop" className="hover:text-pink-600">Shop</Link></li>
                            <li><Link href="/consultations" className="hover:text-pink-600">Consultations</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Legal</h4>
                        <ul className="mt-3 space-y-2 text-gray-600 text-sm">
                            <li><Link href="/privacy" className="hover:text-pink-600">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-pink-600">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-pink-600">Cookie Policy</Link></li>
                            <li><Link href="/security" className="hover:text-pink-600">Security</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / waitlist */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800">Join the Waitlist</h4>
                        <p className="mt-3 text-sm text-gray-600">
                            Be the first to get updates, early access, and exclusive perks.
                        </p>
                        <form
                            className="mt-4 flex"
                            onSubmit={async (e) => {
                                e.preventDefault();

                                if (isSubmitting) {
                                    return; // Prevent multiple submissions
                                }

                                setIsSubmitting(true);
                                const form = e.currentTarget;
                                const formData = new FormData(form);
                                const email = formData.get("email") as string;

                                if (email) {
                                    try {
                                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/waitlist/join`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                email,
                                                source: 'footer'
                                            }),
                                        });

                                        const data = await response.json();

                                        if (response.ok && data.success) {
                                            success(data.message || "Successfully joined the waitlist! We'll be in touch soon.");
                                            form.reset();
                                        } else if (response.status === 429) {
                                            error('Too many requests. Please wait a moment before trying again.');
                                        } else {
                                            error(data.message || 'Something went wrong. Please try again.');
                                        }
                                    } catch (err) {
                                        console.error('Waitlist join error:', err);
                                        error('Network error. Please check your connection and try again.');
                                    }
                                }

                                setIsSubmitting(false);
                            }}
                        >
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                disabled={isSubmitting}
                                className="w-full rounded-l-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-pink-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "..." : "Join"}
                            </button>
                        </form>
                        <div className="flex space-x-4 mt-6 text-gray-600">
                            <Link href="https://twitter.com" target="_blank"><FaTwitter className="hover:text-pink-600" /></Link>
                            <Link href="https://www.instagram.com/shesy_nc" target="_blank"><FaInstagram className="hover:text-pink-600" /></Link>
                            <Link href="https://www.linkedin.com/company/shesync/" target="_blank"><FaLinkedin className="hover:text-pink-600" /></Link>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-200 mt-10">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} SheSync. All rights reserved.</p>
                        <p className="mt-2 md:mt-0">Built with ❤️ for women’s wellness</p>
                    </div>
                </div>
            </footer>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </>
    );
}
