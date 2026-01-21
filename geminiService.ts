import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { CatBreed } from "../types";

// 使用 import.meta.env 正确读取 Vercel 中的环境变量
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const identifyCatBreed = async (base64Image: string): Promise<CatBreed> => {
  const prompt = "Identify the cat breed in this image and provide detailed characteristics. Return the result in a structured JSON format.";
  
  const response = await ai.getGenerativeModel({ 
    model: 'gemini-1.5-flash' 
  }).generateContent({
    contents: [
      {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          personality: { type: SchemaType.STRING },
          priceRange: { type: SchemaType.STRING },
          affectionLevel: { type: SchemaType.NUMBER, description: "1-5 scale" },
          energyLevel: { type: SchemaType.NUMBER, description: "1-100 scale" },
          matchConfidence: { type: SchemaType.NUMBER, description: "1-100 scale" }
        },
        required: ["name", "description", "personality", "priceRange", "affectionLevel", "energyLevel", "matchConfidence"]
      }
    }
  });

  const text = response.response.text();
  const data = JSON.parse(text || "{}");
  
  return {
    ...data,
    imageUrl: `data:image/jpeg;base64,${base64Image}`
  };
};
