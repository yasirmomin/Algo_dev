const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const getCodeFeedback = async (req, res) => {
    const { code } = req.body;
    if (code === undefined || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Empty Code! Please Provide some code"
        });
    }
    try {
        const ai = new GoogleGenAI({ apikey: process.env.GEMINI_API_KEY });

        async function main() {
            const prompt = `You are an expert code reviewer.
            Here is the user's code:
            ${code}
            Please provide suggestions to improve:
            - Readability
            - Performance
            - Correctness

            Format your answer in bullet points and keep it very short and crisp.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            });

            return response.candidates[0].content.parts[0].text;
        }

        const feedback = await main();
        return res.json({
            success: true,
            feedback
        });

    } catch (error) {
        console.error("Error executing code", error.message)
    }
}

module.exports = { getCodeFeedback };