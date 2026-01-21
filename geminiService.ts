import { GoogleGenerativeAI } from "@google/generative-ai";
import { CatBreed } from "../types";

// 读取环境变量
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const identifyCatBreed = async (base64Image: string): Promise<CatBreed> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = "Identify the cat breed in this image. Return JSON: { \"name\": \"breed name\", \"description\": \"...\", \"personality\": \"...\", \"priceRange\": \"...\", \"affectionLevel\": 5, \"energyLevel\": 80, \"matchConfidence\": 95 }";

  const result = await model.generateContent([
    { inlineData: { mimeType: "image/jpeg", data: base64Image } },
    { text: prompt }
  ]);

  const response = await result.response;
  const data = JSON.parse(response.text());
  
  return {
    ...data,
    imageUrl: `data:image/jpeg;base64,${base64Image}`
  };
};
