import type { StreamEvent } from "@/types/analysis";

const parseStreamLines = (
	buffer: string,
	onEvent: (event: StreamEvent) => void,
): string => {
	const lines = buffer.split("\n");
	const remainder = lines.pop() ?? "";

	for (const line of lines) {
		if (!line.trim()) continue;

		try {
			const parsed = JSON.parse(line);
			onEvent(parsed as StreamEvent);
		} catch (err) {
			console.warn("[stream] Skipped malformed line:", line.slice(0, 100));
		}
	}

	return remainder;
};

export const consumeAnalysisStream = async (
	body: ReadableStream<Uint8Array>,
	onEvent: (event: StreamEvent) => void,
): Promise<void> => {
	const reader = body.getReader();
	const decoder = new TextDecoder();

	let buffer = "";

	try {
		while (true) {
			const { done, value } = await reader.read();

			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			buffer = parseStreamLines(buffer, onEvent);
		}
	} catch (error) {
		console.error("[stream] Failed to read stream:", error);
		throw error;
	}
};
