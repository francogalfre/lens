export const PLAN_FEATURES: readonly string[] = [
	"3 analyses per day",
	"Premium AI model",
	"Full market research with competitors",
	"Detailed critique & opportunities",
	"Priority on new features",
	"Cancel any time",
] as const;

export const PLAN_PRICE = "$3.99";

export const formatEndDate = (iso: string | null): string => {
	if (!iso) return "the end of your billing period";

	return new Date(iso).toLocaleDateString(undefined, {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
};
