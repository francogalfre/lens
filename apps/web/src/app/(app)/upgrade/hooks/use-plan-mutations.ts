"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc";

export const usePlanMutations = ({
	endDate,
	onCancelSuccess,
}: {
	endDate: string;
	onCancelSuccess: () => void;
}) => {
	const queryClient = useQueryClient();

	const checkout = useMutation(
		trpc.subscription.createCheckout.mutationOptions({
			onSuccess: ({ checkoutUrl }: { checkoutUrl: string }) => {
				window.location.href = checkoutUrl;
			},
		}),
	);

	const cancel = useMutation(
		trpc.subscription.cancel.mutationOptions({
			onSuccess: (result) => {
				queryClient.invalidateQueries({
					queryKey: trpc.subscription.getStatus.queryKey(),
				});
				onCancelSuccess();
				const cancelResult = result as { alreadyCancelled?: boolean };
				if (cancelResult?.alreadyCancelled) {
					toast.info("Your plan is already scheduled to cancel.");
				} else {
					toast.success("Plan cancelled", {
						description: `You'll keep Premium access until ${endDate}.`,
					});
				}
			},
			onError: () => {
				toast.error("Could not cancel plan. Please try again.");
			},
		}),
	);

	return { checkout, cancel };
};
