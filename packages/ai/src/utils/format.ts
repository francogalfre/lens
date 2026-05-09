import type { ParsedIdea } from "@/types";

export function buildIdeaContext(rawIdea: string, parsed?: ParsedIdea): string {
	if (!parsed) return rawIdea;

	return [
		`Idea: ${rawIdea}`,
		`Problem being solved: ${parsed.problem}`,
		`Proposed solution: ${parsed.solution}`,
		`Target audience: ${parsed.targetAudience}`,
		`Tech domain: ${parsed.techDomain}`,
		`Category: ${parsed.category}`,
	].join("\n");
}
