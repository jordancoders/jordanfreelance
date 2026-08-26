/**
 * Live AI API pricing fetcher.
 *
 * Fetches real-time token rates from OpenRouter's public /api/v1/models
 * endpoint (covers OpenAI, Anthropic, Google, Mistral, Groq, Cohere, Meta
 * and more). For providers not listed on OpenRouter (DeepSeek, Qwen, GLM,
 * Kimi, LongCat, xAI, Replicate, Fireworks, Together, Ollama) the static
 * prices from apiPricingData.ts are used as-is.
 *
 * OpenRouter returns per-token prices as strings in USD. We convert to
 * per-1-M-token for display parity with our existing cards.
 */

import {
  API_PRICING_MODELS,
  type ApiPricingModel,
} from "@/data/apiPricingData";

// ─── OpenRouter model → our model ID mapping ─────────────────────────────────
// Key = OpenRouter slug, Value = our model ID from apiPricingData.ts.
const OR_TO_OUR_ID: Record<string, string> = {
  // OpenAI
  "openai/gpt-5.6-sol": "gpt-5-6-sol",
  "openai/gpt-5-6-terra": "gpt-5-6-terra",
  "openai/gpt-5-6-luna": "gpt-5-6-luna",
  "openai/gpt-5-mini": "gpt-5-mini",
  "openai/gpt-5": "gpt-5-6-sol", // fallback alias
  "openai/gpt-4o": "gpt-5-6-terra", // closest tier match

  // Anthropic
  "anthropic/claude-fable-5": "claude-fable-5",
  "anthropic/claude-opus-5": "claude-opus-5",
  "anthropic/claude-sonnet-5": "claude-sonnet-5",
  "anthropic/claude-sonnet-4": "claude-sonnet-5",
  "anthropic/claude-haiku-4.5": "claude-haiku-4-5",
  "anthropic/claude-haiku-4": "claude-haiku-4-5",

  // Google Gemini
  "google/gemini-3.1-pro": "gemini-3-1-pro",
  "google/gemini-3.6-flash": "gemini-3-6-flash",
  "google/gemini-3.5-flash": "gemini-3-5-flash",
  "google/gemini-3.5-flash-lite": "gemini-3-5-flash-lite",
  "google/gemini-2.5-flash-lite": "gemini-2-5-flash-lite",
  "google/gemini-2.5-pro": "gemini-3-1-pro",
  "google/gemini-2.5-flash": "gemini-3-6-flash",

  // Mistral
  "mistralai/mistral-large": "mistral-large-3",
  "mistralai/mistral-medium": "mistral-medium-3-5",
  "mistralai/mistral-small": "mistral-small-4",
  "mistralai/magistral-medium": "magistral-medium",

  // Cohere
  "cohere/command-a": "command-a-plus",
  "cohere/command-r-plus": "command-a-plus",
  "cohere/command-r-7b": "command-r7b",

  // Groq (open-weight hosted)
  "groq/gpt-oss-120b": "groq-gpt-oss-120b",
  "meta-llama/llama-3.3-70b-instruct": "groq-llama-3-3-70b",

  // xAI
  "x-ai/grok-4.5": "grok-4-5",
  "x-ai/grok-4.3": "grok-4-3",
  "x-ai/grok-3": "grok-4-3",
};

// ─── OpenRouter response types ───────────────────────────────────────────────

interface ORPricing {
  prompt: string;
  completion: string;
  [key: string]: string;
}

interface ORModel {
  id: string;
  name: string;
  context_length: number;
  pricing?: ORPricing;
}

interface ORResponse {
  data?: ORModel[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert per-token string to per-1M number. Returns 0 if unparseable. */
const perTokenToPer1M = (s: string | undefined): number => {
  const n = parseFloat(s ?? "");
  return Number.isFinite(n) ? n * 1_000_000 : 0;
};

/** Format context length to human string. */
const formatContext = (tokens: number): string => {
  if (tokens >= 1_000_000) return `${tokens / 1_000_000}M tokens`;
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}k tokens`;
  return `${tokens} tokens`;
};

// ─── Main fetch function ─────────────────────────────────────────────────────

export interface LivePricingResult {
  models: ApiPricingModel[];
  liveCount: number;
  syncedAt: string;
  source: string;
}

/**
 * Fetch live pricing from OpenRouter and merge with our static data.
 * Returns the full model list with live-updated prices where available.
 */
export async function fetchLivePricing(): Promise<LivePricingResult> {
  const staticModels = API_PRICING_MODELS;
  const liveMap = new Map<string, { input: number; output: number; context: number }>();

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // cache 5 min at edge
    });

    if (!res.ok) {
      console.warn(`[fetchLivePricing] OpenRouter returned ${res.status}`);
      return fallbackResult(staticModels, "OpenRouter unavailable — using static rates");
    }

    const json: ORResponse = await res.json();
    const orModels = json.data ?? [];

    // Build lookup map from OpenRouter models
    for (const or of orModels) {
      const ourId = OR_TO_OUR_ID[or.id];
      if (!ourId || !or.pricing) continue;

      const input = perTokenToPer1M(or.pricing.prompt);
      const output = perTokenToPer1M(or.pricing.completion);
      const context = or.context_length || 0;

      // Only update if prices look sane (> 0 and < $500 per 1M)
      if (input > 0 && input < 500 && output > 0 && output < 500) {
        liveMap.set(ourId, { input, output, context });
      }
    }

    // Merge: live prices override static where available
    let liveCount = 0;
    const merged = staticModels.map((m) => {
      const live = liveMap.get(m.id);
      if (!live) return m;
      liveCount++;
      return {
        ...m,
        inputCostPer1M: Math.round(live.input * 100) / 100,
        outputCostPer1M: Math.round(live.output * 100) / 100,
        contextWindow: live.context > 0 ? formatContext(live.context) : m.contextWindow,
      };
    });

    return {
      models: merged,
      liveCount,
      syncedAt: new Date().toISOString(),
      source: liveCount > 0
        ? `Live from OpenRouter (${liveCount}/${staticModels.length} models updated)`
        : "OpenRouter responded but no model matches — using static rates",
    };
  } catch (err) {
    console.error("[fetchLivePricing] fetch failed:", err);
    return fallbackResult(staticModels, "Network error — using static rates");
  }
}

function fallbackResult(
  models: ApiPricingModel[],
  source: string
): LivePricingResult {
  return {
    models,
    liveCount: 0,
    syncedAt: new Date().toISOString(),
    source,
  };
}
