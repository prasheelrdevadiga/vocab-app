// app/api/vocabulary/route.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");

  if (!word) {
    return Response.json({ error: "No word provided." }, { status: 400 });
  }

  const prompt = `Explain the English word "${word}" in detail.

Respond ONLY in this exact JSON format with no extra text before or after:
{
  "word": "${word}",
  "pronunciation": "/pronunciation/",
  "partOfSpeech": "noun",
  "difficulty": "medium",
  "meaning": "Clear detailed definition in 2-3 sentences.",
  "explanation": "Thorough explanation of usage, nuances, origin, and what makes this word special. Write 3-4 sentences.",
  "examples": [
    "First complete example sentence.",
    "Second example sentence in a different context.",
    "Third example sentence.",
    "Fourth example sentence.",
    "Fifth example sentence.",
    "Sixth example sentence."
  ],
  "synonyms": ["word1", "word2", "word3"],
  "antonyms": ["word1", "word2"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1200,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const data = JSON.parse(jsonMatch[0]);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate explanation. Try again." }, { status: 500 });
  }
}