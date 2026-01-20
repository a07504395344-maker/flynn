
import { GoogleGenAI, Type } from "@google/genai";
import { CatBreed } from "./types";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const identifyCatBreed = async (base64Image: string): Promise<CatBreed> => {
  const prompt = "Identify the cat breed in this image and provide detailed characteristics. Return the result in a structured JSON format.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          personality: { type: Type.STRING },
          priceRange: { type: Type.STRING },
          affectionLevel: { type: Type.NUMBER, description: "1-5 scale" },
          energyLevel: { type: Type.NUMBER, description: "1-100 scale" },
          matchConfidence: { type: Type.NUMBER, description: "1-100 scale" }
        },
        required: ["name", "description", "personality", "priceRange", "affectionLevel", "energyLevel", "matchConfidence"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  return {
    ...data,
    imageUrl: `data:image/jpeg;base64,${base64Image}`
  };
};
