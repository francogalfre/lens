export const safeCallback = (path: string | null): string => {
	if (!path) return "/";
	if (!path.startsWith("/") || path.startsWith("//")) return "/";
	return path;
};

export const formatZodError = (error: unknown): string => {
	if (typeof error === "string") return error;
	if (error && typeof error === "object" && "message" in error) {
		return String((error as { message: unknown }).message);
	}
	return "Invalid input";
};
