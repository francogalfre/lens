export type SubscriptionEvent = {
	data: {
		id: string;
		status: string;
		currency: string;
		productId: string;
		currentPeriodEnd: Date;
		cancelAtPeriodEnd?: boolean;
		customer: {
			id: string;
			email?: string | null;
			externalId?: string | null;
		};
	};
};
