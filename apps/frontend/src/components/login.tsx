import React from 'react'
import Logo from "@/assets/logo-color-black.png";
import LoginButton from "../components/ui/SignInWithGoogle.tsx";

function LoginContainer() {
    return (
        <div className='w-full h-screen relative flex items-center justify-center'>
            <div
                className="absolute inset-0 z-0"
                style={{
                background: "#ffffff",
                backgroundImage: `
                    radial-gradient(
                    circle at top left,
                    rgba(255, 140, 60, 0.5),
                    transparent 70%
                    )
                `,
                filter: "blur(80px)",
                backgroundRepeat: "no-repeat",
                }}
            />
            <div className=' w-60 flex items-center flex-col gap-6 z-40'>
                <div className='w-30'>
                    <img src={Logo.src} alt='logo_color' className=' w-full h-full object-contain' />
                </div>
                <LoginButton />
                <div className="text-sm font-noto text-pink-600 text-center">
                    ใช้ Email นิสิต <br/> (6xxxxxxx23@student.chula.ac.th) <br/> ในการเข้าสู่ระบบเท่านั้น
                </div>
            </div>
        </div>
    )
}
export default LoginContainer
