export const shouldCallAI = (text) => {
    if (!text) return false;

    const cleanText = text.trim().toLowerCase();

    if (cleanText.length < 3) return false;

    const ignoredWords = [
        "oke", "siap", "mantap", "wkwk", "wkwkwk", "hehe", "hmmm", 
        "waduh", "anjir", "gila", "bisa", "enggak", "tidak"
    ];
    
    if (ignoredWords.includes(cleanText)) return false;

    return true;
}