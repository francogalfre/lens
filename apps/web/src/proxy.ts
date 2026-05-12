import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/analyze", "/upgrade"];
const SESSION_COOKIES = [
	"better-auth.session_token",
	"__Secure-better-auth.session_token",
];

export function proxy(req: NextRequest) {
	const { pathname, search } = req.nextUrl;
	const needsAuth = PROTECTED_PREFIXES.some(
		(p) => pathname === p || pathname.startsWith(`${p}/`),
	);
	if (!needsAuth) return NextResponse.next();

	const hasSession = SESSION_COOKIES.some((name) => req.cookies.has(name));
	if (hasSession) return NextResponse.next();

	const loginUrl = req.nextUrl.clone();
	loginUrl.pathname = "/login";
	loginUrl.search = `?callbackUrl=${encodeURIComponent(`${pathname}${search}`)}`;
	return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: ["/dashboard/:path*", "/analyze/:path*", "/upgrade/:path*"],
};
