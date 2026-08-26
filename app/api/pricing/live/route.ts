export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { fetchLivePricing, type LivePricingResult } from "@/lib/fetchLivePricing";
import type { ApiPricingModel } from "@/data/apiPricingData";

interface LiveProviderLink {
  provider: string;
  url: string;
  note?: string;
}

const OFFICIAL_PRICING_PAGES_BASE: Omit<LiveProviderLink, "note">[] = [
  { provider: "OpenAI", url: "https://openai.com/api/pricing" },
  { provider: "Anthropic Claude", url: "https://platform.claude.com/docs/en/about-claude/pricing" },
  { provider: "Google Gemini", url: "https://ai.google.dev/gemini-api/docs/pricing" },
  { provider: "DeepSeek", url: "https://platform.deepseek.com/api/pricing" },
  { provider: "Qwen Cloud (Alibaba)", url: "https://help.aliyun.com/zh/model-studio/qwen-api" },
  { provider: "GLM (Zhipu AI)", url: "https://bigmodel.cn/pricing" },
  { provider: "LongCat AI (Meituan)", url: "https://longcat.chat/platform/docs/zh/pricing/long-cat-2.0" },
  { provider: "Mistral AI", url: "https://mistral.ai/pricing" },
  { provider: "Cohere", url: "https://cohere.com/pricing" },
  { provider: "Kimi (Moonshot)", url: "https://platform.moonshot.cn" },
  { provider: "xAI Grok", url: "https://x.ai/api/pricing" },
  { provider: "Groq", url: "https://groq.com/pricing" },
  { provider: "Together AI", url: "https://together.ai/pricing" },
  { provider: "Fireworks AI", url: "https://fireworks.ai/pricing" },
  { provider: "Replicate", url: "https://replicate.com/pricing" },
  { provider: "Ollama Cloud", url: "https://ollama.com/pricing" },
];

const LIVE_COMPARISON_TOOLS: LiveProviderLink[] = [
  { provider: "BenchLM AI Comparison", url: "https://benchlm.ai/llm-api-pricing-comparison", note: "Real-time LLM API Pricing Matrix" },
  { provider: "MorphLLM Directory", url: "https://www.morphllm.com/llm-api-providers", note: "2026 LLM API Providers List" },
];

// ─── Provider → model ID prefix mapping ──────────────────────────────────────
// Maps each official pricing page to the model IDs that belong to it,
// so we can generate dynamic "example prices" notes from live data.

const PROVIDER_MODEL_PREFIXES: Record<string, string[]> = {
  "OpenAI": ["gpt-5-6-sol", "gpt-5-6-terra", "gpt-5-6-luna", "gpt-5-mini"],
  "Anthropic Claude": ["claude-fable-5", "claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"],
  "Google Gemini": ["gemini-3-1-pro", "gemini-3-6-flash", "gemini-3-5-flash", "gemini-3-5-flash-lite", "gemini-2-5-flash-lite"],
  "DeepSeek": ["deepseek-v4-flash", "deepseek-v4-pro"],
  "Qwen Cloud (Alibaba)": ["qwen-3-8-max", "qwen-3-5-plus"],
  "GLM (Zhipu AI)": ["glm-5-2"],
  "LongCat AI (Meituan)": ["longcat-2-0"],
  "Mistral AI": ["mistral-large-3", "mistral-medium-3-5", "mistral-small-4", "magistral-medium"],
  "Cohere": ["command-a-plus", "command-r7b"],
  "Kimi (Moonshot)": ["kimi-k3", "kimi-k2-7-code", "kimi-k2-6"],
  "xAI Grok": ["grok-4-5", "grok-4-3"],
  "Groq": ["groq-gpt-oss-120b", "groq-llama-3-3-70b"],
  "Together AI": ["together-qwen3-7-max", "together-deepseek-v4-pro"],
  "Fireworks AI": ["fireworks-deepseek-v4-pro", "fireworks-kimi-k3"],
  "Replicate": ["replicate-llama-4-maverick"],
  "Ollama Cloud": ["ollama-cloud"],
};

/**
 * Build a short note like "Sol $5.00/$30.00, Terra $2.00/$12.00" from the
 * live model list for a given provider.
 */
function buildDynamicNote(provider: string, models: ApiPricingModel[]): string {
  const ids = PROVIDER_MODEL_PREFIXES[provider] || [];
  const matched = models.filter((m) => ids.includes(m.id));
  if (!matched.length) return "";

  // Show top 2–3 models, abbreviated name (strip provider prefix)
  const shortName = (m: ApiPricingModel) => {
    let n = m.name;
    // Remove provider prefix if present
    for (const p of ["DeepSeek ", "Qwen", "Kimi ", "Gemini ", "Claude ", "GPT-", "Grok ", "Llama ", "Mistral "]) {
      if (n.startsWith(p)) { n = n.slice(p.length); break; }
    }
    return n;
  };

  const parts = matched.slice(0, 3).map((m) => {
    const isNativeCurrency = m.currencyNative === "RMB";
    if (isNativeCurrency && m.nativeCostIn && m.nativeCostOut) {
      return `${shortName(m)} (${m.nativeCostIn}/${m.nativeCostOut})`;
    }
    return `${shortName(m)} ($${m.inputCostPer1M.toFixed(2)}/$${m.outputCostPer1M.toFixed(2)})`;
  });

  return parts.join(", ");
}

export async function GET() {
  const live = await fetchLivePricing();

  // Generate dynamic notes from live model data
  const officialPages: LiveProviderLink[] = OFFICIAL_PRICING_PAGES_BASE.map((p) => ({
    ...p,
    note: buildDynamicNote(p.provider, live.models),
  }));

  return NextResponse.json({
    success: true,
    disclaimer: "Reference pricing — always verify current rates on the official pricing pages before quoting clients.",
    lastUpdated: live.syncedAt,
    source: live.source,
    liveModelsUpdated: live.liveCount,
    currencyRates: {
      USD_TO_ZAR: 18.50,
      USD_TO_RMB: 7.25,
    },
    officialPricingPages: officialPages,
    comparisonTools: LIVE_COMPARISON_TOOLS,
    modelsCount: live.models.length,
    models: live.models,
  });
}
