import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { CatBreed } from "../types";

// 正确读取 Vercel 环境变量
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const identifyCatBreed = async (base64Image: string): Promise<CatBreed> => {
  const prompt = "Identify the cat breed in this image and provide detailed characteristics. Return the result in a structured JSON format.";
  
  // 使用更稳定的 1.5 flash 模型
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          personality: { type: SchemaType.STRING },
          priceRange: { type: SchemaType.STRING },
          affectionLevel: { type: SchemaType.NUMBER },
          energyLevel: { type: SchemaType.NUMBER },
          matchConfidence: { type: SchemaType.NUMBER }
        },
        required: ["name", "description", "personality", "priceRange", "affectionLevel", "energyLevel", "matchConfidence"]
      }
    }
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image
      }
    },
    { text: prompt }
  ]);

  const response = await result.response;
  const data = JSON.parse(response.text());
  
  return {
    ...data,
    imageUrl: `data:image/jpeg;base64,${base64Image}`
  };
};
