import { signInWithGoogle } from "@/lib/firebase";

export default function LoginButton() {
	return (
		<button
			type="button"
			onClick={signInWithGoogle}
			style={{
				width: "250px",
				border: "none",
				background: "white",
				cursor: "pointer",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "10px",
				padding: "10px 20px",
				boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
				transition: "box-shadow 0.3s ease",
				borderRadius: "5px",
				fontFamily: "sans-serif",
				fontSize: "14px",
				fontWeight: "bold",
			}}
			onMouseOver={(e) => {
				e.currentTarget.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.4)";
			}}
			onMouseOut={(e) => {
				e.currentTarget.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
			}}
			onMouseDown={(e) => {
				e.currentTarget.style.boxShadow = "1px 1px 2px rgba(0, 0, 0, 0.5)";
			}}
			onMouseUp={(e) => {
				e.currentTarget.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.4)";
			}}
			onFocus={(e) => {
				e.currentTarget.style.boxShadow = "3px 3px 7px rgba(0, 0, 0, 0.4)";
			}}
			onBlur={(e) => {
				e.currentTarget.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
			}}
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 533.5 544.3"
				xmlns="http://www.w3.org/2000/svg"
				aria-labelledby="google-icon-title"
			>
				<title id="google-icon-title">Google logo</title>
				<path
					fill="#4285F4"
					d="M533.5 278.4c0-17.4-1.4-34.1-4-50.4H272v95.3h147.1c-6.4 34-25.2 62.9-53.5 82v68h86.4c50.6-46.6 81.5-115.2 81.5-195.9z"
				/>
				<path
					fill="#34A853"
					d="M272 544.3c72.6 0 133.5-24.1 178-65.3l-86.4-68c-24.1 16.1-55 25.7-91.6 25.7-70.5 0-130.3-47.6-151.6-111.5H30.9v69.9c44.4 87.8 135.4 149.2 241.1 149.2z"
				/>
				<path
					fill="#FBBC05"
					d="M120.4 325.2c-10.2-30.6-10.2-63.6 0-94.2V161H30.9c-36.3 72.6-36.3 158.7 0 231.3l89.5-67.1z"
				/>
				<path
					fill="#EA4335"
					d="M272 107.7c39.5-.6 77.2 13.9 106.1 39.8l79.2-79.2C414.6 23.3 345.5-1.1 272 0 166.3 0 75.3 61.4 30.9 149.2l89.5 67.1c21.3-63.8 81.1-111.4 151.6-111.5z"
				/>
			</svg>
			<span>Sign in with Google</span>
		</button>
	);
}
