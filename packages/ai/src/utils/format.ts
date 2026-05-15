import type { ParsedIdea } from "@/types";

export function buildIdeaContext(
	rawIdea: string,
	parsed?: ParsedIdea,
	language?: string,
): string {
	const lines = parsed
		? [
				`Idea: ${rawIdea}`,
				`Problem: ${parsed.problem}`,
				`Solution: ${parsed.solution}`,
				`Target: ${parsed.targetAudience}`,
				`Tech: ${parsed.techDomain}`,
				`Category: ${parsed.category}`,
			]
		: [`Idea: ${rawIdea}`];

	if (language) {
		lines.push(`Language: ${language}`);
	}

	return lines.join("\n");
}
