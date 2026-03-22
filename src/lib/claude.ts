import OpenAI from "openai";

let client: OpenAI | null = null;

export function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      baseURL: process.env.CLAUDE_PROXY_URL || "http://localhost:8317/v1",
      apiKey: process.env.CLAUDE_PROXY_KEY || "not-needed",
    });
  }
  return client;
}

export const MODELS = {
  tutor: "claude-sonnet-4-5-20250514",
  explainer: "claude-sonnet-4-5-20250514",
  generator: "claude-sonnet-4-5-20250514",
  translator: "claude-sonnet-4-5-20250514",
};
