const sessions = new Map();
const userSettings = new Map();

export const getSession = (userId) => {
    if (!sessions.has(userId)){
        sessions.set(userId, []);
    }

    let history = sessions.get(userId);

    // Rule Gemini: History tidak boleh kosong diawali 'model', 
    // dan tidak diakhiri 'user' (artinya sesi sebelum gagal/crash).
    // Jika sesi sebelumnya crash (terakhir 'user'), buang pesan terakhir biar tidak error.

    if (history.length > 0 && history[history.length -1].role === "user") {
        console.log(`[SESSION-FIX] Memperbaiki history corrupt untuk user: ${userId}`);
        history.pop;
    }

    return history;
};

export const addMessageToSession = (userId, role, content) => {
    let history = getSession(userId);

    if(history.length > 0){
        const lastMsg = history[history.length - 1];
        if (lastMsg.role === role && lastMsg.parts[0].text === content){
            return;
        }
    }

    history.push({ role, parts: [{ text: content }] });
    
    if (history.length > 20){{
        history.shift();
    }}

};

export const setUserMode = (userId, mode) => {
    userSettings.set(userId, mode);
};

export const getUserMode = (userId) => {
    return userSettings.get(userId) || "auto";
}

export const clearSession = (userId) => {
    sessions.delete(userId);
}