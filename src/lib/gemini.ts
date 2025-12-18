// OpenRouter API Configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const MODEL = "google/gemini-2.0-flash-exp:free";

// Intelligent mock fallback for when API is not accessible
function getMockResponse(prompt: string, context?: string): string {
    const lowerPrompt = prompt.toLowerCase();

    // Parse context for medicines and activities
    const medicines: string[] = context?.match(/- (.*?) \((.*?)\): (\d+) units/g) || [];
    const activities: string[] = context?.match(/- (.*?) at (.*?) \(Status: (.*?)\)/g) || [];

    if (lowerPrompt.includes('medicine') || lowerPrompt.includes('stock') || lowerPrompt.includes('medication')) {
        if (medicines.length === 0) {
            return "You currently don't have any medicines tracked in your system. Would you like me to help you add your medicines?";
        }
        let response = "Based on your records, here are your medicines:\n\n";
        medicines.forEach(med => {
            const match = med.match(/- (.*?) \((.*?)\): (\d+) units/);
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

    return "I'm Aayu, your health assistant! I'm currently having trouble connecting to my main brain, so I'm using my backup logic. How can I help you with your health routine today?";
}

export async function getGeminiResponse(prompt: string, context?: string) {
    if (!OPENROUTER_API_KEY) {
        console.warn("⚠️ OpenRouter API Key is missing. Using mock responses.");
        return getMockResponse(prompt, context);
    }

    try {
        console.log("🚀 Calling OpenRouter API with model:", MODEL);

        const systemPrompt = `You are Aayu, a caring and helpful AI health assistant for an elderly person. 
        You have access to the user's health profile, medicines, exercises, and daily activities.
        Keep responses warm, supportive, and relatively concise. 
        IMPORTANT: Always respond ONLY in the language specified in the context info. 
        If no language is specified, default to English. 
        Use the context data to give specific advice.
        If you see any health issues, be empathetic and suggest contacting their caregiver if it seems urgent.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.origin || "http://localhost:3000",
                "X-Title": "Aayu Connect Assist",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: context ? `Context Data:\n${context}\n\nUser Question: ${prompt}` : prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`❌ OpenRouter API Error (Status ${response.status}):`, errorBody);

            // If the free model is busy (429 or 503), we could try a different one, 
            // but for now we just throw to trigger the mock fallback with a clear log
            throw new Error(`OpenRouter returned ${response.status}`);
        }

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            console.log("✅ Successfully received response from OpenRouter");
            return data.choices[0].message.content;
        } else {
            console.error("❌ OpenRouter Empty Response:", data);
            throw new Error("No response content from OpenRouter");
        }
    } catch (error: any) {
        console.error("❌ AI Service Connection Failed:", error.message);
        // Special case: if it's a network error (cors/dns), log it clearly
        if (error.message.includes('fetch')) {
            console.error("🔍 Network Error: Please check your internet connection or CORS settings.");
        }
        return getMockResponse(prompt, context);
    }
}

// Convert File to Base64
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

export async function analyzeMedicineImage(file: File) {
    try {
        console.log("🚀 Analyzing image with OpenRouter (Gemini Vision)...");
        const base64Image = await fileToBase64(file);

        const prompt = "Analyze this image of a medicine or prescription. Extract the following details as a VALID JSON object: name, dosage, frequency (daily, twice-daily, weekly), time (HH:MM format), stock (estimated count), withFood (boolean). If specific details are missing, make a reasonable guess based on standard usage. JSON ONLY, no other text.";

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.origin,
                "X-Title": "Aayu AI Vision",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${file.type};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content;
        console.log("✅ Analysis complete:", text);

        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error: any) {
        console.error("❌ Vision Analysis Error:", error);
        return null;
    }
}

