import { BlurFade } from "@lens/ui/components/blur-fade";
import type { SynthesisPayload } from "../../utils/agent-types";
import { AnimatedScore } from "../animated-score";
import { BulletList, Field } from "../primitives";

export const SynthesisContent = ({
	payload,
	animate,
}: {
	payload: SynthesisPayload;
	animate: boolean;
}) => {
	const synthesis = payload.synthesis;
	if (!synthesis) return null;

	return (
		<BlurFade duration={0.3}>
			<div className="space-y-4 pt-4">
				{synthesis.overallScore !== undefined && (
					<div className="flex items-baseline gap-1.5">
						<span className="font-mono font-semibold text-3xl tabular-nums leading-none">
							<AnimatedScore value={synthesis.overallScore} animate={animate} />
						</span>
						<span className="font-mono text-muted-foreground text-xs">
							/ 10
						</span>
					</div>
				)}
				{synthesis.verdict && (
					<Field label="Verdict" value={synthesis.verdict} />
				)}
				{synthesis.summary && (
					<Field label="Summary" value={synthesis.summary} />
				)}
				{synthesis.topRecommendations &&
					synthesis.topRecommendations.length > 0 && (
						<BulletList
							label="Recommendations"
							items={synthesis.topRecommendations}
						/>
					)}
			</div>
		</BlurFade>
	);
};
