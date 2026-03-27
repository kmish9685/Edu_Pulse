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
                // Fix for historical data: strip [Student Name] if it accidentally leaked into active_topic
                const cleanTopic = s.active_topic.replace(/^\[.*?\]\s*/, '').trim() || 'General';
                topicCounts[cleanTopic] = (topicCounts[cleanTopic] || 0) + 1;
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
                // Fix for historical data: strip [Student Name] if it accidentally leaked into active_topic
                const cleanTopic = s.active_topic.replace(/^\[.*?\]\s*/, '').trim() || 'General';
                topicCounts[cleanTopic] = (topicCounts[cleanTopic] || 0) + 1
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

📚 Session Summary — [Insert Overall Class Topic/Name] ([Insert Today's Date as: March 18, 2026])
🔴 Most confused topics:
• [Insert Topic 1 with the highest signals]: [Insert Number] signals
• [Insert Topic 2]: [Insert Number] signals

📖 Key points to review:
[For EACH confused topic, write a clear, empathetic plain-language explanation as if speaking to a student who is genuinely struggling. Break the concept down into 2-3 simple, digestible steps. Be specific and concrete. Avoid textbook definitions and corporate jargon.]

➡️ Step-by-Step Breakdown:
[For EACH confused topic, provide a simple, numbered 2-3 step process that a student can follow to apply or understand the concept. Focus on "how to do it" or "how it works" in a practical sense.]

💡 Concept Analogies (Real-World Examples):
[For EACH confused topic, write one everyday real-world analogy that makes the concept click intuitively. The analogy must be culturally accessible and require zero background knowledge. Format as:
• [Topic Name]: [Analogy — start with "Think of it like..." or "Imagine..."]
The goal is an "aha!" moment — the student should say "oh THATS what it means" after reading it.]

🎥 Helpful resources:
[Use the teacher-provided resources if any were given above. List each on its own line starting with •. If no resources provided, suggest descriptive resource titles only (e.g., "YouTube: Recursion Explained Simply — search on YouTube"). Do NOT fabricate URLs.]

❓ Practice questions:
Q1. [Write a multiple-choice question targeting the FIRST most confused topic. Ensure the question is clear, unambiguous, and has one unequivocally correct answer. Include 4 options labeled A, B, C, D]
Answer: [State correct answer letter and explain in one sentence WHY it is correct and why the others are wrong]

Q2. [Write a multiple-choice question targeting the SECOND most confused topic OR a different aspect of the first. Ensure the question is clear, unambiguous, and has one unequivocally correct answer. Include 4 options labeled A, B, C, D]
Answer: [State correct answer letter and explain in one sentence WHY it is correct]

Q3. [Write a harder short-answer or true/false question that requires the student to APPLY the concept, not just recall it. Make it slightly harder than Q1 and Q2.]
Answer: [Provide a model answer in 2-3 sentences that a student can compare their response against]

🧠 Try to explain it:
Before you move on, close this and try to explain the most confused topic to an imaginary friend in your own words. If you can teach it, you've learned it. If you can't, re-read the key points above.
—Sent via EduPulse | edupulse.app`;

        const result = await model.generateContent(prompt)
        const text = result.response.text()

        return { success: true, data: text };

    } catch (e: any) {
        console.error('AI Remediation Error:', e);
        return { success: false, error: e.message || 'Failed to generate remediation via AI.' };
    }
}
export async function checkDeepDoubtSpam(text: string): Promise<{ success: boolean; isSpam: boolean; category: 'academic' | 'noise' | 'spam'; error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, isSpam: false, category: 'academic', error: 'AI API key not configured.' };
    }

    if (!text || text.trim().length === 0) {
        return { success: false, isSpam: true, category: 'spam', error: 'Empty text.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.1, // Low temp for classification
                responseMimeType: 'application/json',
            },
        });

        const prompt = `You are an automated classroom moderator. Categorize the following student doubt into one of three categories:
1. "academic": A genuine question or comment related to learning, subjects, or the class.
2. "noise": Casual chatter, greetings (hi, hello), or non-disruptive off-topic comments.
3. "spam": Disruptive behavior, repeated gibberish, offensive language, or deliberate trolling to ruin the class.

Student Text: "${text}"

Return ONLY a valid JSON object with two fields:
{
  "isSpam": boolean (true if category is "spam", false otherwise),
  "category": "academic" | "noise" | "spam"
}
Do not include any other text or formatting.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            const parsed = JSON.parse(responseText);
            return {
                success: true,
                isSpam: parsed.isSpam === true,
                category: parsed.category || 'academic'
            };
        } catch (e) {
            console.error('Failed to parse spam check response:', responseText);
            return { success: true, isSpam: false, category: 'academic' }; // Default to safe if AI fails
        }
    } catch (e: any) {
        console.error('AI Spam Check Error:', e);
        return { success: false, isSpam: false, category: 'academic', error: e.message };
    }
}

/**
 * validateDeepDoubt — Used for the "Pending Doubt" system.
 * More detailed than checkDeepDoubtSpam. Returns a confidence score and reason.
 * This runs BEFORE saving a doubt to the pending queue.
 */
export async function validateDeepDoubt(text: string): Promise<{
    success: boolean;
    isValid: boolean;
    confidence: number; // 0-100, how genuine the academic doubt is
    reason?: string; // Why it was rejected (if invalid)
    error?: string;
}> {
    if (!process.env.GEMINI_API_KEY) {
        // Fail open — let it through if AI is unavailable
        return { success: true, isValid: true, confidence: 70 };
    }

    if (!text || text.trim().length < 5) {
        return { success: true, isValid: false, confidence: 0, reason: 'Message too short to be a genuine doubt.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json',
            },
        });

        const prompt = `You are an academic content moderator for a university classroom tool. A student was rate-limited (clicked confused too many times on one topic) and was offered a text box to write a serious doubt. Evaluate if the message below is:
- A VALID doubt: a genuine question or confusion about academic content, a subject, a formula, a concept, or the class material.
- INVALID: offensive language, profanity, gibberish, spam, non-academic off-topic comment, social chat, or empty.

Student Message: "${text}"

Return ONLY valid JSON with these fields:
{
  "isValid": boolean,
  "confidence": number (0-100, score of how genuinely academic this doubt is),
  "reason": string (if isValid is false, the short reason for rejection, e.g., "Offensive language detected" or "Not related to academic content"; if isValid is true, leave as "")
}
Do not include any other text.`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        try {
            const parsed = JSON.parse(responseText);
            return {
                success: true,
                isValid: parsed.isValid === true,
                confidence: Math.min(100, Math.max(0, parseInt(parsed.confidence) || 0)),
                reason: parsed.reason || undefined,
            };
        } catch {
            return { success: true, isValid: true, confidence: 60 }; // Default safe
        }
    } catch (e: any) {
        console.error('AI Doubt Validation Error:', e);
        return { success: true, isValid: true, confidence: 60, error: e.message }; // Fail open
    }
}

/**
 * enhanceDoubt — Transforms a rough student question into a clear, professional academic question.
 * Used to help teachers understand student struggles better.
 */
export async function enhanceDoubt(text: string): Promise<{ success: boolean; data?: string; error?: string }> {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: 'AI API key not configured.' };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.3,
            },
        });

        const prompt = `You are an academic TA helping explain student doubts clearly to a teacher.
The student has provided a rough, potentially unclear doubt about a class concept.
Your task is to rewrite it as a professional, specific, and academically phrased question that a teacher can easily address.

Student Text: "${text}"

Rules:
1. Maintain the original intent of the student's question.
2. Make it clear and grammatically correct.
3. Use academic terminology if appropriate.
4. Keep it concise (max 2 sentences).
5. If the student text is already clear, just refine it slightly.

CRITICAL SAFETY RULE:
If the student text is gibberish (e.g. "bkb", "asdf"), a simple greeting ("hi", "hello"), or clearly not related to academic study, return EXACTLY this string: "REJECT: This content is not a genuine academic doubt."

Return ONLY the enhanced question text or the REJECT string. No quotes.`;

        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();
        
        // Remove markdown or quotes if present
        textResponse = textResponse.replace(/^["']|["']$/g, '');

        if (textResponse.includes('REJECT:')) {
            return { success: false, error: textResponse.replace('REJECT:', '').trim() };
        }

        return { success: true, data: textResponse };
    } catch (e: any) {
        console.error('AI Enhancement Error:', e);
        return { success: false, error: e.message || 'Failed to enhance doubt.' };
    }
}
