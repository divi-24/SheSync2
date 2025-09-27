/* eslint-disable */

"use client"
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Cookie } from "next/font/google";
import {  motion } from "framer-motion";

const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});


const genAI = new GoogleGenerativeAI("import.meta.env.VITE_GEMINI_API_KEY");

const DietPlan = () => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        weight: "",
        preference: "",
        allergies: "",
        goals: "",
        lastPeriod: "",
        cycleLength: "",
        periodDuration: "",
    });

    const [recommendation, setRecommendation] = useState("");
    const [phase, setPhase] = useState("");




    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const calculatePhase = () => {
        const lastDate = new Date(formData.lastPeriod);
        const today = new Date();
        const diff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        const cycleLength = parseInt(formData.cycleLength);
        const dayInCycle = diff % cycleLength;

        if (dayInCycle <= parseInt(formData.periodDuration)) return "Menstrual";
        if (dayInCycle <= 14) return "Follicular";
        if (dayInCycle <= 16) return "Ovulatory";
        return "Luteal";
    };



    const formatResponse = (text: string): (React.ReactElement | null)[] => {
      const lines: string[] = text.split("\n");
      return lines.map((line: string, index: number): React.ReactElement | null => {
        if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
          return (
            <li
              key={index}
              className="ml-6 list-disc text-gray-700 dark:text-gray-300"
            >
              {line.replace(/^(\*|\-)\s*/, "")}
            </li>
          );
        } else if (line.trim().startsWith("**") && line.includes("**")) {
          return (
            <h4
              key={index}
              className="text-pink-700 dark:text-pink-400 font-bold mt-4"
            >
              {line.replace(/\*\*/g, "")}
            </h4>
          );
        } else {
          return (
            <p
              key={index}
              className="text-gray-700 dark:text-gray-300 mt-1"
            >
              {line}
            </p>
          );
        }
      });
    };

    interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

    const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
      e.preventDefault();
      setRecommendation("Generating your personalized diet plan...");

      const currentPhase: string = calculatePhase();
      setPhase(currentPhase);

      const prompt: string = `
  You are a female health and nutrition assistant.
  Generate a detailed diet plan for the following user who is in the "${currentPhase}" phase of her menstrual cycle:

  Name: ${formData.name}
  Age: ${formData.age}
  Weight: ${formData.weight} kg
  Diet Preference: ${formData.preference}
  Allergies: ${formData.allergies}
  Health Goals: ${formData.goals}
  Cycle Length: ${formData.cycleLength} days
  Period Duration: ${formData.periodDuration} days
  First Day of Last Period: ${formData.lastPeriod}

  Keep the response short, friendly, and personalized.
  `;

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        // result.response.text() returns a string, not a Promise<string>
        const text: string = result.response.text();
        setRecommendation(text || "⚠️ No response generated.");
      } catch (err) {
        console.error("Gemini error:", err);
        setRecommendation("❌ Failed to generate recommendation. Please try again later.");
      }
    };

    return (
        <div className="flex flex-col min-h-screen overflow-auto justify-center items-center mx-auto bg-gradient-to-br from-pink-50 via-white to-pink-100">
          <div className="flex-1 p-4 sm:p-8  transition-all duration-300 overflow-y-auto flex flex-col items-center justify-center">

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 w-full max-w-2xl"
            >
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mt-10 mb-10 transition-colors duration-300">
                <h1 className={`${cookie.className} text-4xl md:text-6xl font-bold pb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-center`}>
                Diet Planner
                </h1>
                <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-2">
                  Personalized Nutrition for Every Cycle Phase
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                  Get a science-backed, cycle-aware diet plan tailored to your unique needs. Enter your details and let SheSync guide your nutrition for every phase of your menstrual cycle.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Name", name: "name" },
                    { label: "Age", name: "age" },
                    { label: "Weight (kg)", name: "weight" },
                    { label: "Diet Preference", name: "preference" },
                    { label: "Allergies", name: "allergies" },
                    { label: "Health Goals", name: "goals" },
                    { label: "First Day of Last Period", name: "lastPeriod", type: "date" },
                    { label: "Cycle Length (days)", name: "cycleLength" },
                    { label: "Period Duration (days)", name: "periodDuration" },
                  ].map(({ label, name, type = "text" }) => (
                    <div key={name}>
                      <label className="block text-sm font-semibold text-pink-700 dark:text-pink-300 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name as keyof typeof formData]}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-pink-300 dark:border-pink-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  >
                    Get My Diet Plan
                  </button>
                </form>
                {recommendation && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-8 p-6 bg-pink-50 dark:bg-gray-700 rounded-lg border border-pink-200 dark:border-pink-600 transition-colors duration-300"
                  >
                    <h3 className="text-xl font-bold text-pink-700 dark:text-pink-400 mb-4">
                      Your Personalized Diet Plan {phase && `(${phase} Phase)`}
                    </h3>
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {formatResponse(recommendation)}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
    );
};

export default DietPlan;
