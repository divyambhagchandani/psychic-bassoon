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

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      },
      body: JSON.stringify({
        text: [trimmed],
        source_lang: "DE",
        target_lang: "EN",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("DeepL error:", response.status, errorBody);
      return Response.json(
        { error: "Failed to translate text" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return Response.json({
      translation: data.translations?.[0]?.text || "",
    });
  } catch (error) {
    console.error("Translate API error:", error);
    return Response.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
