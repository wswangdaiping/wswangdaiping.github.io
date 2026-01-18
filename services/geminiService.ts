
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const summarizeContent = async (content: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please provide a concise summary (max 3 sentences) of the following content: \n\n${content}`,
    config: {
      temperature: 0.7,
    },
  });
  return response.text;
};

export const suggestTitleAndTags = async (content: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following content, suggest a short catchy title and 3 relevant tags. Return in JSON format. \n\nContent: ${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "tags"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { title: "Untitled", tags: [] };
  }
};

export const chatWithKnowledge = async (query: string, context: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Context: ${context}\n\nUser Question: ${query}`,
    config: {
      systemInstruction: "You are a helpful assistant for a personal blog and note app. Use the provided context to answer the user's questions about their own writings. Be concise and personal.",
    }
  });
  return response.text;
};
