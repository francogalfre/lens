export const FREE_MODELS = [
  "openai/gpt-oss-120b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "inclusionai/ling-2.6-1t:free",
  "openai/gpt-oss-20b:free",
  "poolside/laguna-m.1:free",
] as const;

export const DEFAULT_LLM_CONFIG = {
  temperature: 0,
  maxTokens: 2048,
} as const;
