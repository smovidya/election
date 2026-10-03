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
    color: "#059669",
    personal_vision: {
      th: "เสริมสร้างความสัมพันธ์อันดีระหว่างนิสิตคณะวิทยาศาสตร์และนิสิตคณะอื่นๆ ในรั้วจุฬาลงกรณ์มหาวิทยาลัย รวมถึงนิสิตจากมหาวิทยาลัยต่างๆ และสร้างพื้นที่ โครงการให้นิสิตได้แสดงศักยภาพเรียนรู้ประสบการณ์ใหม่นอกห้องเรียนร่วมกับนิสิตจากคณะและมหาวิทยาลัยอื่นๆ",
      en: "Strengthen relationships between science students and students from other faculties at Chulalongkorn University, as well as students from other universities. Create spaces and projects where students can demonstrate their potential and gain new experiences beyond the classroom alongside students from other faculties and universities. (Translated from Thai)",
    },
    personal_mission: {
      th: "1. ต่อยอด : ต่อยอดโครงการสานสัมพันธ์ต่างๆที่อยู่ภายใต้ฝ่ายอุปนายกคนที่ 2 เช่นโครงการถนนคนเดินเชื่อมสัมพันธ์ ( Vid Love Vid U ) และโครงการค่ายแนะแนว 3 สัญจรสอนสัมพันธ์ (3 sanjorn son 3 phan camp)\n2. เสริมสร้าง : ริเริ่มโครงการสานสัมพันธ์ กับคณะหรือมหาวิทยาลัยใหม่ๆเพื่อเป็นการเพิ่มพื้นที่เรียนรู้และมอบประสบการณ์ใหม่กับนิสิตคณะวิทยาศาสตร์",
      en: "1. Build on existing initiatives: Develop relationship-building projects under the 2nd Vice President, such as Vid Love Vid U and the 3 Sanjorn Son 3 Phan guidance camp.\n2. Strengthen connections: Initiate relationship-building projects with new faculties or universities to expand learning opportunities and offer new experiences to science students.\n(Translated from Thai)",
    },
    personal_experience: {
      th: "- สมาชิกฝ่ายอุปนายกคนที่ 2 ปีการศึกษา 2567-2569\n- ประธานโครงการแรกพบจุฬาฯ ส่วนงานคณะวิทยาศาสตร์ Sci CU First Date 2026\n- ประธานโครงการ Vid Love Vid U 69 ปีการศึกษา 2568 ร่วมกับคณะวิศวกรรมศาสตร์\n- รองประธานโครงการแรกพบจุฬาฯ ส่วนงานคณะวิทยาศาสตร์ Sci CU First Date 2025\n- ประธานฝ่ายเนื้อหา CU First Date ( Freshmen festival 2025)\n- ประธานฝ่ายเนื้อหา CANVASS 2025 ร่วมกับคณะอักษรศาสตร์ คณะรัฐศาสตร์ และคณะศิลปกรรมศาสตร์\n- ประธานจัดการวิ่ง 5MHOONY charity run 2025\n- ประธานฝ่าย Freshmen Night (รับเพื่อนก้าวใหม่ 2026)\n- ประธานฝ่ายเนื้อหา ค่าย 3 สัญจร สอนสัมพันธ์ ครั้งที่ 2 ร่วมกับคณะวิศวกรรมศาสตร์ และคณะเภสัชศาสตร์\n- ประธานฝ่ายเนื้อหา งานกีฬาสานสัมพันธ์ คณะวิทยาศาสตร์ Sci CU-MU ร่วมกับมหาวิทยาลัยมหิดล",
      en: "- Member of the 2nd Vice President's team, academic years 2024–2026\n- Project chair, Faculty of Science's Sci CU First Date 2026\n- Project chair, Vid Love Vid U 69, academic year 2025, with the Faculty of Engineering\n- Deputy project chair, Faculty of Science's Sci CU First Date 2025\n- Content chair, CU First Date (Freshmen Festival 2025)\n- Content chair, CANVASS 2025, with the Faculties of Arts, Political Science, and Fine and Applied Arts\n- Run management chair, 5MHOONY Charity Run 2025\n- Freshmen Night chair (Freshmen Welcome 2026)\n- Content chair, 2nd 3 Sanjorn Son Samphan camp, with the Faculties of Engineering and Pharmaceutical Sciences\n- Content chair, Sci CU-MU science sports relationship-building event, with Mahidol University\n(Translated from Thai)",
    },
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
    color: "#DC2626",
    personal_vision: {
      th: "เปิดโอกาสในการเสริมสร้างเครือข่ายระหว่างคณะวิทยาศาสตร์กับองค์กรภายนอก ทั้งในและนอกรั้วจุฬาฯ\nสร้างความร่วมมือข้ามสายงานอย่างเป็นรูปธรรม พร้อมส่งเสริมภาพลักษณ์องค์กรที่ทันสมัยและเข้าถึงง่าย",
      en: "Create opportunities to strengthen networks between the Faculty of Science and external organizations, both within and beyond Chulalongkorn University. Establish concrete collaboration across disciplines while promoting a modern and approachable organizational image. (Translated from Thai)",
    },
    personal_mission: {
      th: "1. ดำเนินการจัดกิจกรรมร่วมกับสโมสรต่างคณะ (เช่น วิศวะ, นิเทศ, เภสัช) และองค์กรภายนอก เพื่อเปิดพื้นที่ให้นิสิตวิทยาศาสตร์ได้แลกเปลี่ยนความรู้ ต่อยอดนวัตกรรม และสร้างคอนเนกชันเชิงอาชีพ\n2. ส่งเสริมกิจกรรมเชื่อมสัมพันธ์และการทำงานร่วมกับสังคม บริหารจัดการโครงการร่วมกับองค์กรภายนอกและงานจิตอาสา โดยนำองค์ความรู้ทางวิทยาศาสตร์ไปประยุกต์ใช้เพื่อสร้างประโยชน์ให้แก่ชุมชนและสังคมอย่างยั่งยืน",
      en: "1. Organize activities with student unions from other faculties, such as Engineering, Communication Arts, and Pharmaceutical Sciences, and with external organizations, enabling science students to exchange knowledge, develop innovations, and build professional connections.\n2. Promote relationship-building activities and engagement with society. Manage projects with external organizations and volunteer initiatives that apply scientific knowledge to create lasting benefits for communities and society.\n(Translated from Thai)",
    },
    personal_experience: {
      th: "1. สมาชิกฝ่ายอุปนายกคนที่ 2 สโมสรนิสิตคณะวิทยาศาสตร์ ปีการศึกษา 2568\n2. ประธานโครงการค่าย 3 สัญจร สอนสัมพันธ์ ครั้งที่ 3\n3. ประธานอำนวยการ 1 โครงการแรกพบจุฬาฯ ส่วนงานคณะวิทยาศาสตร์ ปีการศึกษา 2569\n4. หัวหน้าฝ่ายทะเบียนและบัตร โครงการชีวิตสั้น แฟชั่นยั่งยืน (canVASS 2025)\n5. หัวหน้าฝ่ายพยาบาล โครงการถนนคนเดินเชื่อมสัมพันธ์ วิศวฯ-วิทยาฯ (Vid Love Vid U 2026)\n6. หัวหน้าฝ่าย Stage โครงการปัจฉิมนิเทศ คณะวิทยาศาสตร์ ประจำปีการศึกษา 2568\n7. หัวหน้าฝ่าย Short Video & Production โครงการ Vidya Freshmen Festival 2026\n8. หัวหน้าฝ่าย PR & Photo โครงการการแข่งขันตอบปัญหาวิชาการเคมี ครั้งที่ 14 (14th ChemChallenge)",
      en: "1. Member of the 2nd Vice President's team, Science Student Union, academic year 2025\n2. Project chair, 3rd 3 Sanjorn Son Samphan camp\n3. Executive chair 1, Faculty of Science's CU First Date project, academic year 2026\n4. Registration and tickets head, Life Is Short, Fashion Is Sustainable (canVASS 2025)\n5. First aid head, Engineering–Science relationship-building walking street (Vid Love Vid U 2026)\n6. Stage head, Faculty of Science farewell event, academic year 2025\n7. Short Video & Production head, Vidya Freshmen Festival 2026\n8. PR & Photo head, 14th ChemChallenge academic chemistry quiz competition\n(Translated from Thai)",
    },
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
    color: "#003399",
    personal_vision: {
      th: "เพื่อร่วมกันสร้างสัมพันธ์ระหว่างคณะวิทยาศาสตร์กับองค์กรต่าง ๆ ทั้งภายในและภายนอกมหาวิทยาลัย ส่งเสริมการทำงานร่วมกับผู้อื่น การเรียนรู้และเพิ่มพูนประสบการณ์ผ่านการทำกิจกรรม และนำไปต่อยอดในมุมมองการทำงาน สู่ภาพลักษณ์อันดีขององค์กร",
      en: "Work together to build relationships between the Faculty of Science and organizations within and outside the university. Encourage collaboration, learning, and gaining experience through activities, then apply those experiences to approaches to work that contribute to a positive organizational image. (Translated from Thai)",
    },
    personal_mission: {
      th: "1. สานต่อโครงการที่เคยมีมาร่วมกันกับคณะหรือองค์กรต่าง ๆ เพื่อคงไว้ซึ่งเครือข่ายระหว่างกัน เช่น โครงการถนนคนเดินเชื่อมสัมพันธ์ วิศวฯ-วิทยาฯ, โครงการค่าย 3 สัญจร สอนสัมพันธ์ และอื่น ๆ โดยต่อยอดจากความรู้เดิม รวมถึงดำเนินการจัดหากิจกรรมอื่นเพิ่มเติม\n2. ส่งเสริมโครงการสร้างสรรค์และขยายพันธมิตรสู่คณะใหม่ ๆ และแสวงหาความร่วมมือกับคณะหรือองค์กรที่ไม่เคยทำงานร่วมกันมาก่อน โดยเน้นการบูรณาการข้ามสายวิชาชีพ ผ่านกิจกรรมรูปแบบใหม่\n3. วางระบบการบริหารและจัดเก็บข้อมูลเพื่อให้การประสานงานกับคณะต่าง ๆ เป็นไปด้วยความรวดเร็ว มีประสิทธิภาพ",
      en: "1. Continue joint projects with faculties and organizations to maintain existing networks, including the Engineering–Science relationship-building walking street and the 3 Sanjorn Son Samphan camp. Build on existing knowledge and introduce additional activities.\n2. Promote creative projects, expand partnerships to new faculties, and seek collaboration with faculties or organizations that have not worked together before, emphasizing interdisciplinary integration through new forms of activity.\n3. Establish management and information storage systems to make coordination with other faculties faster and more efficient.\n(Translated from Thai)",
    },
    personal_experience: {
      th: "สมาชิกฝ่ายอุปนายกคนที่ 2 สโมสรนิสิตคณะวิทยาศาสตร์ ปีการศึกษา 2568\nBSAC 20 Vice president, Head of Activity\nเหรัญญิก โครงการ Freshmen night (รับเพื่อนก้าวใหม่ 2025)\nประธานฝ่ายเนื้อหา โครงการค่าย 3 สัญจร สอนสัมพันธ์ ครั้งที่ 3\nประธานฝ่ายเนื้อหา โครงการแรกพบจุฬาฯ ส่วนงานคณะวิทยาศาสตร์ ปีการศึกษา 2569\nหัวหน้าฝ่าย Booth wellness โครงการถนนคนเดินเชื่อมสัมพันธ์ วิศวฯ-วิทยาฯ (Vid Love Vid U 2026)\nหัวหน้าฝ่าย Workshop โครงการชีวิตสั้น แฟชั่นยั่งยืน (canVASS2025)\nประสานศิลปิน โครงการ Freshmen night (รับเพื่อนก้าวใหม่ 2026)",
      en: "Member of the 2nd Vice President's team, Science Student Union, academic year 2025\nBSAC 20 Vice President, Head of Activity\nTreasurer, Freshmen Night (Freshmen Welcome 2025)\nContent chair, 3rd 3 Sanjorn Son Samphan camp\nContent chair, Faculty of Science's CU First Date project, academic year 2026\nBooth Wellness head, Engineering–Science relationship-building walking street (Vid Love Vid U 2026)\nWorkshop head, Life Is Short, Fashion Is Sustainable (canVASS2025)\nArtist coordinator, Freshmen Night (Freshmen Welcome 2026)\n(Translated from Thai)",
    },
    image: "/c3.png",
  },
] satisfies Candidate[];
