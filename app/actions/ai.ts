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
Assume a slow, deliberate teaching pace to ensure students fully understand before moving on. For each subtopic, estimate the time it would take in minutes.
Return ONLY a valid JSON array of strings, where each string contains the subtopic followed by the duration in parentheses, like "(Xm)".
Do not include any Markdown formatting like \`\`\`json. Only return the raw JSON array.
Example: ["Introduction to concept (10m)", "Core principles (25m)", "Real-world examples (15m)", "Q&A (10m)"]`;

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
        const typeCounts: Record<string, number> = {};
        const topicCounts: Record<string, number> = {};
        signals.forEach(s => {
            typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
            if (s.active_topic) {
                topicCounts[s.active_topic] = (topicCounts[s.active_topic] || 0) + 1;
            }
        });
        const totalSignals = signals.length;

        const prompt = `You are an expert teaching assistant. The educator just finished a class session.
        
Agenda (topics planned):
${agenda.length > 0 ? agenda.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'No specific agenda provided.'}

Student Feedback Signals Collected (${totalSignals} total):
By Type:
${Object.entries(typeCounts).map(([type, count]) => `- "${type}": ${count} times`).join('\n') || 'No general signals recorded.'}
By Topic (Accurate):
${Object.entries(topicCounts).map(([topic, count]) => `- During "${topic}": ${count} signals`).join('\n') || 'No specific topic signals recorded.'}

Please write a concise, encouraging, and highly actionable 2-3 paragraph summary of the session. 
Focus on identifying what specific topics or moments might have caused confusion (based on the accurate topic signals) and give 1-2 practical tips for the next class. Do not use generic corporate jargon, speak directly to the teacher.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return { success: true, data: text };

    } catch (e: any) {
        console.error('AI Summary Error:', e);
        return { success: false, error: e.message || 'Failed to generate summary via AI.' };
    }
}

export async function generateRemediation(agenda: string[], signals: any[]): Promise<{ success: boolean; data?: string; error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: 'AI API key not configured.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { temperature: 0.7 },
        });

        // Format signals for the prompt
        const typeCounts: Record<string, number> = {};
        const topicCounts: Record<string, number> = {};
        signals.forEach(s => {
            typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
            if (s.active_topic) {
                topicCounts[s.active_topic] = (topicCounts[s.active_topic] || 0) + 1;
            }
        });
        const totalSignals = signals.length;

        const prompt = `You are a helpful teaching assistant writing an email to a class of students.
The educator just finished a class session.
        
Agenda (topics covered):
${agenda.length > 0 ? agenda.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'General classroom concepts'}

Student Feedback Signals Collected (${totalSignals} total marks of confusion):
By Type:
${Object.entries(typeCounts).map(([type, count]) => `- "${type}": ${count} times`).join('\n') || 'No specific confusion recorded.'}
By Topic (Accurate):
${Object.entries(topicCounts).map(([topic, count]) => `- During "${topic}": ${count} signals`).join('\n') || 'No specific topic signals recorded.'}

Task:
Draft a 2-3 paragraph encouraging review email to the class addressing the most confusing topics from today's session based strictly on the provided objective topic signals.
Then, include a highly relevant, 1-question multiple-choice diagnostic quiz at the end of the email to check their understanding of that confusing concept.

Format the response as plain text with clear spacing. Do NOT use markdown bolding (**) or hashtags.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return { success: true, data: text };

    } catch (e: any) {
        console.error('AI Remediation Error:', e);
        return { success: false, error: e.message || 'Failed to generate remediation via AI.' };
    }
}
