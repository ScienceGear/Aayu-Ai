import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY || "TEST_KEY");

export async function getGeminiResponse(prompt: string, context?: string) {
    try {
        // For free accounts from AI Studio, 'gemini-1.5-flash' is the standard model.
        // If this fails, we log the error to help debug.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        let fullPrompt = "You are Aayu, a caring and helpful AI health assistant for an elderly person. Keep responses concise, warm, and supportive.";

        if (context) {
            fullPrompt += `\n\nContext Information:\n${context}`;
        }

        fullPrompt += `\n\nUser: ${prompt}\nAayu:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "I'm having trouble connecting to my service right now. Please try again later.";
    }
}
