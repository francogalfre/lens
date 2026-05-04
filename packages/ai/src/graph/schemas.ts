import { z } from "zod";

export const ParsedIdeaSchema = z.object({
	problem: z.string(),
	solution: z.string(),
	targetAudience: z.string(),
	techDomain: z.string(),
	category: z.string(),
	summary: z.string(),
});

export const ResearchResultSchema = z.object({
	competitors: z
		.array(
			z.object({
				name: z.string(),
				description: z.string(),
				url: z.string().optional(),
			}),
		)
		.optional()
		.default([]),
	marketContext: z.string(),
	searchQueries: z.array(z.string()).optional().default([]),
	opportunities: z.array(z.string()).optional().default([]),
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
	complexity: z.enum(["low", "medium", "high"]),
	techStack: z.array(z.string()),
	mainChallenges: z.array(z.string()),
	estimatedTimeline: z.string(),
});

export const SynthesisResultSchema = z.object({
	overallScore: z.number().min(1).max(10),
	verdict: z.string(),
	topRecommendations: z.array(z.string()),
	summary: z.string(),
});

export type ParsedIdea = z.infer<typeof ParsedIdeaSchema>;
export type ResearchResult = z.infer<typeof ResearchResultSchema>;
export type CritiqueResult = z.infer<typeof CritiqueResultSchema>;
export type OpportunityResult = z.infer<typeof OpportunityResultSchema>;
export type FeasibilityResult = z.infer<typeof FeasibilityResultSchema>;
export type SynthesisResult = z.infer<typeof SynthesisResultSchema>;
