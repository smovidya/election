import React, { useEffect, useState } from "react";

const candidatesData: Record<string, any> = {
  president: {
    position: "ตำแหน่งนายกสโมสร",
    studentId: "6534304723",
    number: 1,
    party: "Sci-Served",
    name: "นายจามิน จันทรสุวรรณ",
    department: "ภาควิชาคณิตศาสตร์และคอมพิวเตอร์",
    year: "ชั้นปีที่ 3",
    image: "/images/01_นายก.webp",
  },
  vice1: {
    position: "ตำแหน่งอุปนายกคนที่ 1",
    number: 1,
    studentId: "6531306423",
    party: "Sci-Served",
    name: "นายกิตติพัศ สิริเจิมจิตร",
    department: "ภาควิชาจุลชีววิทยา",
    year: "ชั้นปีที่ 3",
    image: "/images/02_อุป 1.webp",
  },
  vice2: {
    position: "ตำแหน่งอุปนายกคนที่ 2",
    number: 1,
    studentId: "6534357023",
    party: "Sci-Served",
    name: "นางสาวเอมอร พรมเพ็ง",
    department: "ภาควิชาคณิตศาสตร์และคอมพิวเตอร์",
    year: "ชั้นปีที่ 3",
    image: "/images/03_อุป 2.webp",
  },
  relation: {
    position: "ตำแหน่งประธานฝ่ายนิสิตสัมพันธ์",
    number: 1,
    party: "Sci-Served",
    studentId: "6638029023",
    name: "นางสาวนันท์นภัส หงษ์แปด",
    department: "หลักสูตรเทคโนโลยีชีวภาพ (นานาชาติ)",
    year: "ชั้นปีที่ 2",
    image: "/images/04_ฝ่ายนิสิตสัมพันธ์.webp",
  },
  sport: {
    position: "ตำแหน่งประธานฝ่ายกีฬา",
    number: 1,
    party: "Sci-Served",
    studentId: "6634095623",
    name: "นางสาวเสาวลักษณ์ สังข์ขาว",
    department: "ภาควิชาวัสดุศาสตร์",
    year: "ชั้นปีที่ 3",
    image: "/images/05_ฝ่ายกีฬา.webp",
  },
  academic: { // Note: changed from 'acadamic' to 'academic' for consistency (though old code used 'acadamic')
    position: "ตำแหน่งประธานฝ่ายวิชาการ",
    number: 1,
    party: "Sci-Served",
    studentId: "6532334123",
    name: "นางสาวรณิดา สูงสุมาลย์",
    department: "ภาควิชาเคมี",
    year: "ชั้นปีที่ 2",
    image: "/images/06_ฝ่ายวิชาการ.webp",
  },
  development: {
    position: "ตำแหน่งประธานฝ่ายพัฒนาสังคมและบำเพ็ญประโยชน์",
    number: 1,
    party: "Sci-Served",
    studentId: "6533279523",
    name: "นายวราวิชญ์ เชื้อสุวรรณรักษ์",
    department: "ภาควิชาวิทยาศาสตร์สิ่งแวดล้อม",
    year: "ชั้นปีที่ 3",
    image: "/images/07_ฝ่ายพัฒน์.webp",
  },
  treasurer: {
    position: "ตำแหน่งเหรัญญิก",
    number: 1,
    party: "Sci-Served",
    studentId: "6632417723",
    name: "นายชญานนท์ กุลวิภัชวัฒนา",
    department: "ภาควิชาเคมีเทคนิค",
    year: "ชั้นปีที่ 2",
    image: "/images/08_เหรัญญิก.webp",
  },
};

export default function VoteSummary() {
  const [voteData, setVoteData] = useState<Record<string, string> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: session check

  useEffect(() => {
    // Load vote data
    const data = sessionStorage.getItem("voteData");
    if (data) {
      setVoteData(JSON.parse(data));
    } else {
      alert("ไม่พบข้อมูลการโหวต กรุณาทำการเลือกตั้งอีกครั้ง");
      window.location.href = "/vote";
    }
  }, []);

  const handleConfirm = async () => {
    if (!voteData || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const allPositions = [
        { apiField: "president", voteKey: "president" },
        { apiField: "vice-president-1", voteKey: "vice1" },
        { apiField: "vice-president-2", voteKey: "vice2" },
        { apiField: "secretary", voteKey: null },
        { apiField: "treasurer", voteKey: "treasurer" },
        { apiField: "student-relations", voteKey: "relation" },
        { apiField: "academic", voteKey: "academic" }, 
        { apiField: "public-service", voteKey: "development" },
        { apiField: "art", voteKey: null },
        { apiField: "sport", voteKey: "sport" },
      ];

      const votes = allPositions.map((pos) => {
        if (!pos.voteKey) {
          return { candidateId: "no-vote", position: pos.apiField };
        }

        const voteValue = voteData[pos.voteKey] || voteData[pos.voteKey === 'academic' ? 'acadamic' : pos.voteKey];
        const candidate = candidatesData[pos.voteKey];

        switch (voteValue) {
          case "approve":
            return {
              candidateId: Number(candidate.studentId),
              position: pos.apiField,
            };
          case "disapprove":
            return {
              candidateId: "disapprove",
              position: pos.apiField,
            };
          case "abstain":
          default:
            return {
              candidateId: "no-vote",
              position: pos.apiField,
            };
        }
      });

      const token = window.localStorage.getItem("session_token");
      if (!token) {
        console.error("No token found");
        setIsSubmitting(false);
        return;
      }

      const api = import.meta.env.PUBLIC_API_URL || "https://api-smovidya-election.bunyawatapp37204.workers.dev";

      const _response = await fetch(`${api}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!_response.ok) throw new Error("Failed to fetch user data");

      const { studentId } = await _response.json() as any;
      const mockCurrentTime = new Date("2025-04-23T12:00:00+07:00").toISOString();
      const response = await fetch(`${api}/api/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${studentId}:${mockCurrentTime}`),
        },
        body: JSON.stringify({ votes }),
      });

      if (response.ok) {
        sessionStorage.removeItem("voteData");
        window.location.href = "/finish";
      } else {
        alert("เกิดข้อผิดพลาดในการส่งคะแนน");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setIsSubmitting(false);
    }
  };

  const renderVoteStatus = (vote: string) => {
    let text = "";
    let colorClass = "";
    switch (vote) {
      case "approve":
        text = "รับรอง";
        colorClass = "bg-green-100 text-green-800";
        break;
      case "disapprove":
        text = "ไม่รับรอง";
        colorClass = "bg-red-100 text-red-800";
        break;
      case "abstain":
        text = "งดออกเสียง";
        colorClass = "bg-gray-100 text-gray-800";
        break;
      default:
        return null;
    }
    return (
      <div className="mt-4">
        <span className={`px-4 py-2 rounded-lg font-semibold ${colorClass}`}>
          {text}
        </span>
      </div>
    );
  };

  if (!voteData) return null;

  return (
    <>
      <div className="space-y-8">
        {Object.entries(voteData).map(([positionKey, voteValue], index, array) => {
          // fallback to acadamic if academic wasn't found (astro code had a typo)
          const key = positionKey === 'acadamic' ? 'academic' : positionKey;
          const candidate = candidatesData[key];
          
          if (!candidate) return null;

          return (
            <section key={key} className="mb-12">
              <h3 className="text-xl font-semibold mb-4">{candidate.position}</h3>
              <div className="flex h-32 gap-1">
                <div className="flex flex-col w-1/5 items-center justify-center bg-purple-100 shadow-lg">
                  <span className="text-sm font-bold text-purple-900">หมายเลข</span>
                  <span className="text-2xl font-bold text-purple-900">
                    {candidate.number}
                  </span>
                </div>
                <div className="p-3 w-3/5 bg-white shadow-lg">
                  <p className="font-bold text-sm">พรรค {candidate.party}</p>
                  <p className="font-bold text-sm">{candidate.name}</p>
                  <br />
                  <p className="text-gray-600 text-xs">{candidate.department}</p>
                  <p className="text-gray-600 text-xs">{candidate.year}</p>
                </div>
                <img
                  src={candidate.image}
                  alt="Candidate"
                  className="object-cover shadow-lg bg-white"
                  style={{ height: "128px", width: "96px" }}
                />
              </div>
              {renderVoteStatus(voteValue as string)}
              {index !== array.length - 1 && <hr className="my-8 border-gray-300" />}
            </section>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <button
          className="bg-gray-200 text-black px-8 py-3 rounded-lg ml-4 transition-colors"
          onClick={() => (window.location.href = "/election")}
          disabled={isSubmitting}
        >
          แก้ไขคะแนน
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="bg-yellow text-black px-8 py-3 rounded-lg transition-colors ml-4 disabled:opacity-50"
        >
          {isSubmitting ? "กำลังส่งข้อมูล..." : "ยืนยันการลงคะแนน"}
        </button>
      </div>
    </>
  );
}