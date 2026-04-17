import { getClient, MODELS } from "@/lib/claude";
import { GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { weakTopics, count = 5 } = body;

    if (!Array.isArray(weakTopics) || !weakTopics.every((t: unknown) => typeof t === "string")) {
      return Response.json({ error: "weakTopics must be an array of strings" }, { status: 400 });
    }
    const clampedCount = Math.min(Math.max(1, Number(count) || 5), 20);

    const client = getClient();

    const response = await client.chat.completions.create({
      model: MODELS.generator,
      max_tokens: 2048,
      messages: [
        { role: "system", content: GENERATOR_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generiere ${clampedCount} Übungen zu diesen schwachen Themen: ${weakTopics.join(", ")}.
Antworte NUR mit einem JSON-Array. Keine andere Erklärung.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "[]";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return Response.json({ exercises: [] });
    }

    let exercises;
    try {
      exercises = JSON.parse(jsonMatch[0]);
    } catch {
      return Response.json({ exercises: [] });
    }
    return Response.json({ exercises });
  } catch (error) {
    console.error("Generate API error:", error);
    return Response.json(
      { error: "Failed to generate exercises" },
      { status: 500 }
    );
  }
}
