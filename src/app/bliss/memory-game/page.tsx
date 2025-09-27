"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Smile,
  Sun,
  Moon,
  Star,
  Cloud,
  Zap,
  Leaf,
  Flame,
  Droplet,
  Eye,
  Heart,
  Ghost,
  Bell,
  Apple,
  Camera,
  ArrowLeft
} from "lucide-react";

const icons = [Smile, Sun, Moon, Star, Cloud, Zap, Leaf, Flame, Droplet, Eye, Heart, Ghost, Bell, Apple, Camera];
const TOTAL_MOVES = 15;

type CardType = {
  id: number;
  icon: React.ForwardRefExoticComponent<
    Omit<React.ComponentProps<'svg'>, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
};

export default function MemoryGamePage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(TOTAL_MOVES);
  const [gameKey, setGameKey] = useState(0);
  const navigate = useRouter();

  useEffect(() => {
    const shuffled = shuffleIcons();
    setCards(shuffled);
  }, [gameKey]);

  const shuffleIcons = () => {
    const chosenIcons = icons.slice(0, 8);
    const pairs = [...chosenIcons, ...chosenIcons];
    return pairs
      .map((icon, i) => ({ id: i, icon }))
      .sort(() => Math.random() - 0.5);
  };

  const handleFlip = (index: number): void => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped: number[] = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setMatched((prev: number[]) => [...prev, first, second]);
        setTimeout(() => setFlipped([]), 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setMoves((prev: number) => prev - 1);
        }, 800);
      }
    }
  };

  const isGameOver = moves === 0 || matched.length === 16;

  const isFlipped = (index: number): boolean =>
    flipped.includes(index) || matched.includes(index) || isGameOver;

  const restartGame = () => {
    setFlipped([]);
    setMatched([]);
    setMoves(TOTAL_MOVES);
    setGameKey((prev) => prev + 1);
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
                                MEMORY GAME
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>

            {/* Game Content */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">
              <p className="text-lg text-pink-700 dark:text-pink-400 mb-4">
                Moves Left: {moves}
              </p>

              <button
                onClick={restartGame}
                className="mb-6 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Restart Game
              </button>

              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className="w-20 h-20 perspective cursor-pointer"
                    onClick={() => handleFlip(index)}
                  >
                    <div className={`card-inner ${isFlipped(index) ? "rotate" : ""}`}>
                      <div className="card-face absolute w-full h-full backface-hidden flex items-center justify-center text-2xl font-bold text-pink-600 dark:text-pink-300 bg-pink-200 dark:bg-gray-600 rounded-lg">
                        ?
                      </div>
                      <div className="card-face absolute w-full h-full backface-hidden flex items-center justify-center text-pink-600 dark:text-pink-300 bg-white dark:bg-gray-700 rounded-lg transform rotate-y-180">
                        {React.createElement(card.icon, { width: 40, height: 40 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {moves === 0 && matched.length < 16 && (
                <p className="mt-6 text-xl font-semibold text-red-600 dark:text-red-400">
                  Game Over! Try again.
                </p>
              )}
              {matched.length === 16 && (
                <p className="mt-6 text-xl font-semibold text-green-600 dark:text-green-400">
                  🎉 You Won!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
