import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("⚠️ Gemini API Key is missing. Using mock responses.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "TEST_KEY");

// Intelligent mock fallback for when API is not accessible
function getMockResponse(prompt: string, context?: string): string {
    const lowerPrompt = prompt.toLowerCase();

    // Parse context for medicines and activities
    const medicines = context?.match(/- (.*?) \((.*?)\): (\d+) left/g) || [];
    const activities = context?.match(/- (.*?) at (.*?) \(Status: (.*?)\)/g) || [];

    if (lowerPrompt.includes('medicine') || lowerPrompt.includes('stock') || lowerPrompt.includes('medication')) {
        if (medicines.length === 0) {
            return "You currently don't have any medicines tracked in your system. Would you like me to help you add your medicines?";
        }
        let response = "Based on your records, here are your medicines:\n\n";
        medicines.forEach(med => {
            const match = med.match(/- (.*?) \((.*?)\): (\d+) left/);
            if (match) {
                const [, name, dosage, stock] = match;
                const stockNum = parseInt(stock);
                if (stockNum < 10) {
                    response += `⚠️ ${name} (${dosage}): ${stock} tablets - Low stock! Please refill soon.\n`;
                } else {
                    response += `✓ ${name} (${dosage}): ${stock} tablets\n`;
                }
            }
        });
        return response + "\n Would you like me to remind you to refill any of these?";
    }

    if (lowerPrompt.includes('activit') || lowerPrompt.includes('task') || lowerPrompt.includes('miss')) {
        if (activities.length === 0) {
            return "You don't have any activities scheduled for today. Would you like me to help you plan your day?";
        }
        let response = "Here's your activity status:\n\n";
        activities.forEach(act => {
            const match = act.match(/- (.*?) at (.*?) \(Status: (.*?)\)/);
            if (match) {
                const [, title, time, status] = match;
                const icon = status === 'Completed' ? '✓' : '○';
                response += `${icon} ${title} - ${time} (${status})\n`;
            }
        });
        return response + "\nWould you like me to reschedule any missed activities?";
    }

    if (lowerPrompt.includes('help') || lowerPrompt.includes('what can you')) {
        return "I'm Aayu, your health assistant! I can help you with:\n\n" +
            "💊 Medicine reminders and stock tracking\n" +
            "📋 Daily activity management\n" +
            "📊 Health reports and trends\n" +
            "🚨 Emergency contacts\n" +
            "📸 Medicine identification (camera mode)\n\n" +
            "Just ask me anything about your health routine!";
    }

    // General response
    return `I understand you're asking about "${prompt}". As your health assistant, I'm here to help with your medicines, activities, and health tracking. What would you like to know more about?`;
}

export async function getGeminiResponse(prompt: string, context?: string) {
    console.log("🔑 API Key loaded:", API_KEY ? `${API_KEY.substring(0, 10)}...` : "MISSING");

    if (!API_KEY || API_KEY === "TEST_KEY") {
        console.warn("⚠️ Using mock responses (API key not configured)");
        return getMockResponse(prompt, context);
    }

    try {
        console.log("🚀 Attempting Gemini API call with model: gemini-1.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let fullPrompt = "You are Aayu, a caring and helpful AI health assistant for an elderly person. Keep responses concise, warm, and supportive.";

        if (context) {
            fullPrompt += `\n\nContext Information:\n${context}`;
        }

        fullPrompt += `\n\nUser: ${prompt}\nAayu:`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        console.log("✅ Successfully received response from Gemini API");
        return text;
    } catch (error: any) {
        console.error("❌ Gemini API Error:", error.message);

        if (error.message?.includes("404")) {
            console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  GEMINI API NOT ENABLED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your API key is valid but doesn't have access to Gemini API.

FIX THIS:
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Generate API Key" again OR
3. Enable "Generative Language API" in Google Cloud Console
4. Replace the key in .env file

FALLBACK: Using intelligent mock responses for now.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            `);
        }

        // Fallback to mock response
        console.log("🔄 Falling back to mock response");
        return getMockResponse(prompt, context);
    }
}

// Convert File to GenerativePart for Gemini
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Content,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function analyzeMedicineImage(file: File) {
    if (!API_KEY || API_KEY === "TEST_KEY") {
        console.warn("⚠️ Using mock analysis (API key not configured)");
        return {
            name: "Pantoprazole 40mg (Mock)",
            dosage: "1 tablet",
            frequency: "daily",
            time: "08:00",
            stock: "30",
            withFood: true
        };
    }

    try {
        console.log("🚀 Analyzing image with Gemini...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imagePart = await fileToGenerativePart(file);
        const prompt = "Analyze this image of a medicine or prescription. Extract the following details as a VALID JSON object: name, dosage, frequency (daily, twice-daily, weekly), time (HH:MM format), stock (estimated count), withFood (boolean). If specific details are missing, make a reasonable guess based on standard usage. JSON ONLY, no markdown.";

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        console.log("✅ Analysis complete:", text);

        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error: any) {
        console.error("❌ Gemini Vision Error:", error);
        return null;
    }
}
