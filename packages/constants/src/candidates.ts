import type { Candidate, Party, Position } from "./types";

/** ตำแหน่งที่มีการเลือกตั้งในครั้งนี้ */
export const running_positions = [
  {
    position_id: "vp2" as const,
    name: { th: "อุปนายกคนที่ 2", en: "2nd Vice President" },
  },
] satisfies Position[];

/** พรรคที่มีผู้สมัครลงเลือกตั้งในครั้งนี้ */
export const parties: Party[] = [];

/** ผู้สมัครที่ลงเลือกตั้งในครั้งนี้ */
export const candidates = [
  {
    candidate_id: "c1" as const,
    candidate_number: 1,
    full_name: "สาริศา ชัยกมลสิทธิ์",
    study_year: 4,
    study_program: {
      th: "เทคโนโลยีชีวภาพ (นานาชาติ)",
      en: "Biotechnology (International Program)",
    },
    position_id: "vp2",
    party_id: "independent",
    color: "#16a34a",
    personal_vision: {},
    personal_mission: {
      th: "1. ต่อยอด : ต่อยอดโครงการสานสัมพันธ์ต่างๆที่อยู่ภายใต้ฝ่ายอุปนายกคนที่ 2 เช่นโครงการถนนคนเดินเชื่อมสัมพันธ์ ( Vid Love Vid U ) และโครงการค่ายแนะแนว 3 สัญจรสอนสัมพันธ์ (3 sanjorn son 3 phan camp)\n2. เสริมสร้าง : ริเริ่มโครงการสานสัมพันธ์ กับคณะหรือมหาวิทยาลัยใหม่ๆเพื่อเป็นการเพิ่มพื้นที่เรียนรู้และมอบประสบการณ์ใหม่กับนิสิตคณะวิทยาศาสตร์",
      en: "1. Build on existing initiatives: Develop relationship-building projects under the 2nd Vice President, such as Vid Love Vid U and the 3 Sanjorn Son 3 Phan guidance camp.\n2. Strengthen connections: Initiate relationship-building projects with new faculties or universities to expand learning opportunities and offer new experiences to science students.\n(Translated from Thai)",
    },
    personal_experience: {},
    image: "/c1.png",
  },
  {
    candidate_id: "c2" as const,
    candidate_number: 2,
    full_name: "ทัตพิชา พงษ์ภัทระวิทย์",
    study_year: 3,
    study_program: {
      th: "เคมีประยุกต์ (นานาชาติ)",
      en: "Applied Chemistry (International Program)",
    },
    position_id: "vp2",
    party_id: "independent",
    color: "#dc2626",
    personal_vision: {},
    personal_mission: {
      th: "1. ดำเนินการจัดกิจกรรมร่วมกับสโมสรต่างคณะ (เช่น วิศวะ, นิเทศ, เภสัช) และองค์กรภายนอก เพื่อเปิดพื้นที่ให้นิสิตวิทยาศาสตร์ได้แลกเปลี่ยนความรู้ ต่อยอดนวัตกรรม และสร้างคอนเนกชันเชิงอาชีพ\n2. ส่งเสริมกิจกรรมเชื่อมสัมพันธ์และการทำงานร่วมกับสังคม บริหารจัดการโครงการร่วมกับองค์กรภายนอกและงานจิตอาสา โดยนำองค์ความรู้ทางวิทยาศาสตร์ไปประยุกต์ใช้เพื่อสร้างประโยชน์ให้แก่ชุมชนและสังคมอย่างยั่งยืน",
      en: "1. Organize activities with student unions from other faculties, such as Engineering, Communication Arts, and Pharmaceutical Sciences, and with external organizations, enabling science students to exchange knowledge, develop innovations, and build professional connections.\n2. Promote relationship-building activities and engagement with society. Manage projects with external organizations and volunteer initiatives that apply scientific knowledge to create lasting benefits for communities and society.\n(Translated from Thai)",
    },
    personal_experience: {},
    image: "/c2.png",
  },
  {
    candidate_id: "c3" as const,
    candidate_number: 3,
    full_name: "จิณห์จุฑา อุ่มเอิบ",
    study_year: 3,
    study_program: {
      th: "เคมีประยุกต์ (นานาชาติ)",
      en: "Applied Chemistry (International Program)",
    },
    position_id: "vp2",
    party_id: "independent",
    color: "#0ea5e9",
    personal_vision: {},
    personal_mission: {
      th: "1. สานต่อโครงการที่เคยมีมาร่วมกันกับคณะหรือองค์กรต่าง ๆ เพื่อคงไว้ซึ่งเครือข่ายระหว่างกัน เช่น โครงการถนนคนเดินเชื่อมสัมพันธ์ วิศวฯ-วิทยาฯ, โครงการค่าย 3 สัญจร สอนสัมพันธ์ และอื่น ๆ โดยต่อยอดจากความรู้เดิม รวมถึงดำเนินการจัดหากิจกรรมอื่นเพิ่มเติม\n2. ส่งเสริมโครงการสร้างสรรค์และขยายพันธมิตรสู่คณะใหม่ ๆ และแสวงหาความร่วมมือกับคณะหรือองค์กรที่ไม่เคยทำงานร่วมกันมาก่อน โดยเน้นการบูรณาการข้ามสายวิชาชีพ ผ่านกิจกรรมรูปแบบใหม่\n3. วางระบบการบริหารและจัดเก็บข้อมูลเพื่อให้การประสานงานกับคณะต่าง ๆ เป็นไปด้วยความรวดเร็ว มีประสิทธิภาพ",
      en: "1. Continue joint projects with faculties and organizations to maintain existing networks, including the Engineering–Science relationship-building walking street and the 3 Sanjorn Son Samphan camp. Build on existing knowledge and introduce additional activities.\n2. Promote creative projects, expand partnerships to new faculties, and seek collaboration with faculties or organizations that have not worked together before, emphasizing interdisciplinary integration through new forms of activity.\n3. Establish management and information storage systems to make coordination with other faculties faster and more efficient.\n(Translated from Thai)",
    },
    personal_experience: {},
    image: "/c3.png",
  },
] satisfies Candidate[];
