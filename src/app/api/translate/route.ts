import { getClient, MODELS } from "@/lib/claude";
import { TRANSLATOR_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const trimmed = text.trim();
    if (trimmed.length < 15) {
      return Response.json(
        { error: "Text must be at least 15 characters" },
        { status: 400 }
      );
    }
    if (trimmed.length > 500) {
      return Response.json(
        { error: "Text must be at most 500 characters" },
        { status: 400 }
      );
    }

    const client = getClient();
    const response = await client.chat.completions.create({
      model: MODELS.translator,
      max_tokens: 256,
      messages: [
        { role: "system", content: TRANSLATOR_SYSTEM_PROMPT },
        { role: "user", content: trimmed },
      ],
    });

    const raw = response.choices[0]?.message?.content || "";

    try {
      const parsed = JSON.parse(raw);
      return Response.json({
        translation: parsed.translation || "",
        grammarNote: parsed.grammarNote || "",
      });
    } catch {
      return Response.json({ translation: raw, grammarNote: "" });
    }
  } catch (error) {
    console.error("Translate API error:", error);
    return Response.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
