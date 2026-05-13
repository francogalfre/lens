import { ReducedValue, StateSchema } from "@langchain/langgraph";
import { z } from "zod";

import {
	CritiqueResultSchema,
	FeasibilityResultSchema,
	OpportunityResultSchema,
	ParsedIdeaSchema,
	ResearchResultSchema,
	SynthesisResultSchema,
} from "@/graph/schemas";

export const AnalysisState = new StateSchema({
	rawIdea: z.string(),
	validationError: z.string().optional(),
	language: z.string().default("en"),

	parsedIdea: ParsedIdeaSchema.optional(),
	research: ResearchResultSchema.optional(),
	critique: CritiqueResultSchema.optional(),
	opportunities: OpportunityResultSchema.optional(),
	feasibility: FeasibilityResultSchema.optional(),
	synthesis: SynthesisResultSchema.optional(),

	completedAgents: new ReducedValue(
		z.array(z.string()).default(() => []),
		{ reducer: (curr: string[], upd: string[]) => curr.concat(upd) },
	),
});

export type AnalysisState = z.infer<typeof AnalysisState>;
