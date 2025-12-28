export const getPrompt = (mode, message) => {
    const prompts = {
        default: `Kamu adalah asisten WhatsApp bernama V-Anna. Jawablah dengan santai dan gunakan Bahasa Indonesia.`,
        tutor: `Kamu adalah guru yang sabar. Jangan langsung beri jawaban, tapi berikan petunjuk agar murid berpikir.`,
        gaul: `Lu adalah temen tongkrongan yang asik. Pake bahasa lo-gue dan singkatan gaul Jakarta.`
    };

    const selectedPrompt = prompts[mode] || prompts.default;
    return `${selectedPrompt}\n\nUser: ${message}\nAI:`;
};