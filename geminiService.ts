import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 读取 API Key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const identifyCatBreed = async (base64Image) => {
  // 2. 使用最稳定的模型
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
  
  // 3. 容错处理
  try {
    const cleanedText = text.replace(/```json|```/g, '');
    const data = JSON.parse(cleanedText);
    return {
      ...data,
      imageUrl: `data:image/jpeg;base64,${base64Image}`
    };
  } catch (e) {
    console.error("Parse error:", e);
    return {
      name: "识别失败",
      description: "解析返回数据时出错，请重试",
      imageUrl: `data:image/jpeg;base64,${base64Image}`
    };
  }
};
