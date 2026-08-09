const { GoogleGenAI } = require("@google/genai");

let genAI = null;
if (process.env.AI_API_KEY) {
    try {
        genAI = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
    } catch (err) {
        console.warn("Gemini client initialization skipped");
    }
}

const CATEGORIES = [
    "Roads",
    "Water",
    "Electricity",
    "Garbage",
    "Street Lights",
    "Education",
    "Healthcare",
    "Other"
];

// Simple Category Suggestion Handler
const suggestCategory = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description || description.trim().length === 0) {
            return res.status(400).json({ success: false, message: "Description is required" });
        }

        let suggestedCategory = "Other";

        // Try Gemini API if key exists
        if (process.env.AI_API_KEY && genAI) {
            try {
                const prompt = `Analyze this civic petition description and suggest EXACTLY ONE category from this list: ["Roads", "Water", "Electricity", "Garbage", "Street Lights", "Education", "Healthcare", "Other"]. Return ONLY the single category name.\n\nDescription: "${description}"`;
                
                const response = await genAI.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt
                });

                const text = response.text?.trim() || "";
                const matched = CATEGORIES.find((c) => text.toLowerCase().includes(c.toLowerCase()));
                if (matched) suggestedCategory = matched;
            } catch (err) {
                console.warn("AI API fallback used:", err.message);
            }
        }

        // Rule-based fallback if AI API fails or key is missing
        if (suggestedCategory === "Other") {
            const lower = description.toLowerCase();
            if (lower.includes("road") || lower.includes("pothole") || lower.includes("traffic")) suggestedCategory = "Roads";
            else if (lower.includes("water") || lower.includes("leak") || lower.includes("pipe") || lower.includes("drain")) suggestedCategory = "Water";
            else if (lower.includes("light") || lower.includes("lamp") || lower.includes("dark")) suggestedCategory = "Street Lights";
            else if (lower.includes("power") || lower.includes("electric") || lower.includes("voltage") || lower.includes("wire")) suggestedCategory = "Electricity";
            else if (lower.includes("garbage") || lower.includes("waste") || lower.includes("trash") || lower.includes("clean")) suggestedCategory = "Garbage";
            else if (lower.includes("school") || lower.includes("education") || lower.includes("college") || lower.includes("student")) suggestedCategory = "Education";
            else if (lower.includes("hospital") || lower.includes("doctor") || lower.includes("health") || lower.includes("clinic")) suggestedCategory = "Healthcare";
        }

        res.json({
            success: true,
            suggestedCategory
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    suggestCategory
};
