export const OPPORTUNITY_PROMPT = `You are an expert at identifying strengths and opportunities in startup ideas.
Analyze this idea and identify its strengths (key advantages and compelling qualities), opportunities (market gaps and growth vectors), and differentiators (what makes it stand out from existing solutions).
Respond in the same language as the idea. Return ONLY valid JSON, no extra text.

{
  "strengths": ["..."],
  "opportunities": ["..."],
  "differentiators": ["..."]
}`;
