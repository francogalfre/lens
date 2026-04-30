const getApiKey = (): string => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("[LLM] Missing OPENROUTER_API_KEY environment variable");
    throw new Error("OPENROUTER_API_KEY environment variable is required");
  }

  console.debug("[LLM] API key loaded successfully");
  return apiKey;
};

export { getApiKey };
