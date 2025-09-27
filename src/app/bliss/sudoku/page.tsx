/* eslint-disable */

"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PartyPopper, XCircle, ArrowLeft } from "lucide-react";

const difficulties: Record<"Easy" | "Medium" | "Hard", number> = {
  Easy: 35,
  Medium: 30,
  Hard: 25,
};

function generateEmptyBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(""));
}

interface SudokuBoard extends Array<Array<number | "">> { }

function deepCopy(board: SudokuBoard): SudokuBoard {
  return board.map((row) => [...row]);
}



type SudokuBoardType = Array<Array<number | "">>;



function isSafe(
  board: SudokuBoardType,
  row: number,
  col: number,
  num: number
): boolean {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) {
      return false;
    }
  }
  const startRow = 3 * Math.floor(row / 3);
  const startCol = 3 * Math.floor(col / 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function solveSudoku(board: SudokuBoardType): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === "") {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = "";
          }
        }
        return false;
      }
    }
  }
  return true;
}

interface FillBoardRandomlyBoard extends Array<Array<number | "">> { }

function fillBoardRandomly(board: SudokuBoardType): void {
  const nums: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 9; i++) {
    board[0][i] = nums[i];
  }
  solveSudoku(board);
}
function generateSudoku(full: boolean, clues: number = 35): SudokuBoardType {
  const board = generateEmptyBoard();
  fillBoardRandomly(board);
  if (full) return board;
  const puzzle = deepCopy(board);
  let removed = 81 - clues;
  while (removed > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== "") {
      puzzle[row][col] = "";
      removed--;
    }
  }
  return puzzle;
}

export default function Sudoku() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [clues, setClues] = useState(difficulties["Easy"]);
  const [solution, setSolution] = useState<SudokuBoardType>([]);
  const [board, setBoard] = useState<SudokuBoardType>([]);
  const [initial, setInitial] = useState<SudokuBoardType>([]);
  const [lives, setLives] = useState(5);
  const [time, setTime] = useState(600);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState("playing");
  const [feedback, setFeedback] = useState<Record<string, "correct" | "wrong">>({});
  const navigate = useRouter();

  useEffect(() => {
    if (timerRunning && time > 0 && status === "playing") {
      const interval = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning, time, status]);

  useEffect(() => {
    if (lives === 0 || time === 0) {
      setStatus("lose");
      setTimerRunning(false);
    }
    if (status === "playing" && board.length > 0 && isBoardComplete()) {
      setStatus("win");
      setTimerRunning(false);
    }
  }, [board, lives, time]);

  const isBoardComplete = () =>
    board.every((row, r) =>
      row.every((cell, c) => cell === solution[r][c])
    );

  const handleNewGame = () => {
    const full = generateSudoku(true);
    const puzzle = generateSudoku(false, clues);
    setSolution(full);
    setBoard(puzzle);
    setInitial(puzzle);
    setLives(5);
    setTime(600);
    setStatus("playing");
    setTimerRunning(true);
    setSelectedCell(null);
    setFeedback({});
  };

  interface HandleInputFeedback {
    [key: string]: "correct" | "wrong";
  }

  type SelectedCellType = [number, number] | null;

  const handleInput = (
    row: number,
    col: number,
    val: string
  ): void => {
    if (
      initial[row][col] !== "" ||
      !/^[1-9]$/.test(val) ||
      status !== "playing"
    )
      return;
    const newBoard: SudokuBoardType = deepCopy(board);
    newBoard[row][col] = parseInt(val);

    if (solution[row][col] === parseInt(val)) {
      setFeedback({ [`${row}-${col}`]: "correct" } as HandleInputFeedback);
      setBoard(newBoard);
    } else {
      setFeedback({ [`${row}-${col}`]: "wrong" } as HandleInputFeedback);
      setLives((l) => l - 1);
      setTimeout(() => setFeedback({}), 800);
    }
  };

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
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
        <div className="w-full max-w-6xl">
          <div className="text-center space-y-8">
            {/* Game Title */}
            <div className="space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                SUDOKU
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
            </div>

            {/* Game Content */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">

              {/* Game Controls */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8 justify-center items-center">
                <div className="text-center">
                  <label className="block font-semibold text-pink-700 dark:text-pink-300 mb-2">
                    Choose Difficulty:
                  </label>
                  <div className="flex gap-2">
                    {Object.keys(difficulties).map((diff) => (
                      <button
                        key={diff}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${difficulty === diff
                            ? "bg-pink-600 text-white shadow-md"
                            : "bg-pink-100 dark:bg-gray-700 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-gray-600"
                          }`}
                        onClick={() => {
                          setDifficulty(diff);
                          setClues(difficulties[diff as keyof typeof difficulties]);
                        }}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNewGame}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                >
                  Create New Game
                </button>
              </div>

              {/* Game Status */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-lg font-semibold">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl px-4 py-2 border border-pink-200 dark:border-gray-600">
                    <span className="text-pink-700 dark:text-pink-300">
                      ⏰ Time: {formatTime()}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-600 dark:to-gray-700 rounded-xl px-4 py-2 border border-purple-200 dark:border-gray-600">
                    <span className="text-purple-700 dark:text-purple-300">
                      ❤️ Lives: {lives}
                    </span>
                  </div>
                </div>

                {status !== "playing" && (
                  <div className={`text-center text-2xl font-bold flex items-center justify-center gap-2 ${status === "win" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                    {status === "win" ? <PartyPopper /> : <XCircle />}
                    {status === "win" ? "🎉 You solved it!" : "💀 Game Over!"}
                  </div>
                )}
              </div>

              {/* Sudoku Grid */}
              <div className="flex justify-center mb-8">
                <div className="inline-block p-4 bg-white dark:bg-gray-700 rounded-xl shadow-lg border-2 border-pink-300 dark:border-pink-700">
                  <div className="grid grid-cols-9 gap-1">
                    {board.map((row, rIdx) =>
                      row.map((cell, cIdx) => {
                        const isInitial = initial[rIdx][cIdx] !== "";
                        const key = `${rIdx}-${cIdx}`;
                        const feedbackClass =
                          feedback[key] === "correct"
                            ? "bg-green-200 dark:bg-green-700"
                            : feedback[key] === "wrong"
                              ? "bg-red-200 dark:bg-red-700"
                              : "";
                        const selected =
                          selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx
                            ? "ring-2 ring-pink-500 dark:ring-pink-400"
                            : "";
                        const borderClass =
                          `${rIdx % 3 === 2 && rIdx !== 8 ? "border-b-2 border-pink-500" : ""} 
                                                     ${cIdx % 3 === 2 && cIdx !== 8 ? "border-r-2 border-pink-500" : ""}`;

                        return (
                          <input
                            key={key}
                            maxLength={1}
                            value={cell === "" ? "" : String(cell)}
                            onClick={() => setSelectedCell([rIdx, cIdx])}
                            onChange={(e) => handleInput(rIdx, cIdx, e.target.value)}
                            disabled={isInitial}
                            className={`w-10 h-10 text-center font-bold text-lg border border-gray-300 dark:border-gray-600 focus:outline-none transition-all duration-200 ${isInitial
                                ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 cursor-not-allowed"
                                : "text-pink-700 dark:text-pink-300 bg-white dark:bg-gray-700 hover:bg-pink-50 dark:hover:bg-gray-600"
                              } ${feedbackClass} ${selected} ${borderClass}`}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-pink-200 dark:border-gray-600">
                <h2 className="text-xl font-bold text-center mb-4 text-pink-700 dark:text-pink-300">
                  📋 Game Rules
                </h2>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 max-w-2xl mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 dark:text-pink-400">•</span>
                    Fill the 9×9 grid so each row, column, and 3×3 box contains digits 1–9 exactly once
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 dark:text-pink-400">•</span>
                    You have 5 lives and 10 minutes to complete the puzzle
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 dark:text-pink-400">•</span>
                    Correct inputs are highlighted in green
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 dark:text-pink-400">•</span>
                    Wrong inputs reduce lives and flash red
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
