import { BlurFade } from "@lens/ui/components/blur-fade";
import type { ParserPayload } from "../../utils/agent-types";
import { Field } from "../primitives";

export const ParserContent = ({ payload }: { payload: ParserPayload }) => {
	if (typeof payload.validationError === "string") {
		return (
			<BlurFade duration={0.3}>
				<p className="text-muted-foreground text-sm">
					{payload.validationError}
				</p>
			</BlurFade>
		);
	}

	const idea = payload.parsedIdea;
	if (!idea) return null;

	return (
		<BlurFade duration={0.3}>
			<div className="space-y-3 pt-4">
				<Field label="Problem" value={idea.problem} />
				<Field label="Solution" value={idea.solution} />
				<Field label="Target audience" value={idea.targetAudience} />
				<div className="flex gap-8">
					<Field label="Domain" value={idea.techDomain} />
					<Field label="Category" value={idea.category} />
				</div>
			</div>
		</BlurFade>
	);
};
