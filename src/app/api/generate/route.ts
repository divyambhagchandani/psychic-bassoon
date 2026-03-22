import { getClient, MODELS } from "@/lib/claude";
import { GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { weakTopics, count = 5 } = await req.json();
    const client = getClient();

    const response = await client.chat.completions.create({
      model: MODELS.generator,
      max_tokens: 2048,
      messages: [
        { role: "system", content: GENERATOR_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generiere ${count} Übungen zu diesen schwachen Themen: ${weakTopics.join(", ")}.
Antworte NUR mit einem JSON-Array. Keine andere Erklärung.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "[]";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return Response.json({ exercises: [] });
    }

    const exercises = JSON.parse(jsonMatch[0]);
    return Response.json({ exercises });
  } catch (error) {
    console.error("Generate API error:", error);
    return Response.json(
      { error: "Failed to generate exercises" },
      { status: 500 }
    );
  }
}
