import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 读取 API Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const identifyCatBreed = async (base64Image: string): Promise<any> => {
  // 2. 使用最稳定的模型名称
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = "Identify the cat breed. Return JSON with fields: name, description, personality, priceRange, affectionLevel, energyLevel, matchConfidence";

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
  
  // 3. 增加一层保护，防止因为 AI 返回格式不对导致白屏
  try {
    const data = JSON.parse(text.replace(/```json|```/g, ''));
    return {
      ...data,
      imageUrl: `data:image/jpeg;base64,${base64Image}`
    };
  } catch (e) {
    return {
      name: "识别中",
      description: "请再试一次",
      imageUrl: `data:image/jpeg;base64,${base64Image}`
    };
  }
};
