export const humanizeLoginError = (message: string): string => {
	const lowercase = message.toLowerCase();
	if (
		lowercase.includes("invalid") &&
		(lowercase.includes("password") || lowercase.includes("credentials"))
	)
		return "Email or password is incorrect.";
	if (lowercase.includes("user_not_found") || lowercase.includes("not found"))
		return "No account found for that email.";
	if (lowercase.includes("invalid") && lowercase.includes("email"))
		return "That email address doesn't look right.";
	return message;
};

export const humanizeRegisterError = (message: string): string => {
	const lowercase = message.toLowerCase();
	if (
		lowercase.includes("user_already_exists") ||
		lowercase.includes("already exists")
	)
		return "An account with this email already exists. Try signing in instead.";
	if (lowercase.includes("password") && lowercase.includes("short"))
		return "That password is too short. Use 8 or more characters.";
	if (lowercase.includes("invalid") && lowercase.includes("email"))
		return "That email address doesn't look right.";
	return message;
};
