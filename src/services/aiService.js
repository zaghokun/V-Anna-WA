import { GoogleGenerativeAI } from "@google/generative-ai";
import setting from "../../setting.js";
import { getSystemInstruction } from "../prompts/promptFactory.js";
import { getSession, addMessageToSession, getUserMode } from "../memory/sessionStore.js";

const genAI = new GoogleGenerativeAI(setting.geminiApiKey);

export async function generateAIReply({ userId, message, mode = "default" }){
    try{
        const userPref = getUserMode(userId)

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: getSystemInstruction(userPref)
        });

        const history = getSession(userId);

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
        console.error("AI Service Error:", error);
        throw new Error("Gagal mendapatkan respon AI.");
    }
}