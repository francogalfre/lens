import { BlurFade } from "@lens/ui/components/blur-fade";
import { motion } from "motion/react";
import type { FeasibilityPayload } from "../../utils/agent-types";
import { BulletList, capitalize, Field, Label } from "../primitives";

const TechChip = ({ name, index }: { name: string; index: number }) => (
	<motion.span
		initial={{ opacity: 0, y: 4 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{
			duration: 0.25,
			delay: 0.05 * index,
			ease: [0.22, 1, 0.36, 1],
		}}
		className="rounded-md bg-secondary px-2 py-0.5 font-mono text-secondary-foreground text-xs"
	>
		{capitalize(name)}
	</motion.span>
);

export const FeasibilityContent = ({
	payload,
}: {
	payload: FeasibilityPayload;
}) => {
	const feasibility = payload.feasibility;
	if (!feasibility) return null;

	return (
		<BlurFade duration={0.3}>
			<div className="space-y-4 pt-4">
				<div className="flex gap-8">
					{feasibility.complexity && (
						<Field label="Complexity" value={feasibility.complexity} />
					)}
					{feasibility.estimatedTimeline && (
						<Field label="Timeline" value={feasibility.estimatedTimeline} />
					)}
				</div>
				{feasibility.techStack && feasibility.techStack.length > 0 && (
					<div className="space-y-1.5">
						<Label>Tech stack</Label>
						<div className="flex flex-wrap gap-1.5">
							{feasibility.techStack.map((name, index) => (
								<TechChip key={name} name={name} index={index} />
							))}
						</div>
					</div>
				)}
				{feasibility.mainChallenges && (
					<BulletList
						label="Main challenges"
						items={feasibility.mainChallenges}
					/>
				)}
			</div>
		</BlurFade>
	);
};
