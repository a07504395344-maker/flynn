export const identifyCatBreed = async (base64Image) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  // 使用更稳定的 API 路径
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: "Identify the cat breed. Return ONLY a JSON object with these fields: name, description, personality, priceRange, affectionLevel, energyLevel, matchConfidence. Do not include markdown formatting." },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }]
    })
  });

  const resData = await response.json();
  
  // 增加安全检查，防止 AI 返回空结果
  if (!resData.candidates || !resData.candidates[0]) {
    throw new Error("AI没有返回结果");
  }

  let text = resData.candidates[0].content.parts[0].text;
  
  // 核心修复：清理可能干扰解析的字符
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const cleanedJson = jsonMatch ? jsonMatch[0] : text;
  const data = JSON.parse(cleanedJson);

  return {
    ...data,
    imageUrl: `data:image/jpeg;base64,${base64Image}`
  };
};
