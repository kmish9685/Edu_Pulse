'use server'

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with the key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateAgenda(topic: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: 'AI API key not configured. Please add GEMINI_API_KEY to your env.' };
    }

    if (!topic || topic.trim().length === 0) {
        return { success: false, error: 'Please provide a topic.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json',
            },
        });

        const prompt = `You are an expert educator. The user is teaching a class on the topic: "${topic}".
Generate a concise, logical agenda of 3 to 5 subtopics. 
Return ONLY a valid JSON array of strings, where each string is a subtopic. 
Do not include any Markdown formatting like \`\`\`json. Only return the raw JSON array.
Example: ["Introduction to concept", "Core principles", "Real-world examples", "Q&A"]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Safely parse the JSON
        try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return { success: true, data: parsed };
            }
            return { success: false, error: 'AI returned an invalid format.' };
        } catch (e) {
            console.error('Failed to parse AI response:', text);
            return { success: false, error: 'AI returned unparseable content.' };
        }
    } catch (e: any) {
        console.error('AI Generation Error:', e);
        return { success: false, error: e.message || 'Failed to generate agenda via AI.' };
    }
}

export async function generateSummary(agenda: string[], signals: any[]): Promise<{ success: boolean; data?: string; error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: 'AI API key not configured.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { temperature: 0.7 },
        });

        // Format signals for the prompt
        const signalCounts: Record<string, number> = {};
        signals.forEach(s => {
            signalCounts[s.type] = (signalCounts[s.type] || 0) + 1;
        });
        const totalSignals = signals.length;

        const prompt = `You are an expert teaching assistant. The educator just finished a class session.
        
Agenda (topics planned):
${agenda.length > 0 ? agenda.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'No specific agenda provided.'}

Student Feedback Signals Collected (${totalSignals} total):
${Object.entries(signalCounts).map(([type, count]) => `- "${type}": ${count} times`).join('\n') || 'No confusion signals recorded!'}

Please write a concise, encouraging, and highly actionable 2-3 paragraph summary of the session. 
Focus on identifying what specific topics or moments might have caused confusion (based on the signals) and give 1-2 practical tips for the next class. Do not use generic corporate jargon, speak directly to the teacher.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return { success: true, data: text };

    } catch (e: any) {
        console.error('AI Summary Error:', e);
        return { success: false, error: e.message || 'Failed to generate summary via AI.' };
    }
}

