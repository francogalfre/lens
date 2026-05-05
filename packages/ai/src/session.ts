export interface RunConfig {
	configurable: {
		sessionId: string;
	};
}

export function toRunConfig(sessionId: string): RunConfig {
	return {
		configurable: {
			sessionId,
		},
	};
}
