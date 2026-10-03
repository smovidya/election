import { api } from "@/lib/api";

const clientId =
	"878635631561-996p9vdbemp1n3r7dcs91i9f0e6i25fi.apps.googleusercontent.com";
const pendingSignInKey = "google_oauth_pending";
const signInLifetime = 10 * 60 * 1000;

/** Start Google's OIDC redirect flow, requesting an ID token for our backend. */
export function oauthSignIn() {
	const state = crypto.randomUUID();
	const nonce = crypto.randomUUID();
	sessionStorage.setItem(
		pendingSignInKey,
		JSON.stringify({ state, nonce, createdAt: Date.now() }),
	);

	const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
	const redirectUri = new URL("login", baseUrl);
	const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
	authorizationUrl.search = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri.href,
		response_type: "id_token",
		scope: "openid email profile",
		hd: "chula.ac.th",
		prompt: "select_account",
		state,
		nonce,
	}).toString();
	window.location.assign(authorizationUrl.href);
}

/** Handle a Google redirect on /login. Returns false for an ordinary page visit. */
export async function completeOAuthSignIn(): Promise<boolean> {
	const params = new URLSearchParams(window.location.hash.slice(1));
	if (!params.has("id_token") && !params.has("error")) {
		return false;
	}

	// Remove credentials from the URL and consume the request before awaiting anything.
	window.history.replaceState(
		window.history.state,
		"",
		window.location.pathname + window.location.search,
	);
	const storedRequest = sessionStorage.getItem(pendingSignInKey);
	sessionStorage.removeItem(pendingSignInKey);
	const invalidResponse = "ข้อมูลการเข้าสู่ระบบไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง";
	if (!storedRequest) throw new Error(invalidResponse);

	let pending: { state?: unknown; nonce?: unknown; createdAt?: unknown };
	try {
		pending = JSON.parse(storedRequest);
	} catch {
		throw new Error(invalidResponse);
	}
	if (
		!pending ||
		typeof pending.state !== "string" ||
		typeof pending.nonce !== "string" ||
		typeof pending.createdAt !== "number" ||
		params.get("state") !== pending.state ||
		Date.now() - pending.createdAt < 0 ||
		Date.now() - pending.createdAt > signInLifetime
	) {
		throw new Error(invalidResponse);
	}
	if (params.has("error")) {
		throw new Error("การเข้าสู่ระบบด้วย Google ถูกยกเลิกหรือไม่สำเร็จ กรุณาลองอีกครั้ง");
	}

	const idToken = params.get("id_token");
	if (!idToken) throw new Error(invalidResponse);
	try {
		const parts = idToken.split(".");
		if (parts.length !== 3) throw new Error(invalidResponse);
		const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")));
		if (claims.nonce !== pending.nonce) throw new Error(invalidResponse);
	} catch {
		throw new Error(invalidResponse);
	}

	// The backend verifies the token's signature, issuer, audience, expiry, and eligibility.
	const { data, error } = await api.auth.login.post({ googleIdToken: idToken });
	if (error || !data?.jwtSessionToken) {
		throw new Error("ไม่สามารถเข้าสู่ระบบได้ กรุณาใช้บัญชีนิสิตที่มีสิทธิ์เลือกตั้งแล้วลองอีกครั้ง");
	}
	localStorage.setItem("session_token", data.jwtSessionToken);
	window.location.replace(new URL("agreement", new URL(import.meta.env.BASE_URL, window.location.origin)).href);
	return true;
}
