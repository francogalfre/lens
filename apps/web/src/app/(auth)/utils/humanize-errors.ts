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
		return "Password must be at least 8 characters, include one uppercase letter and one number.";
	if (lowercase.includes("invalid") && lowercase.includes("email"))
		return "That email address doesn't look right.";
	return message;
};

export const humanizeForgotPasswordError = (message: string): string => {
	const lowercase = message.toLowerCase();
	if (lowercase.includes("user not found") || lowercase.includes("not found"))
		return "No account found with that email address.";
	if (lowercase.includes("too many") || lowercase.includes("rate"))
		return "Too many requests. Please wait a few minutes and try again.";
	return message;
};

export const humanizeResetPasswordError = (message: string): string => {
	const lowercase = message.toLowerCase();
	if (lowercase.includes("invalid") && lowercase.includes("otp"))
		return "That code is incorrect. Please check your email and try again.";
	if (lowercase.includes("expired"))
		return "That code has expired. Please request a new one.";
	if (lowercase.includes("password") && lowercase.includes("short"))
		return "Password must be at least 8 characters.";
	return message;
};
