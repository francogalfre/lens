import { env } from "@lens/env/server";

const getApiKey = (): string => env.OPENROUTER_API_KEY;

export { getApiKey };
