import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

/**
 * ProPath AI: thin wrapper around the Anthropic API.
 * The model is never named in the product UI; users only see "ProPath AI".
 */

export const AI_MODEL = process.env.PROPATH_AI_MODEL || "claude-opus-5-5";

type Effort = "low" | "medium" | "high";

let client: Anthropic | null = null;
if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) {
  client = new Anthropic();
  console.log(`ProPath AI ready (model: ${AI_MODEL}).`);
} else {
  console.log("ANTHROPIC_API_KEY is not set. ProPath AI features will use built-in fallbacks.");
}

export const aiAvailable = () => client !== null;

export class AIUnavailableError extends Error {}

/** On a safety decline the API retries on a fallback model by itself; see refusal handling below. */
const FALLBACK_PARAMS = {
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default" as const,
};

function assertUsable(response: Anthropic.Beta.BetaMessage) {
  if (response.stop_reason === "refusal") {
    throw new AIUnavailableError(`Request declined (${response.stop_details?.category ?? "unspecified"})`);
  }
  if (response.stop_reason === "max_tokens") {
    throw new AIUnavailableError("Response was cut off before it finished");
  }
}

/** Returns a value that matches `schema`, or throws. */
export async function generateJSON<S extends z.ZodType>(
  schema: S,
  opts: { system: string; prompt: string; effort?: Effort; maxTokens?: number }
): Promise<z.infer<S>> {
  if (!client) throw new AIUnavailableError("AI is not configured");
  // Streamed so large outputs (project plans, courses) aren't limited by request timeouts.
  const response = await client.beta.messages
    .stream({
      ...FALLBACK_PARAMS,
      model: AI_MODEL,
      max_tokens: opts.maxTokens ?? 16000,
      system: opts.system,
      messages: [{ role: "user", content: opts.prompt }],
      output_config: { effort: opts.effort ?? "medium", format: betaZodOutputFormat(schema) },
    })
    .finalMessage();
  assertUsable(response);
  if (response.parsed_output == null) throw new AIUnavailableError("Response did not match the expected format");
  return response.parsed_output as z.infer<S>;
}

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

/** Plain-text reply for chat surfaces (tutor, project assistant). */
export async function chat(opts: {
  system: string;
  history: ChatTurn[];
  message: string;
  effort?: Effort;
  maxTokens?: number;
}): Promise<string> {
  if (!client) throw new AIUnavailableError("AI is not configured");
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...opts.history.map((t) => ({ role: t.role, content: t.text })),
    { role: "user", content: opts.message },
  ];
  // The API requires the first message to be from the user.
  while (messages.length > 0 && messages[0].role !== "user") messages.shift();

  const response = await client.beta.messages
    .stream({
      ...FALLBACK_PARAMS,
      model: AI_MODEL,
      max_tokens: opts.maxTokens ?? 4000,
      system: opts.system,
      messages,
      output_config: { effort: opts.effort ?? "low" },
    })
    .finalMessage();
  assertUsable(response);
  const text = response.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  if (!text) throw new AIUnavailableError("Empty response");
  return text;
}

/** Logs API failures with enough detail to act on, without leaking them to users. */
export function logAIError(context: string, err: unknown) {
  if (err instanceof AIUnavailableError) {
    console.warn(`[ai] ${context}: ${err.message}`);
  } else if (err instanceof Anthropic.RateLimitError) {
    console.warn(`[ai] ${context}: rate limited`);
  } else if (err instanceof Anthropic.AuthenticationError) {
    console.error(`[ai] ${context}: invalid ANTHROPIC_API_KEY`);
  } else if (err instanceof Anthropic.BadRequestError) {
    console.error(`[ai] ${context}: bad request: ${err.message}`);
  } else if (err instanceof Anthropic.APIError) {
    console.error(`[ai] ${context}: API error ${err.status}: ${err.message}`);
  } else {
    console.error(`[ai] ${context}:`, err);
  }
}

export const LANGUAGE_NAME = (language: unknown) => (language === "french" ? "French" : "English");
