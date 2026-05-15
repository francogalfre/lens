import { BlurFade } from "@lens/ui/components/blur-fade";
import type { OpportunityPayload } from "../../utils/agent-types";
import { BulletList } from "../primitives";

export const OpportunityContent = ({
	payload,
}: {
	payload: OpportunityPayload;
}) => {
	const data = payload.opportunities;
	if (!data) return null;

	return (
		<BlurFade duration={0.3}>
			<div className="space-y-4 pt-4">
				{data.strengths && (
					<BulletList label="Strengths" items={data.strengths} />
				)}
				{data.opportunities && (
					<BulletList label="Opportunities" items={data.opportunities} />
				)}
				{data.differentiators && (
					<BulletList label="Differentiators" items={data.differentiators} />
				)}
			</div>
		</BlurFade>
	);
};
