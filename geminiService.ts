import { GoogleGenerativeAI } from "@google/generative-ai";
import { CatBreed } from "../types";

// 正确读取 Vercel 中的 API Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const identifyCatBreed = async (base64Image: string): Promise<CatBreed> => {
  const prompt = "Identify the cat breed in this image and provide detailed characteristics. Return the result in a structured JSON format.";
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  const text = response.text();
  
  // 这种写法能极大减少报错导致的白屏
  try {
    const data = JSON.parse(text);
    return {
      ...data,
      imageUrl: `data:image/jpeg;base64,${base64Image}`
    };
  } catch (e) {
    console.error("解析失败:", text);
    throw new Error("识别结果格式错误");
  }
};
