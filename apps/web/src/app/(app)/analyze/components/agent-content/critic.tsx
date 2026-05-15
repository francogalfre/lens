import { BlurFade } from "@lens/ui/components/blur-fade";
import type { CriticPayload } from "../../utils/agent-types";
import { BulletList } from "../primitives";

export const CriticContent = ({ payload }: { payload: CriticPayload }) => {
	const critique = payload.critique;
	if (!critique) return null;

	return (
		<BlurFade duration={0.3}>
			<div className="space-y-4 pt-4">
				{critique.weaknesses && (
					<BulletList label="Weaknesses" items={critique.weaknesses} />
				)}
				{critique.risks && <BulletList label="Risks" items={critique.risks} />}
				{critique.deadlyAssumptions && (
					<BulletList
						label="Critical assumptions"
						items={critique.deadlyAssumptions}
					/>
				)}
			</div>
		</BlurFade>
	);
};
