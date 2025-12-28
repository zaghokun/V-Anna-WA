import { GoogleGenerativeAI } from "@google/generative-ai";
import setting from "../../setting.js";
import { getPrompt } from "../prompts/promptFactory.js";

const genAI = new GoogleGenerativeAI(setting.geminiApiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateAIReply({ mode = "default", message }){
    try{
        const fullPrompt = getPrompt(mode, message);

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();

    }catch (error) {
        console.error("AI Service Error:", error);
        throw new Error("Gagal mendapatkan respon AI.");
    }
}