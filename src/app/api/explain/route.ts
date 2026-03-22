import { getClient, MODELS } from "@/lib/claude";
import { EXPLAINER_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { exerciseId, explanation } = await req.json();
    const client = getClient();

    const response = await client.chat.completions.create({
      model: MODELS.explainer,
      max_tokens: 256,
      messages: [
        { role: "system", content: EXPLAINER_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Erkläre warum diese Antwort falsch war. Die richtige Erklärung ist: "${explanation}". Übungs-ID: ${exerciseId}`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content || "";
    return Response.json({ explanation: text });
  } catch (error) {
    console.error("Explain API error:", error);
    return Response.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
