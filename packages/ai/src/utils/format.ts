import type { ParsedIdea } from "@/types";

export function buildIdeaContext(rawIdea: string, parsed?: ParsedIdea): string {
	if (!parsed) {
		return `Idea: ${rawIdea}`;
	}

	return [
		`Idea: ${rawIdea}`,
		`Problem: ${parsed.problem}`,
		`Solution: ${parsed.solution}`,
		`Target: ${parsed.targetAudience}`,
		`Tech: ${parsed.techDomain}`,
		`Category: ${parsed.category}`,
	].join("\n");
}
