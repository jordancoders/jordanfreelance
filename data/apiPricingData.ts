/**
 * Single source of truth for the Live API Pricing tracker.
 * Imported by:
 *  - app/api/pricing/live/route.ts (serves the live-sync endpoint)
 *  - app/admin/page.tsx (static fallback + dashboard preview + cost calculator)
 *
 * Keep this file in sync with official provider pricing pages when rates change.
 * Currency conversion for RMB entries uses USD_TO_RMB = 7.25.
 */

export interface ApiPricingModel {
  id: string;
  name: string;
  provider: string;
  category: "Flagship" | "Fast / Cheap" | "Reasoning" | "Coder" | "Subscription";
  inputCostPer1M: number; // USD
  outputCostPer1M: number; // USD
  contextWindow: string;
  description: string;
  officialDocUrl: string;
  currencyNative?: string;
  nativeCostIn?: string;
  nativeCostOut?: string;
  features: string[];
}

export const API_PRICING_MODELS: ApiPricingModel[] = [
  // OpenAI — GPT-5.6 series
  {
    id: "gpt-5-6-sol",
    name: "GPT-5.6 Sol",
    provider: "OpenAI",
    category: "Flagship",
    inputCostPer1M: 5.00,
    outputCostPer1M: 30.00,
    contextWindow: "200k tokens",
    description: "OpenAI flagship frontier model for complex professional work, deep reasoning, and agentic tasks. Cached input at $0.50/1M.",
    officialDocUrl: "https://openai.com/api/pricing",
    features: ["Frontier Reasoning", "Agentic Workflows", "Cached Input $0.50"]
  },
  {
    id: "gpt-5-6-terra",
    name: "GPT-5.6 Terra",
    provider: "OpenAI",
    category: "Flagship",
    inputCostPer1M: 2.00,
    outputCostPer1M: 12.00,
    contextWindow: "200k tokens",
    description: "Balanced intelligence-and-cost tier of the GPT-5.6 line for production workloads needing strong reasoning without flagship pricing.",
    officialDocUrl: "https://openai.com/api/pricing",
    features: ["Balanced Intelligence", "Cached Input $0.20", "Structured Outputs"]
  },
  {
    id: "gpt-5-6-luna",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    category: "Fast / Cheap",
    inputCostPer1M: 0.20,
    outputCostPer1M: 1.20,
    contextWindow: "200k tokens",
    description: "Cost-optimized GPT-5.6 variant built for high-volume, low-latency workloads and cheap embedded assistants.",
    officialDocUrl: "https://openai.com/api/pricing",
    features: ["Cost-Optimized", "High Volume", "Low Latency"]
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 mini",
    provider: "OpenAI",
    category: "Fast / Cheap",
    inputCostPer1M: 0.25,
    outputCostPer1M: 2.00,
    contextWindow: "128k tokens",
    description: "Near-frontier intelligence at a budget price — the default cheap tier for everyday agent tasks and chat.",
    officialDocUrl: "https://openai.com/api/pricing",
    features: ["Near-Frontier Quality", "Everyday Tasks", "Cached Input $0.025"]
  },

  // Anthropic Claude — Fable / Opus / Sonnet / Haiku
  {
    id: "claude-fable-5",
    name: "Claude Fable 5",
    provider: "Anthropic",
    category: "Flagship",
    inputCostPer1M: 10.00,
    outputCostPer1M: 50.00,
    contextWindow: "1M tokens",
    description: "Anthropic's most capable frontier model with a 1M-token context window for the hardest reasoning and coding tasks.",
    officialDocUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    features: ["1M Context", "Max Reasoning", "128k Max Output"]
  },
  {
    id: "claude-opus-5",
    name: "Claude Opus 5",
    provider: "Anthropic",
    category: "Flagship",
    inputCostPer1M: 5.00,
    outputCostPer1M: 25.00,
    contextWindow: "1M tokens",
    description: "Top-tier Opus model for enterprise-scale engineering, computer use, and long-horizon agentic work.",
    officialDocUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    features: ["1M Context", "Computer Use", "128k Max Output"]
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    category: "Flagship",
    inputCostPer1M: 2.00,
    outputCostPer1M: 10.00,
    contextWindow: "1M tokens",
    description: "Industry-standard Sonnet tier — intro pricing $2/$10 through Aug 31 2026, then $3/$15. Best quality-per-dollar for most apps.",
    officialDocUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    features: ["1M Context", "Quality-Per-Dollar", "Batch 50% off"]
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    category: "Fast / Cheap",
    inputCostPer1M: 1.00,
    outputCostPer1M: 5.00,
    contextWindow: "200k tokens",
    description: "Ultra-fast lightweight Claude model for instant responses, automated chat, and smart routing.",
    officialDocUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    features: ["Sub-second Latency", "High Precision", "Lightweight"]
  },

  // Google Gemini — Pro / Flash / Flash-Lite
  {
    id: "gemini-3-1-pro",
    name: "Gemini 3.1 Pro",
    provider: "Google Gemini",
    category: "Flagship",
    inputCostPer1M: 2.00,
    outputCostPer1M: 12.00,
    contextWindow: "2M tokens",
    description: "Google's leading Pro model with a 2M-token context window. Input $2 (≤200k) / $4 (>200k), output $12 / $18.",
    officialDocUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    features: ["2M Context", "Paid Tier Only", "Context-Tiered Pricing"]
  },
  {
    id: "gemini-3-6-flash",
    name: "Gemini 3.6 Flash",
    provider: "Google Gemini",
    category: "Fast / Cheap",
    inputCostPer1M: 1.50,
    outputCostPer1M: 7.50,
    contextWindow: "1M tokens",
    description: "Next-gen flagship Flash model with real-time audio/video streaming and multi-modal search grounding.",
    officialDocUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    features: ["Real-time Audio/Video", "1M Context", "Google Grounding"]
  },
  {
    id: "gemini-3-5-flash",
    name: "Gemini 3.5 Flash",
    provider: "Google Gemini",
    category: "Fast / Cheap",
    inputCostPer1M: 1.50,
    outputCostPer1M: 9.00,
    contextWindow: "1M tokens",
    description: "High-performance Flash tier for multimodal production apps at flat pricing up to 1M context.",
    officialDocUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    features: ["Multimodal", "1M Context", "Flat Pricing"]
  },
  {
    id: "gemini-3-5-flash-lite",
    name: "Gemini 3.5 Flash-Lite",
    provider: "Google Gemini",
    category: "Fast / Cheap",
    inputCostPer1M: 0.30,
    outputCostPer1M: 2.50,
    contextWindow: "1M tokens",
    description: "Cost-efficient model for high-volume agentic tasks and simple data processing.",
    officialDocUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    features: ["High Volume", "Agentic Tasks", "Cheap Tier"]
  },
  {
    id: "gemini-2-5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "Google Gemini",
    category: "Fast / Cheap",
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.40,
    contextWindow: "1M tokens",
    description: "Cheapest standard Google tier — $0.10/$0.40 per 1M for ultra-budget batch workloads.",
    officialDocUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    features: ["Ultra Low Cost", "Batch 50% off", "1M Context"]
  },

  // DeepSeek — V4 generation
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4-Flash",
    provider: "DeepSeek",
    category: "Fast / Cheap",
    inputCostPer1M: 0.14, // ~1 RMB
    outputCostPer1M: 0.28, // ~2 RMB
    contextWindow: "1M tokens",
    description: "Ultra-budget high-speed MoE model with hybrid thinking/non-thinking modes. Cache-hit input at ¥0.02/1M.",
    officialDocUrl: "https://platform.deepseek.com/api/pricing",
    currencyNative: "RMB",
    nativeCostIn: "1 RMB",
    nativeCostOut: "2 RMB",
    features: ["Ultra Low Cost", "1M Context", "Auto Context Caching"]
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4-Pro",
    provider: "DeepSeek",
    category: "Flagship",
    inputCostPer1M: 0.435, // official USD list price (3 RMB native)
    outputCostPer1M: 0.87, // official USD list price (6 RMB native)
    contextWindow: "1M tokens",
    description: "Frontier reasoning flagship from DeepSeek — 1M context, thinking mode, and Anthropic API compatibility.",
    officialDocUrl: "https://platform.deepseek.com/api/pricing",
    currencyNative: "RMB",
    nativeCostIn: "3 RMB",
    nativeCostOut: "6 RMB",
    features: ["Frontier Reasoning", "1M Context", "Anthropic-Compatible"]
  },

  // Qwen Cloud (Alibaba)
  {
    id: "qwen-3-8-max",
    name: "Qwen3.8-Max",
    provider: "Qwen Cloud",
    category: "Flagship",
    inputCostPer1M: 1.66, // ~12 RMB @ 7.25
    outputCostPer1M: 4.97, // ~36 RMB @ 7.25
    contextWindow: "1M tokens",
    description: "Alibaba Cloud's 2.4-trillion-parameter MoE flagship with frontier multilingual and mathematical capability.",
    officialDocUrl: "https://help.aliyun.com/zh/model-studio/qwen-api",
    currencyNative: "RMB",
    nativeCostIn: "12 RMB",
    nativeCostOut: "36 RMB",
    features: ["2.4T MoE", "Enterprise Agents", "Multilingual"]
  },
  {
    id: "qwen-3-5-plus",
    name: "Qwen3.5-Plus",
    provider: "Qwen Cloud",
    category: "Fast / Cheap",
    inputCostPer1M: 0.11, // ~0.8 RMB @ 7.25
    outputCostPer1M: 0.66, // ~4.8 RMB @ 7.25
    contextWindow: "256k tokens",
    description: "Native vision-language hybrid MoE for cost-effective multimodal and agentic workloads.",
    officialDocUrl: "https://help.aliyun.com/zh/model-studio/qwen-api",
    currencyNative: "RMB",
    nativeCostIn: "0.8 RMB",
    nativeCostOut: "4.8 RMB",
    features: ["Vision-Language", "MoE", "256k Context"]
  },

  // GLM / Zhipu AI
  {
    id: "glm-5-2",
    name: "GLM-5.2",
    provider: "GLM / Zhipu",
    category: "Flagship",
    inputCostPer1M: 1.40, // official USD list price (8 RMB native)
    outputCostPer1M: 4.40, // official USD list price (28 RMB native)
    contextWindow: "128k tokens",
    description: "Zhipu AI frontier flagship optimized for web-search grounding and autonomous search agents.",
    officialDocUrl: "https://bigmodel.cn/pricing",
    currencyNative: "RMB",
    nativeCostIn: "8 RMB",
    nativeCostOut: "28 RMB",
    features: ["Web Grounding", "Agent Workflows", "Tool Calling"]
  },

  // LongCat AI (Meituan)
  {
    id: "longcat-2-0",
    name: "LongCat 2.0 (Discounted)",
    provider: "LongCat AI",
    category: "Flagship",
    inputCostPer1M: 0.30,
    outputCostPer1M: 1.20,
    contextWindow: "1M tokens",
    description: "Meituan's 1.6T-parameter sparse MoE coding powerhouse — 1M context, 128k output, OpenAI + Anthropic API compatible.",
    officialDocUrl: "https://longcat.chat/platform/docs/zh/pricing/long-cat-2.0",
    features: ["1.6T Sparse MoE", "1M Context", "Coding & Agentic"]
  },

  // Mistral AI
  {
    id: "mistral-large-3",
    name: "Mistral Large 3",
    provider: "Mistral",
    category: "Flagship",
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
    contextWindow: "128k tokens",
    description: "State-of-the-art open-weight multimodal MoE (675B total / 41B active) with strong multilingual and coding strength.",
    officialDocUrl: "https://mistral.ai/pricing",
    features: ["675B MoE", "Multimodal", "Open Weights"]
  },
  {
    id: "mistral-medium-3-5",
    name: "Mistral Medium 3.5",
    provider: "Mistral",
    category: "Flagship",
    inputCostPer1M: 1.50,
    outputCostPer1M: 7.50,
    contextWindow: "128k tokens",
    description: "Frontier-class multimodal model optimized for agentic and coding use cases.",
    officialDocUrl: "https://mistral.ai/pricing",
    features: ["Agentic", "Multimodal", "Coding"]
  },
  {
    id: "mistral-small-4",
    name: "Mistral Small 4",
    provider: "Mistral",
    category: "Fast / Cheap",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    contextWindow: "128k tokens",
    description: "Hybrid SOTA model unifying instruct, reasoning, and coding under Apache 2.0 at a budget price.",
    officialDocUrl: "https://mistral.ai/pricing",
    features: ["Hybrid Reasoning", "Apache 2.0", "Low Cost"]
  },
  {
    id: "magistral-medium",
    name: "Magistral Medium",
    provider: "Mistral",
    category: "Reasoning",
    inputCostPer1M: 2.00,
    outputCostPer1M: 5.00,
    contextWindow: "128k tokens",
    description: "Premium thinking model excelling in domain-specific, transparent, and multilingual reasoning.",
    officialDocUrl: "https://mistral.ai/pricing",
    features: ["Thinking Mode", "Multilingual", "Transparent Reasoning"]
  },

  // Cohere
  {
    id: "command-a-plus",
    name: "Command A+",
    provider: "Cohere",
    category: "Flagship",
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    contextWindow: "128k tokens",
    description: "Cohere's first MoE model combining vision, multi-step agentic reasoning, and world-class translation.",
    officialDocUrl: "https://cohere.com/pricing",
    features: ["MoE", "Vision", "Agentic Reasoning"]
  },
  {
    id: "command-r7b",
    name: "Command R7B",
    provider: "Cohere",
    category: "Fast / Cheap",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    contextWindow: "128k tokens",
    description: "Small, fast model optimized for lightweight RAG, multi-step tool use, and agents.",
    officialDocUrl: "https://cohere.com/pricing",
    features: ["Lightweight RAG", "Tool Use", "Agents"]
  },

  // Kimi (Moonshot)
  {
    id: "kimi-k3",
    name: "Kimi K3",
    provider: "Kimi (Moonshot)",
    category: "Flagship",
    inputCostPer1M: 3.00, // official USD list price (21.6 RMB native)
    outputCostPer1M: 15.00, // official USD list price (108 RMB native)
    contextWindow: "1M tokens",
    description: "Moonshot's 2.8-trillion-parameter flagship reasoning and multimodal model with a 1M-token context window.",
    officialDocUrl: "https://platform.moonshot.cn",
    currencyNative: "RMB",
    nativeCostIn: "21.6 RMB",
    nativeCostOut: "108 RMB",
    features: ["2.8T Flagship", "1M Context", "Reasoning + Multimodal"]
  },
  {
    id: "kimi-k2-7-code",
    name: "Kimi K2.7 Code",
    provider: "Kimi (Moonshot)",
    category: "Coder",
    inputCostPer1M: 0.95, // official USD list price (6.84 RMB native)
    outputCostPer1M: 4.00, // official USD list price (28.8 RMB native)
    contextWindow: "256k tokens",
    description: "Dedicated coding model with enhanced instruction-following in long contexts, plus a highspeed variant.",
    officialDocUrl: "https://platform.moonshot.cn",
    currencyNative: "RMB",
    nativeCostIn: "6.84 RMB",
    nativeCostOut: "28.8 RMB",
    features: ["Coding Focused", "Long Context", "Highspeed Variant"]
  },
  {
    id: "kimi-k2-6",
    name: "Kimi K2.6",
    provider: "Kimi (Moonshot)",
    category: "Fast / Cheap",
    inputCostPer1M: 0.16, // official USD list price (1.15 RMB native)
    outputCostPer1M: 4.00, // official USD list price (28.8 RMB native)
    contextWindow: "256k tokens",
    description: "General-purpose model supporting text, image, and video input with deep reasoning modes.",
    officialDocUrl: "https://platform.moonshot.cn",
    currencyNative: "RMB",
    nativeCostIn: "1.15 RMB",
    nativeCostOut: "28.8 RMB",
    features: ["Multimodal Input", "Deep Reasoning", "256k Context"]
  },

  // xAI Grok
  {
    id: "grok-4-5",
    name: "Grok 4.5",
    provider: "xAI Grok",
    category: "Flagship",
    inputCostPer1M: 2.00,
    outputCostPer1M: 6.00,
    contextWindow: "500k tokens",
    description: "xAI flagship with a 500k context window. Input $2 (short) / $4 (long ≥200k), output $6 / $12.",
    officialDocUrl: "https://x.ai/api/pricing",
    features: ["500k Context", "Short/Long Tiers", "Cached Input $0.30"]
  },
  {
    id: "grok-4-3",
    name: "Grok 4.3",
    provider: "xAI Grok",
    category: "Flagship",
    inputCostPer1M: 1.25,
    outputCostPer1M: 2.50,
    contextWindow: "1M tokens",
    description: "1M-context Grok production model — input $1.25 (short) / $2.50 (long), output $2.50 / $5.00.",
    officialDocUrl: "https://x.ai/api/pricing",
    features: ["1M Context", "Batch 20% off", "Cached Input $0.20"]
  },

  // Groq (hosted open weights on LPUs)
  {
    id: "groq-gpt-oss-120b",
    name: "GPT-OSS 120B (Groq LPU)",
    provider: "Groq",
    category: "Fast / Cheap",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    contextWindow: "128k tokens",
    description: "OpenAI's open-weight 120B flagship served on Groq LPUs at ~500 tokens/sec.",
    officialDocUrl: "https://groq.com/pricing",
    features: ["500+ Tokens/sec", "Open Weights", "Ultra Low Latency"]
  },
  {
    id: "groq-llama-3-3-70b",
    name: "Llama 3.3 70B (Groq LPU)",
    provider: "Groq",
    category: "Fast / Cheap",
    inputCostPer1M: 0.59,
    outputCostPer1M: 0.79,
    contextWindow: "128k tokens",
    description: "Meta Llama 3.3 70B on Groq LPUs at ~280 tokens/sec for real-time chat and voice.",
    officialDocUrl: "https://groq.com/pricing",
    features: ["280+ Tokens/sec", "Real-Time Voice/Chat", "Low Cost"]
  },

  // Together AI
  {
    id: "together-qwen3-7-max",
    name: "Qwen3.7 Max (Together)",
    provider: "Together AI",
    category: "Flagship",
    inputCostPer1M: 1.25,
    outputCostPer1M: 3.75,
    contextWindow: "256k tokens",
    description: "Qwen's frontier flagship hosted serverless on Together AI for pay-as-you-go open-weight inference.",
    officialDocUrl: "https://together.ai/pricing",
    features: ["Serverless API", "Open Weights", "Pay-As-You-Go"]
  },
  {
    id: "together-deepseek-v4-pro",
    name: "DeepSeek V4-Pro (Together)",
    provider: "Together AI",
    category: "Flagship",
    inputCostPer1M: 1.74,
    outputCostPer1M: 3.48,
    contextWindow: "1M tokens",
    description: "DeepSeek V4-Pro hosted on Together AI's serverless platform with cached input at $0.20/1M.",
    officialDocUrl: "https://together.ai/pricing",
    features: ["Serverless", "Cached Input $0.20", "1M Context"]
  },

  // Fireworks AI
  {
    id: "fireworks-deepseek-v4-pro",
    name: "DeepSeek V4-Pro (Fireworks)",
    provider: "Fireworks AI",
    category: "Flagship",
    inputCostPer1M: 1.74,
    outputCostPer1M: 3.48,
    contextWindow: "1M tokens",
    description: "DeepSeek V4-Pro on Fireworks with priority tier ($2.61/$5.22) and 80-92% cache discounts.",
    officialDocUrl: "https://fireworks.ai/pricing",
    features: ["Priority Tier", "Cache Discounts", "1M Context"]
  },
  {
    id: "fireworks-kimi-k3",
    name: "Kimi K3 (Fireworks)",
    provider: "Fireworks AI",
    category: "Flagship",
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    contextWindow: "1M tokens",
    description: "Kimi K3 flagship hosted on Fireworks with priority tier at $3.75/$18.75.",
    officialDocUrl: "https://fireworks.ai/pricing",
    features: ["1M Context", "Priority Tier", "Flagship Reasoning"]
  },

  // Replicate
  {
    id: "replicate-llama-4-maverick",
    name: "Llama 4 Maverick (Replicate)",
    provider: "Replicate",
    category: "Fast / Cheap",
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.95,
    contextWindow: "128k tokens",
    description: "Meta Llama 4 Maverick (17B/128-expert MoE) served per-token on Replicate's serverless GPU platform.",
    officialDocUrl: "https://replicate.com/pricing",
    features: ["MoE Architecture", "Serverless GPU", "Pay-Per-Token"]
  },

  // Ollama Cloud (subscription)
  {
    id: "ollama-cloud",
    name: "Ollama Cloud",
    provider: "Ollama Cloud",
    category: "Subscription",
    inputCostPer1M: 0.00,
    outputCostPer1M: 0.00,
    contextWindow: "Custom / Hosted",
    description: "Cloud-hosted open models with tiered subscription plans — Free, Pro $20/mo (50x usage), Max $100/mo.",
    officialDocUrl: "https://ollama.com/pricing",
    features: ["Free Tier", "Pro $20/mo", "Max $100/mo", "Self-Hostable"]
  }
];
