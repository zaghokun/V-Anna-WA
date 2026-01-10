const sessions = new Map();

export const getSession = (userId) => {
    if (!sessions.has(userId)){
        sessions.set(userId, []);
    }
    return sessions.get(userId);
};

export const addMessageToSession = (userId, role, content) => {
    const history = getSession(userId);
    history.push({role, parts: [{ text: content }] });

    if (history.length > 20){
        history.shift();
    }
};

const userSettings = new Map();

export const setUserMode = (userId, mode) => {
    userSettings.set(userId, mode);
};

export const getUserMode = (userId) => {
    return userSettings.get(userId) || "auto";
}

export const clearSession = (userId) => {
    sessions.delete(userId);
}