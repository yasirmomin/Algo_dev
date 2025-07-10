const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const getCodeFeedback = async (req, res) => {
    const { code, problemName } = req.body;
    if (code === undefined || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Empty Code! Please Provide some code"
        });
    }
    try {
        const ai = new GoogleGenAI({ apikey: process.env.GEMINI_API_KEY });

        async function main() {
            const prompt = `Problem: ${problemName}
User's Code:
${code}

Give short, clear feedback under these points:
- Readability
- Performance
- Logical issues (if any)

Use bullet points only.`;


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

const getCodeHint = async (req, res) => {
    const { code, problemName, problemDescription } = req.body;

    if (!code?.trim() || !problemName?.trim()) {
        return res.status(400).json({
            success: false,
            error: "Code or problem info missing.",
        });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY1 });

        const prompt = `Problem: ${problemName}
Description: ${problemDescription}

User's code:
${code}

Give the user 2-3 crisp HINTS (not full solutions) to solve the above problem.
Keep it short and precise, and DO NOT reveal the full solution.
Output only the hints in bullet points.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });

        const hints = response.candidates[0].content.parts[0].text;
        return res.json({ success: true, hints });
    } catch (error) {
        console.error("AI Hint Error:", error.message);
        return res.status(500).json({ success: false, error: "AI hint failed." });
    }
};

const getTimeComplexity= async (req,res)=>{
    const {code}=req.body;
    if (code === undefined || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Empty Code! Please Provide some code"
        });
    }
    try {
        const ai = new GoogleGenAI({ apikey: process.env.GEMINI_API_KEY2});

        async function main() {
            const prompt = `User's Code:${code}
Give the time complexity in one line only no further talks`;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    { parts: [{ text: prompt }] }
                ]
            });

            return response.candidates[0].content.parts[0].text;
        }

        const complexity = await main();
        return res.json({
            success: true,
            complexity
        });

    } catch (error) {
        console.error("Error executing code", error.message)
    }
}

module.exports = { getCodeFeedback, getCodeHint,getTimeComplexity };