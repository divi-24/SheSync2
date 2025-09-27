/* eslint-disable */
"use client"
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const WORDS = [
    { word: "period", hint: "Monthly menstrual cycle" },
    { word: "ovulation", hint: "Release of an egg from the ovary" },
    { word: "fertility", hint: "Ability to conceive a child" },
    { word: "hormones", hint: "Chemical messengers affecting cycles" },
    { word: "menstrual", hint: "Related to menstruation" },
    { word: "pregnancy", hint: "State of carrying a developing baby" },
    { word: "trimester", hint: "One-third of pregnancy period" },
    { word: "cramps", hint: "Common period pain" },
    { word: "flow", hint: "Discharge during menstruation" },
    { word: "implantation", hint: "When fertilized egg attaches to uterus" },
    { word: "estrogen", hint: "Primary female sex hormone" },
    { word: "progesterone", hint: "Hormone important for pregnancy" },
    { word: "cervix", hint: "Neck of the uterus" },
    { word: "uterus", hint: "Womb, where the baby grows" },
    { word: "placenta", hint: "Organ that nourishes the baby" },
    { word: "contractions", hint: "Labor muscle tightening" },
    { word: "midwife", hint: "Healthcare professional for childbirth" },
    { word: "doula", hint: "Support person during pregnancy/labor" },
    { word: "periodtracker", hint: "App to monitor menstrual cycles" },
    { word: "menopause", hint: "End of menstruation cycle" },
    { word: "flowchart", hint: "Visual tracker for menstrual cycle" },
    { word: "cycle", hint: "Repeating hormonal pattern" },
    { word: "spotting", hint: "Light bleeding between periods" },
    { word: "basal", hint: "Body temperature used to track ovulation" },
    { word: "mood", hint: "Emotional changes during PMS" },
    { word: "nutrition", hint: "Essential for pregnancy health" },
    { word: "hydration", hint: "Important during menstruation" },
    { word: "calendar", hint: "Used to track ovulation or periods" },
    { word: "pregnancytest", hint: "Used to check if you're pregnant" },
    { word: "breastfeeding", hint: "Feeding a baby with milk from the breast" }
];


export default function Hangman() {
    const [word, setWord] = useState("");
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [hint, setHint] = useState("");
    const [lastWord, setLastWord] = useState<string | null>(null);
    const maxWrong = 6;
    const navigate = useRouter();

    const restartGame = useCallback(() => {
        let newWordObj;
        do {
            newWordObj = WORDS[Math.floor(Math.random() * WORDS.length)];
        } while (newWordObj.word === lastWord && WORDS.length > 1);

        setWord(newWordObj.word);
        setHint(newWordObj.hint);
        setGuessedLetters([]);
        setWrongGuesses(0);
        setLastWord(newWordObj.word);
    }, []);

    useEffect(() => {
        // Only run once on mount
        restartGame();
    }, [restartGame]);

    type Letter = string;

    const handleGuess = (letter: Letter): void => {
        if (guessedLetters.includes(letter)) return;
        setGuessedLetters((prev: Letter[]) => [...prev, letter]);
        if (!word.includes(letter)) {
            setWrongGuesses((prev: number) => prev + 1);
        }
    };

    const isWinner = word.split("").every((char) => guessedLetters.includes(char));
    const isGameOver = wrongGuesses >= maxWrong;

    const renderWord = () =>
        word.split("").map((char, i) => (
            <span
                key={i}
                className="border-b-2 border-pink-600 dark:border-pink-400 text-xl sm:text-2xl mx-1 w-6 sm:w-8 inline-block text-center font-semibold"
            >
                {guessedLetters.includes(char) || isGameOver ? char : ""}
            </span>
        ));

    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

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
                                🎯 HANGMAN
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
                        </div>

                        {/* Game Content */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">
                            <div className="mb-6 text-sm sm:text-base text-pink-700 dark:text-pink-300">
                                💡 <span className="font-medium">Hint:</span> {hint}
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base">
                                Guess the hidden word one letter at a time. You can only make{" "}
                                <span className="font-bold">{maxWrong}</span> wrong guesses!
                            </p>

                            {/* Word Display */}
                            <div className="mb-6 text-2xl font-mono tracking-wide flex justify-center flex-wrap gap-1">
                                {renderWord()}
                            </div>

                            {/* Alphabet Buttons */}
                            <div className="grid grid-cols-7 sm:grid-cols-13 gap-2 justify-center mb-6">
                                {alphabet.map((letter) => (
                                    <button
                                        key={letter}
                                        onClick={() => handleGuess(letter)}
                                        disabled={guessedLetters.includes(letter) || isWinner || isGameOver}
                                        className={`w-8 h-8 text-sm font-semibold rounded-lg transition-all duration-200 ${guessedLetters.includes(letter)
                                            ? word.includes(letter)
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                            : "bg-pink-100 dark:bg-gray-700 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-gray-600"
                                            } disabled:cursor-not-allowed`}
                                    >
                                        {letter.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            {/* Game Result */}
                            <div className="text-lg font-semibold mb-4">
                                {isWinner && (
                                    <div className="text-green-600 dark:text-green-400">
                                        🎉 Congratulations! You won!
                                    </div>
                                )}
                                {isGameOver && !isWinner && (
                                    <div className="text-red-600 dark:text-red-400">
                                        � Game Over! The word was: <span className="font-bold">{word}</span>
                                    </div>
                                )}
                            </div>

                            {/* Restart Button */}
                            {(isWinner || isGameOver) && (
                                <button
                                    onClick={restartGame}
                                    className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    🔁 Play Again
                                </button>
                            )}

                            {/* Wrong Guesses Count */}
                            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                                Wrong guesses: {wrongGuesses} / {maxWrong}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
