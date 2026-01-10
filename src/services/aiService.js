import { GoogleGenerativeAI } from "@google/generative-ai";
import setting from "../../setting.js";
import { getSystemInstruction } from "../prompts/promptFactory.js";
import { getSession, addMessageToSession, getUserMode } from "../memory/sessionStore.js";

const genAI = new GoogleGenerativeAI(setting.geminiApiKey);

export async function generateAIReply({ userId, message}){
    try{
        const userPref = getUserMode(userId);

        const history = getSession(userId);

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: getSystemInstruction(userPref)
        });

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const replyText = response.text();

        addMessageToSession(userId, "user", message);
        addMessageToSession(userId, "model", replyText);

        return replyText;

    }catch (error) {
        console.error("❌ AI Service Error:", error);
        if (error.message.includes("SAFETY")) {
            return "Waduh, pertanyaan kamu terlalu berbahaya buat aku jawab 🙈";
        }
        
        return "Maaf, koneksi ke otak AI lagi putus-nyambung. Coba tanya lagi ya!";
    }
}