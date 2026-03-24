import OpenAI from "openai";

let client: OpenAI | null = null;

export function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
  return client;
}

export const MODELS = {
  tutor: "mistralai/mistral-small-3.1-24b-instruct",
  explainer: "mistralai/mistral-small-3.1-24b-instruct",
  generator: "mistralai/mistral-small-3.1-24b-instruct",
};
