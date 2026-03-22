import { getAnthropicClient, MODELS } from "@/lib/claude";
import { EXPLAINER_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { exerciseId, explanation } = await req.json();

    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: MODELS.explainer,
      max_tokens: 256,
      system: EXPLAINER_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Erkläre warum diese Antwort falsch war. Die richtige Erklärung ist: "${explanation}". Übungs-ID: ${exerciseId}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return Response.json({ explanation: text });
  } catch (error) {
    console.error("Explain API error:", error);
    return Response.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
