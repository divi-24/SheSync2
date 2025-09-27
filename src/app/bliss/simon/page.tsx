/* eslint-disable */

"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeft, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const colors = ["red", "green", "yellow", "blue"];

const colorStyles = {
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-400 hover:bg-yellow-500",
    blue: "bg-blue-500 hover:bg-blue-600",
};

export default function SimonGame() {
    const [sequence, setSequence] = useState<string[]>([]);
    const [userIndex, setUserIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [activeColor, setActiveColor] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [level, setLevel] = useState(0);
    const navigate = useRouter();

    interface PlaySoundFn {
        (color: string): void;
    }

    const playSound: PlaySoundFn = (color) => {
        const audio = new Audio(`/bliss/audio/${color}.mp3`);
        audio.play();
    };

    interface FlashColorFn {
        (color: string): Promise<void>;
    }

    const flashColor: FlashColorFn = async (color: string) => {
        setActiveColor(color);
        playSound(color);
        await new Promise<void>((resolve) => setTimeout(resolve, 600));
        setActiveColor(null);
    };

    const playSequence = async () => {
        setIsPlaying(true);
        for (const color of sequence) {
            await flashColor(color);
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
        setIsPlaying(false);
    };

    const startGame = () => {
        setGameOver(false);
        setGameStarted(true);
        setScore(0);
        setUserIndex(0);
        setLevel(1);

        const firstColor = colors[Math.floor(Math.random() * 4)];
        setTimeout(() => {
            setSequence([firstColor]);
        }, 1500);
    };

    const endGame = () => {
        setGameStarted(false);
        setGameOver(false);
        setSequence([]);
        setUserIndex(0);
        setScore(0);
        setLevel(0);
    };

    useEffect(() => {
        if (sequence.length > 0) playSequence();
    }, [sequence]);

    interface HandleUserInputFn {
        (color: string): Promise<void>;
    }

    const handleUserInput: HandleUserInputFn = async (color) => {
        if (!gameStarted || isPlaying || gameOver) return;
        playSound(color);

        if (color === sequence[userIndex]) {
            if (userIndex === sequence.length - 1) {
                const nextColor: string = colors[Math.floor(Math.random() * 4)];

                setTimeout(() => {
                    setSequence([...sequence, nextColor]);
                    setUserIndex(0);
                    setScore((prev: number) => prev + 1);
                    setLevel((prev: number) => prev + 1);
                }, 1500);
            } else {
                setUserIndex(userIndex + 1);
            }
        } else {
            playSound("wrong");
            setGameOver(true);
            setGameStarted(false);
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
                                SIMON GAME
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>

                        {/* Game Content */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">
                            {gameOver ? (
                                <div className="flex flex-col items-center text-red-600 dark:text-red-400 mb-6">
                                    <XCircle size={48} />
                                    <p className="mt-2 text-xl font-bold">Game Over! Final Score: {score}</p>
                                    <button
                                        onClick={startGame}
                                        className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Restart
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {!gameStarted ? (
                                        <button
                                            onClick={startGame}
                                            className="bg-pink-600 text-white px-8 py-3 mb-8 rounded-lg hover:bg-pink-700 transition-all duration-200 text-lg font-semibold shadow-sm hover:shadow-md"
                                        >
                                            Start Game
                                        </button>
                                    ) : (
                                        <button
                                            onClick={endGame}
                                            className="bg-red-600 text-white px-8 py-3 mb-8 rounded-lg hover:bg-red-700 transition-all duration-200 text-lg font-semibold shadow-sm hover:shadow-md"
                                        >
                                            End Game
                                        </button>
                                    )}

                                    {gameStarted && !gameOver && (
                                        <p className="text-2xl font-bold text-pink-600 dark:text-pink-300 mb-6">
                                            Level {level}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-6 mb-6 max-w-md mx-auto">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => handleUserInput(color)}
                                                className={`w-32 h-32 rounded-2xl transition-all duration-300 shadow-lg ${colorStyles[color as keyof typeof colorStyles]
                                                    } ${activeColor === color ? "ring-4 ring-white scale-105" : ""}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-xl font-semibold text-pink-700 dark:text-pink-300">
                                        Score: {score}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
