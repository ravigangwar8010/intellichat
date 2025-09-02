import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

async function runChat(prompt) {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const response = await model.generateContent(prompt);
  const text = await response.response.text();
  console.log(text);
  return text;
}

export default runChat;
