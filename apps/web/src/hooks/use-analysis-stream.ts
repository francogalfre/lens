import type { StreamEvent } from "@/hooks/analysis.types";

const parseStreamLines = (
	buffer: string,
	onEvent: (event: StreamEvent) => void,
): string => {
	const lines = buffer.split("\n");
	const remainder = lines.pop() ?? "";

	for (const line of lines) {
		if (!line.trim()) continue;
		try {
			onEvent(JSON.parse(line) as StreamEvent);
		} catch {
			// skip malformed lines
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

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		buffer = parseStreamLines(buffer, onEvent);
	}
};
