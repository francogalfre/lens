import { SparklesIcon } from "@heroicons/react/24/outline";

type SessionUser = {
	name: string | null;
	email: string | null;
};

export const ReceiptDetails = ({
	displayId,
	nextBilling,
	user,
}: {
	displayId: string;
	nextBilling: string;
	user: SessionUser | null;
}) => (
	<div className="space-y-5 px-8 py-6">
		<div className="grid grid-cols-2 gap-4 text-left">
			<div>
				<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
					Plan
				</p>
				<div className="mt-0.5 flex items-center gap-1.5 font-medium text-foreground text-sm">
					<SparklesIcon className="h-3.5 w-3.5" />
					Premium
				</div>
			</div>
			<div className="text-right">
				<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
					Billed
				</p>
				<p className="mt-0.5 font-semibold text-base text-foreground">
					$3.99
					<span className="ml-0.5 font-normal text-foreground/45 text-xs">
						/mo
					</span>
				</p>
			</div>
		</div>

		<div className="grid grid-cols-2 gap-4 text-left">
			<div>
				<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
					Checkout ID
				</p>
				<p className="mt-0.5 font-mono text-foreground/80 text-xs">
					{displayId}
				</p>
			</div>
			<div className="text-right">
				<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
					Renews
				</p>
				<p className="mt-0.5 text-foreground/80 text-xs">{nextBilling}</p>
			</div>
		</div>

		{user?.email && (
			<div className="rounded-xl bg-muted/50 px-3.5 py-3">
				<p className="text-[10px] text-foreground/45 uppercase tracking-wider">
					Account
				</p>
				<p className="mt-0.5 font-medium text-foreground text-sm">
					{user.name}
				</p>
				<p className="text-foreground/55 text-xs">{user.email}</p>
			</div>
		)}
	</div>
);
