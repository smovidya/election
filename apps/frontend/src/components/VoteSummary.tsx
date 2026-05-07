import { api } from "@/lib/api";
import { candidates } from "@repo/constants";
import { useEffect, useState } from "react";

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
        candidates

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

      // const _response = await fetch(`${api}/api/me`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const { data, error: e1 } = await api.auth.me.get({
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (e1) {
        throw e1;
      }

      const studentId = data.studentId as string;

      // if (!_response.ok) throw new Error("Failed to fetch user data");

      // const { studentId } = await _response.json() as any;
      // console.log(votes)
      const mockCurrentTime = new Date("2025-04-23T12:00:00+07:00").toISOString();
      const { error } = await api.election["cast-vote"].post({
        votes: votes as any
      }, {
        headers: {
          // this is dev only?????
          Authorization: "Basic " + btoa(`${studentId}:${mockCurrentTime}`),
        }
      });

      if (!error) {
        sessionStorage.removeItem("voteData");
        window.location.href = "/finish";
      } else {
        console.error(error);
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