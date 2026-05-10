export function forwardAuthHeaders(from: Response, to: Headers): void {
	for (const cookie of from.headers.getSetCookie()) {
		to.append("set-cookie", cookie);
	}
}

export async function parseAuthError(response: Response): Promise<string> {
	try {
		const data = (await response.json()) as { message?: string };

		return data.message ?? "Authentication failed";
	} catch {
		return "Authentication failed";
	}
}
