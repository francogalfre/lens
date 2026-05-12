"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@lens/ui/components/alert-dialog";

interface CancelPlanDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isPending: boolean;
}

export function CancelPlanDialog({
	open,
	onOpenChange,
	onConfirm,
	isPending,
}: CancelPlanDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel Premium plan?</AlertDialogTitle>
					<AlertDialogDescription>
						You'll keep access to Premium features until the end of your current
						billing period. After that, your plan reverts to free (1 analysis
						per day).
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>
						Keep Premium
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={isPending}
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
					>
						{isPending ? (
							<>
								<ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
								Cancelling…
							</>
						) : (
							"Cancel plan"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
