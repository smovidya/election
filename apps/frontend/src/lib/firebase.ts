import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import Cookies from "js-cookie";

const firebaseConfig = {
	apiKey: "AIzaSyB_G0NVd4UrOWV3xXesJklV5qqKDkaIASQ",
	authDomain: "smovidyaelection-c8938.firebaseapp.com",
	projectId: "smovidyaelection-c8938",
	storageBucket: "smovidyaelection-c8938.firebasestorage.app",
	messagingSenderId: "120194991470",
	appId: "1:120194991470:web:fbcf31463f3d7ab890ad7f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
	console.log("Sign-in clicked");

	return signInWithPopup(auth, provider)
		.then(async (result) => {
			const user = result.user;
			const email = user.email;
			const domain = email?.split("@")[1];
			const username = email?.split("@")[0]; // แยกส่วนก่อน @
			const lastTwo = username?.slice(-2); // ตัดตัวอักษร 2 ตัวสุดท้าย
			if (domain !== "student.chula.ac.th" || lastTwo !== "23") {
				alert("กรุณาใช้ Email นิสิตในการเข้าสู่ระบบ");
				return;
			}
			const token = await user.getIdToken();

			// 🍪 Save token to cookie (you can name it whatever)
			Cookies.set("token", token, { expires: 7 }); // expires in 7 days
			const sessionExpiry = Date.now() + 30 * 60 * 1000; // 30 นาทีในมิลลิวินาที
			Cookies.set("sessionExpiry", sessionExpiry.toString(), {
				expires: new Date(sessionExpiry), // ตั้งอายุคุกกี้ให้ตรงกับ timestamp
			});

			try {
				const response = await fetch("https://api-smovidya-election.bunyawatapp37204.workers.dev/api/eligibility", {
					method: "GET",
					headers: {
						// biome-ignore lint/style/useNamingConvention: <explanation>
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();

				if (data.eligible === false || data.reason === "voted-already") {
					window.location.href = "/finish";
				} else {
					window.location.href = "/agreement";
				}
			} catch (error) {
				console.error(error);
			}
		})
		.catch((error) => {
			console.error("Error signing in:", error);
		});
};
