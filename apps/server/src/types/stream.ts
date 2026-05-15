export type StreamEvent =
	| { type: "start"; sessionId: string }
	| { type: "nodeStart"; agent: string | undefined }
	| { type: "agent"; agent: string; data: unknown }
	| { type: "complete" }
	| { type: "error"; error: string };
