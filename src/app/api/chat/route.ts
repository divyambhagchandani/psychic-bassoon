import { getClient, MODELS } from "@/lib/claude";
import { TUTOR_SYSTEM_PROMPT, TUTOR_EXPLAIN_SYSTEM_PROMPT } from "@/lib/prompts";

const PROMPT_MAP: Record<string, { prompt: string; maxTokens: number }> = {
  tutor: { prompt: TUTOR_SYSTEM_PROMPT, maxTokens: 1024 },
  explain: { prompt: TUTOR_EXPLAIN_SYSTEM_PROMPT, maxTokens: 2048 },
};

const MAX_MESSAGES = 50;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, promptKey } = body;

    if (!Array.isArray(messages)) {
      return Response.json({ error: "messages must be an array" }, { status: 400 });
    }

    const config = PROMPT_MAP[promptKey as string] ?? PROMPT_MAP.tutor;

    const sanitized = messages
      .filter(
        (m: unknown): m is { role: string; content: string } =>
          typeof m === "object" &&
          m !== null &&
          typeof (m as Record<string, unknown>).role === "string" &&
          typeof (m as Record<string, unknown>).content === "string" &&
          ["user", "assistant"].includes((m as Record<string, unknown>).role as string)
      )
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const client = getClient();

    const stream = await client.chat.completions.create({
      model: MODELS.tutor,
      max_tokens: config.maxTokens,
      stream: true,
      messages: [
        { role: "system", content: config.prompt },
        ...sanitized,
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              const data = JSON.stringify({ text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
