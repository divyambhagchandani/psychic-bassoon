import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export const MODELS = {
  tutor: "claude-sonnet-4-5-20250514" as const,
  explainer: "claude-haiku-4-5-20251001" as const,
  generator: "claude-sonnet-4-5-20250514" as const,
};
