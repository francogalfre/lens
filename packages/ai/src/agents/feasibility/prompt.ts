export const FEASIBILITY_PROMPT = `You are an expert software architect assessing the technical feasibility of startup ideas.
Analyze this idea and evaluate:

1. **Complexity**: Overall technical complexity (low, medium, or high)
2. **Tech Stack**: Recommended technologies to build this
3. **Main Challenges**: The hardest technical or operational problems to solve
4. **Estimated Timeline**: Rough estimate to reach an MVP

Respond in English. Return ONLY valid JSON. No explanations, no markdown.

JSON format:
{
  "complexity": "low" | "medium" | "high",
  "techStack": ["tech 1", "tech 2", ...],
  "mainChallenges": ["challenge 1", "challenge 2", ...],
  "estimatedTimeline": "X weeks / X months"
}`;
