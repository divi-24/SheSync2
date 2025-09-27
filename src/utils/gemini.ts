import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerativeModel } from "@google/generative-ai";

// Use API key from environment variable for security
const GEMINI_API_KEY = "import.meta.env.VITE_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Helper function to build a concise, focused prompt for Gemini
interface ConversationMessage {
    role: "user" | "assistant";
    content: string;
}

function buildPrompt(
    conversationHistory: ConversationMessage[],
    communityContext: string = "General"
): string {
    const systemPrompt = `
You are Eve, an AI health assistant in the "${communityContext}" community forum of SheSync.
Your role is to provide accurate, empathetic, and helpful responses in a conversational, supportive, and friendly manner.
Always refer to yourself as "Eve". If the user wants to call you something else, kindly accept the name but stay in the Eve persona.
Keep answers concise, relevant, and tailored to the selected community context.
Never repeat yourself. If the user gives you a name, use it to address them kindly.
If the user is just making jokes or being silly, you can be lightly playful but always supportive and positive.
`;

    const contextString = conversationHistory
        .slice(-6)
        .map(msg => `${msg.role === "user" ? "User" : "Eve"}: ${msg.content}`)
        .join("\n");

    return `${systemPrompt}\nConversation so far:\n${contextString}\nEve:`;
}

// Generate a chat response using Gemini, now with context
export interface GenerateChatResponseParams {
    conversationHistory: ConversationMessage[];
    communityContext?: string;
}



export type GeminiModel = GenerativeModel;

export const generateChatResponse = async (
    conversationHistory: ConversationMessage[],
    communityContext: string = "General"
): Promise<string> => {
    try {
        const model: GeminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt: string = buildPrompt(conversationHistory, communityContext);

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        if (!response || response.trim().length === 0) {
            throw new Error("No response generated from Gemini API.");
        }

        return response.trim();
    } catch (error: unknown) {
        let errorMsg = "Sorry, I couldn't generate a response.";
        if (error && typeof error === 'object' && 'message' in error) {
            const message = (error as { message: string }).message;
            if (message.includes("429")) {
                errorMsg = "API limit reached. Please wait and try again later. (429 Quota Exceeded)";
            } else {
                errorMsg += `\n[Debug info: ${message}]`;
            }
        }
        console.error("Error generating AI response:", error);
        throw new Error(errorMsg);
    }
};

// Function to get community-specific conversation starters
export interface CommunityPrompts {
    [communityName: string]: string[];
}

export const getCommunityPrompts = (communityName: string): string[] => {
    const prompts: CommunityPrompts = {
        "Health & Wellness": [
            "What health topics would you like to discuss today?",
            "Have you noticed any changes in your health recently?",
            "What wellness goals are you working towards?"
        ],
        "Supportive Chat": [
            "How are you feeling today?",
            "Is there something on your mind you'd like to talk about?",
            "Would a supportive ear help right now?"
        ],
        "Learning & Growth": [
            "What are your current learning goals?",
            "Is there a topic you'd like to explore together?",
            "Do you want advice about study or self-development?"
        ]
    };

    return prompts[communityName] || [
        "How can I support you today?",
        "Is there a specific topic or question on your mind?",
        "Would you like tips, resources, or just someone to listen?"
    ];
};