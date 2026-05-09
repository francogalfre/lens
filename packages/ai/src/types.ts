import { z } from "zod";

export const ParsedIdeaSchema = z.object({
	problem: z.string(),
	solution: z.string(),
	targetAudience: z.string(),
	techDomain: z.string(),
	category: z.string(),
	summary: z.string(),
});

export const ParserOutputSchema = z.object({
	validationError: z.string().optional(),
	problem: z.string().optional(),
	solution: z.string().optional(),
	targetAudience: z.string().optional(),
	techDomain: z.string().optional(),
	category: z.string().optional(),
	summary: z.string().optional(),
});

export const ResearchResultSchema = z.object({
	competitors: z.array(
		z.object({
			name: z.string(),
			description: z.string(),
			url: z.string().optional(),
		}),
	),
	marketContext: z.string(),
	searchQueries: z.array(z.string()),
	opportunities: z.array(z.string()),
});

export const CritiqueResultSchema = z.object({
	weaknesses: z.array(z.string()),
	risks: z.array(z.string()),
	deadlyAssumptions: z.array(z.string()),
});

export const OpportunityResultSchema = z.object({
	strengths: z.array(z.string()),
	opportunities: z.array(z.string()),
	differentiators: z.array(z.string()),
});

export const FeasibilityResultSchema = z.object({
	complexity: z.string(),
	techStack: z.array(z.string()),
	mainChallenges: z.array(z.string()),
	estimatedTimeline: z.string(),
});

export const SynthesisResultSchema = z.object({
	overallScore: z.number().int().min(1).max(10),
	verdict: z.string(),
	topRecommendations: z.array(z.string()),
	summary: z.string(),
});

export type ParsedIdea = z.infer<typeof ParsedIdeaSchema>;
export type ParserOutput = z.infer<typeof ParserOutputSchema>;
export type ResearchResult = z.infer<typeof ResearchResultSchema>;
export type CritiqueResult = z.infer<typeof CritiqueResultSchema>;
export type OpportunityResult = z.infer<typeof OpportunityResultSchema>;
export type FeasibilityResult = z.infer<typeof FeasibilityResultSchema>;
export type SynthesisResult = z.infer<typeof SynthesisResultSchema>;

export type ParserResult =
	| { validationError: string }
	| {
			problem: string;
			solution: string;
			targetAudience: string;
			techDomain: string;
			category: string;
			summary: string;
	  };

export interface SynthesisInput {
	parsedIdea: ParsedIdea;
	research: ResearchResult;
	critique: CritiqueResult;
	opportunities: OpportunityResult;
	feasibility: FeasibilityResult;
}
