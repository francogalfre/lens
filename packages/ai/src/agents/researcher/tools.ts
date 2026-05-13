import { tool } from "langchain";
import { z } from "zod";

export const validateUrl = tool(
	async ({ url }): Promise<string> => {
		const controller = new AbortController();

		try {
			const response = await fetch(url, {
				method: "HEAD",
				redirect: "follow",
				signal: controller.signal,
			});

			return response.status >= 200 && response.status < 400
				? "valid"
				: "invalid";
		} catch {
			return "invalid";
		}
	},
	{
		name: "validate_url",
		description:
			"Verify that a URL is reachable. Returns 'valid' if the URL respondes with a 2xx/3xx status, otherwise 'invalid'. Call this for every competitor URL before including it inthe final answer",
		schema: z.object({
			url: z.string().describe("The URL to validate via HTTP HEAD"),
		}),
	},
);
