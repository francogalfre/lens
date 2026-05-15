import { CriticContent } from "./critic";
import { FeasibilityContent } from "./feasibility";
import { OpportunityContent } from "./opportunity";
import { ParserContent } from "./parser";
import { ResearcherContent } from "./researcher";
import { SynthesisContent } from "./synthesis";

export const AgentContent = ({
	agent,
	data,
	animate,
}: {
	agent: string;
	data: unknown;
	animate: boolean;
}) => {
	const dataMap = data as Record<string, Record<string, unknown>>;
	const payload = dataMap[agent];
	if (!payload) return null;

	switch (agent) {
		case "parser_agent":
			return <ParserContent payload={payload} />;
		case "researcher_agent":
			return <ResearcherContent payload={payload} />;
		case "critic_agent":
			return <CriticContent payload={payload} />;
		case "opportunity_agent":
			return <OpportunityContent payload={payload} />;
		case "feasibility_agent":
			return <FeasibilityContent payload={payload} />;
		case "synthesis_agent":
			return <SynthesisContent payload={payload} animate={animate} />;
		default:
			return null;
	}
};
