import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AgreementCard() {
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("session_token");
    if (!token) {
      setError(true);
      return;
    }

    api.auth.me
      .get({ headers: { Authorization: `Bearer ${token}` } })
      .then(({ data, error }) => {
        if (error || !data) {
          setError(true);
          return;
        }
        setStudentId(data.studentId);
        setStudentName(data.studentName);
      });
  }, []);

  const displayValue = (value: string | null) => {
    if (error) return "ข้อมูลไม่พร้อมใช้งาน";
    return value ?? "Loading...";
  };

  return (
    <div className="bg-yellow min-h-screen p-8 flex items-center justify-center font-noto">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="mb-4 space-y-1 text-base text-dgray">
          <div className="flex justify-between">
            <span>รหัสนิสิต</span>
            <span>{displayValue(studentId)}</span>
          </div>
          <div className="flex justify-between">
            <span>ชื่อ-นามสกุล</span>
            <span>{displayValue(studentName)}</span>
          </div>
        </div>

        <div className="border-b border-black my-8" />

        <h1 className="text-center font-bold text-black text-xl mb-4">
          ข้อกำหนดและเงื่อนไข
        </h1>

        <ul className="list-disc pl-5 text-sm text-dgray space-y-2">
          <li>
            ขณะนี้ท่านกำลังใช้งานเว็บไซต์และมองหน้าจอเพียงบุคคลเดียว
            โดยมิได้ถูกบังคับ ข่มเหงหรือชักจูงจากใครในการลงคะแนนเสียงเลือกตั้ง
          </li>
          <li>ข้อมูลส่วนบุคคลของท่านถูกต้องทั้งหมด</li>
          <li>
            ท่านมีเวลาทั้งสิ้น 30 นาที ในการเข้าสู่ระบบเพื่อทำการลงคะแนนเสียง
            จนเสร็จสิ้น
          </li>
          <li>
            ท่านยอมรับคะแนนเสียงที่โหวตผ่านเว็บไซต์ เลือกตั้ง คณะวิทยาศาสตร์
            จุฬาลงกรณ์มหาวิทยาลัย ให้ถือเป็นที่สิ้นสุด
          </li>
        </ul>

        <div className="mt-12 flex justify-center">
          <button
            className="bg-yellow hover:bg-yellow/80 transition text-black text-sm font-semibold py-2 px-4 rounded-xl shadow-md"
            onClick={() => {
              window.location.href = "/election";
            }}
          >
            ยอมรับข้อกำหนดและเงื่อนไข
          </button>
        </div>
      </div>
    </div>
  );
}
