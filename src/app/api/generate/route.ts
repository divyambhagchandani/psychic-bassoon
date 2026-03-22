import { getAnthropicClient, MODELS } from "@/lib/claude";
import { GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { weakTopics, count = 5 } = await req.json();

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: MODELS.generator,
      max_tokens: 2048,
      system: GENERATOR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generiere ${count} Übungen zu diesen schwachen Themen: ${weakTopics.join(", ")}.
Antworte NUR mit einem JSON-Array. Keine andere Erklärung.`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "[]";

    // Extract JSON array from response
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
