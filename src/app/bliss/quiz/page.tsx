"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {  Headphones, ArrowLeft } from "lucide-react";
import axios from "axios";

const questions = [
    {
        question: "How was your day today?",
        options: ["Good!", "In the middle", "Not good..."],
    },
    {
        question: "How are you feeling right now?",
        options: [
            "Happy/Content",
            "Sad/Discontent",
            "Angry/Irritated",
            "Nervous/Tense",
            "Sleepy/Tired",
        ],
    },
    {
        question: "What genres do you typically like?",
        options: ["Rock", "Hip-hop/Rap", "Pop", "Alternative", "Country"],
    },
];

export default function Quiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const router = useRouter();
    const [moodKeyword, setMoodKeyword] = useState("");



    interface Playlist {
      id: string;
      [key: string]: unknown;
    }

    interface SpotifyResponse {
      playlist: Playlist;
      [key: string]: unknown;
    }

    const handleAnswer = async (answer: string): Promise<void> => {
      const newAnswers: string[] = [...answers, answer];
      setAnswers(newAnswers);

      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        const mood: string = generateMoodKeyword([newAnswers[0], newAnswers[1], newAnswers[2]]);
        setMoodKeyword(mood);
        try {
          const res = await axios.get<SpotifyResponse>(
            `http://localhost:3000/api/spotify/recommend?mood=${encodeURIComponent(mood)}`
          );
          setPlaylist(res.data.playlist);
          console.log("Final Answers:", newAnswers);
          console.log("Mood:", mood);
          console.log("Playlist Result:", res.data.playlist);
        } catch (err) {
          if (err instanceof Error) {
            console.error("Failed to fetch playlist:", err.message);
          } else {
            console.error("Failed to fetch playlist:", err);
          }
        }
      }
    };

const generateMoodKeyword = (answers: string[]): string => {
  const [day, feeling] = answers;
  if (feeling.includes("Happy")) return "happy";
  if (feeling.includes("Sad")) return "sad";
  if (feeling.includes("Angry")) return "angry";
  if (feeling.includes("Nervous")) return "relax";
  if (feeling.includes("Sleepy")) return "chill";
  if (day.includes("Not good")) return "uplift";
  return "positive";
}


    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-950 dark:to-gray-900">
            {/* Header with Back Button */}
            <div className="p-6">
                <button
                    onClick={() => router.push("/bliss")}
                    className="flex items-center gap-2 bg-white text-pink-600 border border-pink-300 hover:bg-pink-100 dark:bg-gray-800 dark:text-pink-400 dark:border-pink-700 dark:hover:bg-gray-700 transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Bliss Page
                </button>
            </div>

            {/* Main Content Container */}
            <div className="flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-4xl">
                    {!playlist ? (
                        /* Quiz Section */
                        <div className="text-center space-y-8">
                            {/* Quiz Title */}
                            <div className="space-y-2">
                                <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                    QUIZ
                                </h1>
                                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                            </div>

                            {/* Question Card */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
                                    {questions[step].question}
                                </h2>
                                
                                {/* Options */}
                                <div className="space-y-4 max-w-md mx-auto">
                                    {questions[step].options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(opt)}
                                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                
                                {/* Progress Indicator */}
                                <div className="mt-8 flex justify-center space-x-2">
                                    {questions.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                idx <= step 
                                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Playlist Result Section */
                        <div className="text-center space-y-8">
                            {/* Result Header */}
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 flex justify-center items-center gap-3">
                                    <Headphones className="w-8 h-8 text-pink-600" />
                                    Your Playlist Suggestion
                                </h2>
                                <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                            </div>

                            {/* Playlist Card */}
                            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-pink-100 dark:border-gray-700 max-w-3xl mx-auto">
                                {/* Spotify Embed */}
                                <div className="mb-6">
                                    {playlist?.id && (
                                        <div className="rounded-xl overflow-hidden shadow-lg">
                                            <iframe
                                                src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator`}
                                                width="100%"
                                                height="450"
                                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                loading="lazy"
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Mood Display */}
                                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-pink-200 dark:border-gray-600">
                                    <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300">
                                        Your mood: 
                                        <span className="ml-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-base font-medium capitalize shadow-md">
                                            {moodKeyword}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
