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

export async function generateAgendaFromFile(base64Data: string, mimeType: string): Promise<{ success: boolean; data?: string[]; error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: 'AI API key not configured.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.2, // Low temperature for extraction fidelity
                responseMimeType: 'application/json',
            },
        });

        const prompt = `You are an expert educator. Extract a concise, logical agenda of 3 to 7 subtopics from this presentation document. 
Assume a slow, deliberate teaching pace to ensure students fully understand before moving on. For each subtopic, estimate the time it would take in minutes.
Return ONLY a valid JSON array of strings, where each string contains the subtopic followed by the duration in parentheses, like "(Xm)".
Example: ["Introduction to concept (10m)", "Core principles (25m)", "Real-world examples (15m)", "Q&A (10m)"]`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]);

        const text = result.response.text();

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
        console.error('AI File Generation Error:', e);
        return { success: false, error: e.message || 'Failed to extract agenda from document.' };
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

export async function generateRemediation(agenda: string[], signals: any[], teacherResources?: string): Promise<{ success: boolean; data?: string; error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: 'AI API key not configured.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { temperature: 0.7 },
        });

        // Format signals for the prompt
        const typeCounts: Record<string, number> = {}
        const topicCounts: Record<string, number> = {}
        signals.forEach(s => {
            typeCounts[s.type] = (typeCounts[s.type] || 0) + 1
            if (s.active_topic) {
                topicCounts[s.active_topic] = (topicCounts[s.active_topic] || 0) + 1
            }
        })
        const totalSignals = signals.length

        const resourceSection = teacherResources && teacherResources.trim().length > 0
            ? `Teacher-Provided Resources (USE THESE EXACT LINKS/TITLES — do not invent or modify them):
${teacherResources.trim()}`
            : `No resources provided by teacher. In the 🎥 Helpful resources section, suggest descriptive resource titles only (e.g., "YouTube: Linked Lists Explained — search on YouTube"). Do NOT fabricate any URLs.`

        const prompt = `You are a helpful teaching assistant writing a post-session student review.
        
Agenda (topics covered):
${agenda.length > 0 ? agenda.map((a, i) => `${i + 1}. ${a}`).join('\n') : 'General classroom concepts'}

Student Feedback Signals Collected (${totalSignals} total):
By Type:
${Object.entries(typeCounts).map(([type, count]) => `- "${type}": ${count} times`).join('\n') || 'No specific confusion recorded.'}
By Topic:
${Object.entries(topicCounts).map(([topic, count]) => `- During "${topic}": ${count} signals`).join('\n') || 'No specific topic signals recorded.'}

${resourceSection}

Task:
Draft a post-session review for students based strictly on the provided objective data.

You MUST use EXACTLY the following format. Do not use markdown bolding (**) or hashtags (#). Use the exact emojis shown.

📚 Session Summary — [Insert Overall Class Topic/Name] ([Insert Today's Date as: March 13, 2026])
🔴 Most confused topics:
• [Insert Topic 1 with the highest signals]: [Insert Number] signals
• [Insert Topic 2]: [Insert Number] signals
📖 Key points to review:
[A clear, plain-language explanation of each confused topic — write as if explaining to a student who is struggling. Be specific, not generic.]
🎥 Helpful resources:
[Use the teacher-provided resources if any were given above. List each on its own line starting with •. If no resources provided, suggest descriptive search titles only.]
❓ Practice questions (3 questions):
Q1. [Write a multiple-choice question targeting the FIRST most confused topic. Include 4 options labeled A, B, C, D]

Q2. [Write a multiple-choice question targeting the SECOND most confused topic OR a different aspect of the first. Include 4 options labeled A, B, C, D]

Q3. [Write a short-answer or true/false question testing deeper understanding. Make it slightly harder than Q1 and Q2.]
—Sent via EduPulse | edupulse.app`;

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        return { success: true, data: text };

    } catch (e: any) {
        console.error('AI Remediation Error:', e);
        return { success: false, error: e.message || 'Failed to generate remediation via AI.' };
    }
}
