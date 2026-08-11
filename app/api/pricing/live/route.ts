import { NextResponse } from "next/server";
import { API_PRICING_MODELS } from "@/data/apiPricingData";

interface LiveProviderLink {
  provider: string;
  url: string;
  note?: string;
}

const OFFICIAL_PRICING_PAGES: LiveProviderLink[] = [
  { provider: "OpenAI", url: "https://openai.com/api/pricing", note: "GPT-5.6 series (sol $5/$30, terra $2/$12, luna $0.20/$1.20)" },
  { provider: "Anthropic Claude", url: "https://platform.claude.com/docs/en/about-claude/pricing", note: "Fable 5 ($10/$50), Opus 5 ($5/$25), Sonnet 5 ($2/$10 intro)" },
  { provider: "Google Gemini", url: "https://ai.google.dev/gemini-api/docs/pricing", note: "3.1 Pro ($2/$12), 3.6 Flash ($1.50/$7.50), 3.5 Flash-Lite ($0.30/$2.50)" },
  { provider: "DeepSeek", url: "https://platform.deepseek.com/api/pricing", note: "V4-Flash (1/2 RMB), V4-Pro (3/6 RMB)" },
  { provider: "Qwen Cloud (Alibaba)", url: "https://help.aliyun.com/zh/model-studio/qwen-api", note: "Qwen3.8-Max (12/36 RMB), Qwen3.5-Plus (0.8/4.8 RMB)" },
  { provider: "GLM (Zhipu AI)", url: "https://bigmodel.cn/pricing", note: "GLM-5.2 (8/28 RMB)" },
  { provider: "LongCat AI (Meituan)", url: "https://longcat.chat/platform/docs/zh/pricing/long-cat-2.0", note: "LongCat-2.0 discounted ($0.30 / $1.20)" },
  { provider: "Mistral AI", url: "https://mistral.ai/pricing", note: "Large 3 ($0.50/$1.50), Medium 3.5 ($1.50/$7.50), Small 4 ($0.15/$0.60)" },
  { provider: "Cohere", url: "https://cohere.com/pricing", note: "Command A+ ($2.50/$10.00), Command R7B ($0.15/$0.60)" },
  { provider: "Kimi (Moonshot)", url: "https://platform.moonshot.cn", note: "Kimi K3 ($3/$15), K2.7 Code ($0.95/$4.00)" },
  { provider: "xAI Grok", url: "https://x.ai/api/pricing", note: "Grok 4.5 ($2/$6), Grok 4.3 ($1.25/$2.50)" },
  { provider: "Groq", url: "https://groq.com/pricing", note: "GPT-OSS 120B ($0.15/$0.60), Llama 3.3 70B ($0.59/$0.79)" },
  { provider: "Together AI", url: "https://together.ai/pricing", note: "Qwen3.7 Max ($1.25/$3.75), DeepSeek V4 Pro ($1.74/$3.48)" },
  { provider: "Fireworks AI", url: "https://fireworks.ai/pricing", note: "DeepSeek V4 Pro ($1.74/$3.48), Kimi K3 ($3/$15)" },
  { provider: "Replicate", url: "https://replicate.com/pricing", note: "Llama 4 Maverick (~$0.25/$0.95)" },
  { provider: "Ollama Cloud", url: "https://ollama.com/pricing", note: "Free, Pro ($20/mo), Max ($100/mo)" }
];

const LIVE_COMPARISON_TOOLS: LiveProviderLink[] = [
  { provider: "BenchLM AI Comparison", url: "https://benchlm.ai/llm-api-pricing-comparison", note: "Real-time LLM API Pricing Matrix" },
  { provider: "MorphLLM Directory", url: "https://www.morphllm.com/llm-api-providers", note: "2026 LLM API Providers List" }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    isSnapshot: true,
    disclaimer: "Reference pricing snapshot — always verify current rates on the official pricing pages before quoting clients.",
    lastUpdated: new Date().toISOString(),
    currencyRates: {
      USD_TO_ZAR: 18.50,
      USD_TO_RMB: 7.25
    },
    officialPricingPages: OFFICIAL_PRICING_PAGES,
    comparisonTools: LIVE_COMPARISON_TOOLS,
    modelsCount: API_PRICING_MODELS.length,
    models: API_PRICING_MODELS
  });
}
