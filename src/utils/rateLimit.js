const userRequests = new Map();

const LIMIT_CONFIG = {
    MAX_REQUESTS: 2,
    WINDOW_MS: 60 * 1000
};

export const checkRateLimit = (userId) => {
    const now = Date.now();

    if (!userRequests.has(userId)){
        userRequests.set(userId, {count: 1, resetTime: now+LIMIT_CONFIG.WINDOW_MS});
        return { allowed: true };
    }

    let userData = userRequests.get(userId);

    if(now>userData.resetTime){
        userData = {count: 1, resetTime: now+LIMIT_CONFIG.WINDOW_MS};
        userRequests.set(userId, userData);
        return { allowed : true };
    }

    if (userData.count >= LIMIT_CONFIG.MAX_REQUESTS){
        const timeLeft = Math.ceil((userData.resetTime - now) / 1000);
        return { allowed : false, timeLeft};
    }

    userData.count++;
    return{allowed: true}
}