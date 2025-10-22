import { GoogleGenAI } from "@google/genai";

// FIX: Aligned with coding guidelines. Removed intermediate API_KEY variable and redundant checks.
// The API key must be obtained exclusively from the environment variable `process.env.API_KEY`.
// Assume this variable is pre-configured, valid, and accessible.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPrompt = (text: string, context: string): string => {
    let promptContext = '';
    switch(context) {
        case 'summary':
            promptContext = 'a professional summary for a CV';
            break;
        case 'experience':
            promptContext = 'a job description for a CV, highlighting achievements and skills';
            break;
        default:
            promptContext = 'a piece of text for a CV';
    }

    return `You are a professional resume writer and career coach.
    Rewrite the following text to be more impactful and professional for ${promptContext}.
    Focus on action verbs, quantifiable achievements, and concise language.
    Do not add any introductory phrases like "Here's the rewritten text:".
    Return only the rewritten text.

    Original text: "${text}"`;
}

export const improveWithAI = async (text: string, context: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: getPrompt(text, context),
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content from AI.");
    }
};
