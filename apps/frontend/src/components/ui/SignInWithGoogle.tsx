import { useEffect, useRef } from "react";
import { api } from "@/lib/api";

declare global {
	interface Window {
		google: {
			accounts: {
				id: {
					initialize: (config: object) => void;
					renderButton: (element: HTMLElement, config: object) => void;
					prompt: () => void;
				};
			};
		};
	}
}

export default function SignInWithGoogle() {
	const buttonRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		async function handleCredentialResponse(response: { credential: string }) {
			const { data, error } = await api.auth.login.post({
				googleIdToken: response.credential,
			});

			if (error) {
				if (error?.status === 401) {
					return alert(
						`คุณไม่ได้รับอนุญาตให้เข้าสู่ระบบด้วยบัญชีนี้ โปรดเลือกบัญชีนิสิตที่ลงท้ายด้วย @student.chula.ac.th เท่านั้น`,
					);
				}
				if (error?.status === 403) {
					return alert(
						`บัญชีนี้ไม่สามารถใช้เลือกตั้งได้ อาจเป็นเพราะคุณไม่ใช่นิสิตในคณะวิทยาศาสตร์ที่มีสิทธิ์เลือกตั้ง หรือบัญชีของคุณถูกระงับการใช้งาน โปรดติดต่อสโมสรนิสิตคณะวิทยาศาสตร์เพื่อขอความช่วยเหลือ`,
					);
				}
				if (error?.status === 422) {
					return alert(
						`ข้อมูลจาก Google ไม่สมบูรณ์ ลองรีเฟรชหน้าเว็บแล้วลองอีกครั้ง หากยังมีปัญหา โปรดติดต่อสโมสรนิสิตคณะวิทยาศาสตร์เพื่อขอความช่วยเหลือ`,
					);
				}
			}

			if (!data) {
				return alert(
					`เกิดข้อผิดพลาดในการเข้าสู่ระบบ โปรดลองอีกครั้ง หากยังมีปัญหา โปรดติดต่อสโมสรนิสิตคณะวิทยาศาสตร์เพื่อขอความช่วยเหลือ`,
				);
			}

			window.localStorage.setItem("session_token", data.jwtSessionToken);
			window.location.href = "/agreement";
		}

		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.onload = () => {
			window.google.accounts.id.initialize({
				client_id:
					"878635631561-996p9vdbemp1n3r7dcs91i9f0e6i25fi.apps.googleusercontent.com",
				callback: handleCredentialResponse,
				hd: "chula.ac.th",
			});
			if (buttonRef.current) {
				window.google.accounts.id.renderButton(buttonRef.current, {
					theme: "outline",
					size: "large",
				});
			}
			window.google.accounts.id.prompt();
		};
		document.head.appendChild(script);

		return () => {
			document.head.removeChild(script);
		};
	}, []);

	return <div ref={buttonRef} />;
}
