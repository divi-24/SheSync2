import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Gemini AI route called");
  try {
    const body = await req.json();
    const { prompt, model = "gemini-pro" } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "";
    
    if (!apiKey) {
      console.error("GOOGLE_API_KEY or GOOGLE_GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "API key not configured on server" },
        { status: 500 }
      );
    }

    console.log("Calling Gemini with model:", model);
    const genAI = new GoogleGenerativeAI(apiKey);
    const aiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
