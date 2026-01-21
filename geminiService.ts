// 注意：这里删除了所有 import 语句，不再依赖插件包
export const identifyCatBreed = async (base64Image) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Identify the cat breed. Return JSON: { \"name\": \"...\", \"description\": \"...\", \"personality\": \"...\", \"priceRange\": \"...\", \"affectionLevel\": 5, \"energyLevel\": 80, \"matchConfidence\": 95 }" },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }]
    })
  });

  const resData = await response.json();
  const text = resData.candidates[0].content.parts[0].text;
  
  // 提取并解析 JSON
  const cleanedText = text.replace(/```json|```/g, '');
  const data = JSON.parse(cleanedText);

  return {
    ...data,
    imageUrl: `data:image/jpeg;base64,${base64Image}`
  };
};
