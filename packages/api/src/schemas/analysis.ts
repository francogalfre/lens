import { z } from "zod";

export const analyzeInputSchema = z.object({
	rawIdea: z
		.string()
		.min(1, "Idea is required")
		.max(5000, "Idea must be under 5000 characters"),
});
