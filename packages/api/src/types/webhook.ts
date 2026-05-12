import { z } from "zod";

export const subscriptionEventSchema = z.object({
	data: z.object({
		id: z.string().min(1),
		status: z.string().min(1),
		currency: z.string().min(1),
		productId: z.string().min(1),
		currentPeriodEnd: z.coerce.date(),
		cancelAtPeriodEnd: z.boolean().optional(),
		customer: z.object({
			id: z.string().min(1),
			email: z.string().email().nullish(),
			externalId: z.string().nullish(),
		}),
	}),
});

export type SubscriptionEvent = z.infer<typeof subscriptionEventSchema>;
