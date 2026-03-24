import { getClient, MODELS } from "@/lib/claude";
import { TUTOR_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();
    const client = getClient();

    const system = typeof systemPrompt === "string" && systemPrompt
      ? systemPrompt
      : TUTOR_SYSTEM_PROMPT;

    const stream = await client.chat.completions.create({
      model: MODELS.tutor,
      max_tokens: systemPrompt ? 2048 : 1024,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
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
