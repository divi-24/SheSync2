"use client"
import React, { useState } from "react";
import {
    Smile,
    MessageSquareQuote,
    ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function QuoteJoke() {
    const [joke, setJoke] = useState<string | null>(null);
    const [quote, setQuote] = useState<string | null>(null);
    const navigate = useRouter();

    const fetchJoke = async () => {
        try {
            const res = await axios.get(
                "https://v2.jokeapi.dev/joke/Any?type=single"
            );
            setJoke(res.data.joke);
        } catch {
            setJoke("Failed to load joke.");
        }
    };

    const fetchQuote = async () => {
        try {
            const res = await axios.get("https://api.api-ninjas.com/v1/quotes", {
                headers: {
                    "X-Api-Key": "import.meta.env.VITE_API_NINJAS_KEY",
                },
            });
            const data = res.data[0];
            setQuote(`${data.quote} — ${data.author}`);
        } catch {
            setQuote("Failed to load quote.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
            {/* Header with Back Button */}
            <div className="p-6">
                <button
                    onClick={() => navigate.push("/bliss")}
                    className="flex items-center gap-2 bg-white text-pink-600 border border-pink-300 hover:bg-pink-100 dark:bg-gray-800 dark:text-pink-400 dark:border-pink-700 dark:hover:bg-gray-700 transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Bliss Page
                </button>
            </div>

            {/* Main Content Container */}
            <div className="flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-4xl">
                    <div className="text-center space-y-8">
                        {/* Game Title */}
                        <div className="space-y-2">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                JOKES & QUOTES
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>

                        {/* Game Content */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">
                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
                                <button
                                    onClick={fetchJoke}
                                    className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-all duration-200 flex items-center gap-2 justify-center shadow-sm hover:shadow-md"
                                >
                                    <Smile size={18} /> Get a Joke
                                </button>

                                <button
                                    onClick={fetchQuote}
                                    className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 justify-center shadow-sm hover:shadow-md"
                                >
                                    <MessageSquareQuote size={18} /> Get a Quote
                                </button>
                            </div>

                            {/* Result Display */}
                            <div className="space-y-6">
                                {/* Joke Box */}
                                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-pink-200 dark:border-gray-600 min-h-[120px]">
                                    <h2 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-400 flex items-center gap-2">
                                        <Smile size={20} />
                                        Joke
                                    </h2>
                                    {joke ? (
                                        <p className="text-lg italic text-gray-800 dark:text-gray-200">{joke}</p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No joke yet. Click the button above to fetch one!
                                        </p>
                                    )}
                                </div>

                                {/* Quote Box */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-600 dark:to-gray-700 rounded-xl p-6 border border-purple-200 dark:border-gray-600 min-h-[120px]">
                                    <h2 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                                        <MessageSquareQuote size={20} />
                                        Quote
                                    </h2>
                                    {quote ? (
                                        <p className="text-lg italic text-gray-800 dark:text-gray-200">{quote}</p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No quote yet. Click the button above to fetch one!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
