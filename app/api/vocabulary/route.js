// app/api/vocabulary/route.js
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DIFFICULTY_PROMPTS = {
  easy: "a common everyday English word suitable for a 10-year-old (like: happy, forest, brave, gentle, wisdom)",
  medium: "an intermediate English word used in newspapers or academic writing (like: ambiguous, persist, eloquent, candid)",
  advanced: "an advanced sophisticated English word used in literature or academia (like: ephemeral, perspicacious, sanguine, mellifluous)",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty") || "medium";
  const mode = searchParams.get("mode") || "ai";
  const localWord = searchParams.get("word");
  const difficultyHint = DIFFICULTY_PROMPTS[difficulty] || DIFFICULTY_PROMPTS.medium;

  let seenWords = [];
  try {
    seenWords = JSON.parse(searchParams.get("seen") || "[]");
  } catch {}

  const avoidClause = seenWords.length > 0
    ? `\n\nIMPORTANT: Do NOT use any of these words that the user has already seen: ${seenWords.join(", ")}. Pick a completely different word.`
    : "";

  const prompt = mode === "local" && localWord
  ? `Give me detailed vocabulary information for the English word "${localWord}".

Respond ONLY in this exact JSON format:
{
  "word":"${localWord}",
  "pronunciation":"/pronunciation/",
  "partOfSpeech":"noun",
  "difficulty":"${difficulty}",
  "meaning":"Clear detailed definition in 2-3 sentences.",
  "explanation":"Thorough explanation.",
  "examples":[
    "Example 1",
    "Example 2",
    "Example 3",
    "Example 4",
    "Example 5",
    "Example 6"
  ],
  "synonyms":["word1","word2","word3"],
  "antonyms":["word1","word2"]
}`
  : `Give me a completely random ${difficultyHint}. Pick a different word every time.${avoidClause}

Respond ONLY in this exact JSON format with no extra text before or after:
{
  "word": "the vocabulary word",
  "pronunciation": "/pronunciation/",
  "partOfSpeech": "noun",
  "difficulty": "${difficulty}",
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
      temperature: 1.3,
      max_tokens: 1200,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    const data = JSON.parse(jsonMatch[0]);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to generate word. Try again." }, { status: 500 });
  }
}