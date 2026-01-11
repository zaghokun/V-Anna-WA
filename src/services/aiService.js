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

export async function summarizeSession(userId) {
    try{
        const history = getSession(userId);

        if(!history || history.length === 0){
            return "Belum ada percakapan yang bisa diringkas";
        }

        const conversationText = history.map(msg => {
            const role = msg.role === "user" ? "User" : "Bot";
            const text = msg.parts[0].text;
            return `${role}: ${text}`;
        }).join("\n");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        Berikut adalah transkrip percakapan antara User dan Bot (V-Anna).
        Tugasmu: Buat ringkasan singkat (maksimal 3 poin utama) tentang apa yang dibicarakan.

        TRANSKRIP:
        ${conversationText}
        
        RINGKASAN:`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Summary Error:", error);
        return "Gagal membuat ringkasan. Mungkin chatnya kepanjangan.";
    }
}