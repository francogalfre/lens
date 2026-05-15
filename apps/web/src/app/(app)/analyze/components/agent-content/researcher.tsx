import { BlurFade } from "@lens/ui/components/blur-fade";
import type { Competitor, ResearcherPayload } from "../../utils/agent-types";
import { capitalize, Field, Label } from "../primitives";

const MAX_MARKET_CONTEXT = 300;

const truncate = (text: string, max: number) =>
	text.length > max ? `${text.slice(0, max)}…` : text;

const CompetitorRow = ({ competitor }: { competitor: Competitor }) => (
	<div className="space-y-0.5">
		<div className="flex items-center gap-2">
			<span className="font-medium text-sm">
				{capitalize(competitor.name) ?? ""}
			</span>
			{competitor.url && (
				<a
					href={competitor.url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-muted-foreground text-xs underline underline-offset-2 transition-colors hover:text-foreground"
				>
					↗
				</a>
			)}
		</div>
		<span className="text-muted-foreground text-xs leading-relaxed">
			{capitalize(competitor.description) ?? ""}
		</span>
	</div>
);

export const ResearcherContent = ({
	payload,
}: {
	payload: ResearcherPayload;
}) => {
	const research = payload.research;
	if (!research) return null;

	const competitors = research.competitors ?? [];

	return (
		<BlurFade duration={0.3}>
			<div className="space-y-4 pt-4">
				{competitors.length > 0 && (
					<div className="space-y-1.5">
						<Label>Competitors</Label>
						<div className="space-y-3">
							{competitors.map((competitor) => (
								<CompetitorRow key={competitor.name} competitor={competitor} />
							))}
						</div>
					</div>
				)}
				{research.marketContext && (
					<Field
						label="Market context"
						value={truncate(research.marketContext, MAX_MARKET_CONTEXT)}
					/>
				)}
			</div>
		</BlurFade>
	);
};
