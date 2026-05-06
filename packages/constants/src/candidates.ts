import { AlphaNumericString, Candidate, Party, Position } from "./types";

const running_year = 2569;

/**
 * ตำแหน่งที่มีการเลือกตั้งในครั้งนี้
 */
export const running_positions = [
  {
    position_id: "president" as const,
    name: {
      th: "นายกสโมสรนิสิต",
      en: "President",
    },
  },
  {
    position_id: "head_of_student_relations" as const,
    name: {
      th: "ประธานฝ่ายนิสิตสัมพันธ์",
      en: "Head of Student Relations",
    },
  },
  {
    position_id: "head_of_sports" as const,
    name: {
      th: "ประธานฝ่ายกีฬา",
      en: "Head of Sports",
    },
  },
] satisfies Position[];

/**
 * พรรคที่มีผู้สมัครลงเลือกตั้งในครั้งนี้
 */
export const parties = [
  {
    party_id: "scipah" as const,
    name: {
      th: "SCI-PAH?",
      en: "SCI-PAH?",
    },
    visions: {
      th: "Creating SMO69, Where Ambition meet Connection: เปิดโอกาสให้นิสิตคณะวิทยาศาสตร์ทุกคนได้มี พื้นที่ในการเรียนรู้ และลองทำในสิ่งที่ชอบ ได้ มีพื้นที่ในการค้นหาตัวเอง และเป็น Community ที่จะสร้าง Connection ที่ดีให้แก่นิสิตคณะวิทยาศาสตร์ทุกคน",
      en: "Creating SMO69, Where Ambition meet Connection: Providing opportunities for all science students to have a space for learning and trying what they like, find themselves, and create a good community for all science students (Automatically translated from Thai)",
    },
    color: "#D4BBDF",
  },
] satisfies Party[];

/**
 * ผู้สมัครที่ลงเลือกตั้งในครั้งนี้
 */
export const candidates = [
  {
    candidate_id: "c1" as const,
    full_name: "นันท์นภัส หงษ์แปด",
    study_year: 3,
    study_program: {
      th: "หลักสูตรเทคโนโลยีชีวภาพ (นานาชาติ)",
      en: "B.Sc. Biotechnology (International Program)",
    },
    position_id: "president",
    party_id: "scipah",
    personal_vision: {
      th: "สร้างสโมสรนิสิตฯ ให้เป็นพื้นที่ของทุกคน เพื่อสนับสนุนการเรียนรู้ ส่งเสริมศักยภาพนิสิต และสร้างมิตรภาพที่ดีร่วมกัน เป็นศูนย์กลางที่รับฟังทุกความเห็น เพื่อเติบโตไปด้วยกัน",
      en: "Creating a student club that is a space for all students to learn and grow together (Automatically translated from Thai)",
    },
    personal_mission: {
      th: `1. Open Space, Open Heart: สโมสรนิสิตฯ จะเป็นพื้นที่ให้กับนิสิตคณะวิทยาศาสตร์ทุกคน ได้ลอง ได้เรียนรู้ ได้ประสบการณ์ ได้มิตรภาพที่ดี เป็นพื้นที่ให้นิสิตทุกคนได้เติบโตอย่างอบอุ่น เช่น การผลักดันกิจกรรมภายในคณะให้หลากหลาย และเข้าถึงนิสิตคณะวิทยาศาสตร์ทุกคน\n2. What's Happening in SMO69: แจกแจงเกี่ยวกับการจัดกิจกรรม และการดำเนินงานของสโมสรนิสิตคณะวิทยาศาสตร์ ผ่านการสร้างปฏิทินประชาสัมพันธ์ (Monthly Activity) เพื่อให้นิสิตทุกคนได้เข้าถึงกิจกรรม และผลักดันให้สโมสรนิสิตฯ เป็นพื้นที่ของนิสิตคณะวิทยาศาสตร์ทุกคน\n3. Support All Around: ผลักดันให้กิจกรรมที่จัดขึ้นโดย คณะกรรมการสโมสรนิสิตฯ ชมรม กลุ่มนิสิต องค์กรต่าง ๆ ภายในคณะวิทยาศาสตร์ ให้จัดกิจกรรมและโครงการได้อย่างราบรื่น ผ่านการสนับสนุนจากนายกสโมสรนิสิต ที่พร้อมให้คำปรึกษา และรับฟังทุกปัญหาอย่างเข้าใจ`,
      en: `1. Open Space, Open Heart: The student's union will be a space for all science students to try, learn, gain experience, and make good friendships. It will be a space for all students to grow warmly, such as by promoting activities within the faculty to be diverse and accessible to all science students.\n2. What's Happening in SMO69: Explaining about the organization of activities and operations of the Science Student's Union through creating a publicity calendar (Monthly Activity) for all students to access the activities and pushing the student's union to be a space for all science students.\n3. Support All Around: Pushing for activities organized by the student's Union Committee, clubs, student groups, and various organizations within the Faculty of Science to organize activities and projects smoothly through support from the President who is ready to provide advice and listen to all problems with understanding\n(Automatically translated from Thai)`,
    },
    personal_experience: {
      th: `1. ประธานฝ่ายนิสิตสัมพันธ์ สโมสรนิสิตคณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ปีการศึกษา 2568\n2. ประธานโครงการเทศกาลต้อนรับนิสิตใหม่ คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ปีการศึกษา 2568\n3. ประธานโครงการตลาดนัดนิสิต เสือเหลือง แฟร์ 2026 (SUEALUEANG FAIR 2026)\n4. ประธานฝ่ายเนื้อหา โครงการกีฬาเพื่อนใหม่ ประจำปีการศึกษา 2568\n5. รองประธานโครงการถนนคนเดินเชื่อมสัมพันธ์ วิศวฯ-วิทยาฯ (Vid Love Vid U 2026)\n6. รองประธานโครงการ Science Chula Open House 2026\n7. รองประธานโครงการคัดเลือกพิธีกร คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ปีการศึกษา 2568\n8. เลขานุการ โครงการค่าย 3 สัญจร สอนสัมพันธ์ ครั้งที่ 2`,
      en: `1. Head of Student Relations, Science Student's Union, Chulalongkorn University, Academic Year 2568\n2. President of the Freshmen Festival, Faculty of Science, Chulalongkorn University, Academic Year 2568\n3. President of the SUEALUEANG FAIR 2026\n4. Content Head of the Freshmen Sports for the Academic Year 2568\n5. Vice President of the Vid Love Vid U 2026, a walking street connecting engineering and science faculties\n6. Vice President of the Science Chula Open House 2026\n7. Vice President of the Master of Ceremonies Selection, Faculty of Science, Chulalongkorn University, Academic Year 2568\n8. Secretary of the 3rd Roaming Relations Camp Teaching\n(Automatically translated from Thai)`,
    },
    image: "/c1.jpg",
  },
  {
    candidate_id: "c2" as const,
    full_name: "เปมิกา เจริญองค์",
    study_year: 2,
    study_program: {
      th: "หลักสูตรเทคโนโลยีชีวภาพ (นานาชาติ)",
      en: "B.Sc. Biotechnology (International Program)",
    },
    position_id: "head_of_student_relations",
    party_id: "scipah",
    personal_vision: {
      th: "สร้างพื้นที่แห่งความสุข เชื่อมโยงทุกคนด้วยความเข้าใจ ด้วยกิจกรรมสร้างสรรค์ที่เข้าถึงง่าย และการสื่อสารที่จริงใจ เพื่อสร้างสังคมนิสิตที่น่ารักและสามัคคียิ่งกว่าเดิม",
      en: "Creating a happy space, connecting everyone with understanding through accessible creative activities and sincere communication, to build a more lovely and united student community (Automatically translated from Thai)",
    },
    personal_mission: {
      th: `1. First Step Together: สร้างความสัมพันธ์ที่ดีให้กับนิสิตใหม่ เริ่มต้นจากกิจกรรมนิสิตใหม่ ออกแบบกิจกรรมให้มีความหลากหลายมากขึ้น และให้รู้สึกถึงความเป็นหนึ่งเดียวกันเพื่อเพิ่มสัมพันธ์ที่ดีให้แก่นิสิตใหม่และนิสิตเดิม เช่น การจัดกิจกรรมโดยคำนึงถึงนิสิตกลุ่มอินเตอร์และกลุ่มนิสิตที่มีความชอบต่าง ๆ เพื่อให้ทุกคนสามารถเพลิดเพลินกับกิจกรรมได้และมีประสบการณ์ที่ประทับใจในก้าวแรกของมหาลัย\n2. Space For Everyone's Creation: สร้างสรรค์กิจกรรมเพื่อให้นิสิตคณะวิทยาศาสตร์ทุกคน ทุกชั้นปี ทุกภาคได้มีส่วนร่วมในการสร้างสรรค์กิจกรรม เช่น ส่งเสริมการรวมกลุ่มทำกิจกรรมระหว่างกลุ่มนิสิตที่มีความชอบในด้านต่างๆ เพื่อเป็นพื้นที่ให้นิสิตคณะวิทยาศาสตร์ได้มีพื้นที่แสดงความสามารถและพูดคุยเพื่อเชื่อมสัมพันธ์กับนิสิตที่มีความชอบร่วมกัน\n3. Good Vibe, Great Life: สร้างบรรยากาศที่อบอุ่นและเป็นกันเองเพื่อเสริมสร้างความสามัคคีและสุขภาวะที่ดี ให้กับนิสิตภายในคณะวิทยาศาสตร์ เช่น การส่งเสริมกิจกรรมสันทนาการ ไม่ว่าจะเป็นการเต้นสันทนาการ และกิจกรรมสันทนาการอื่น ๆ เป็นต้น เพื่อเป็นพื้นที่ให้นิสิตได้มาใช้เวลาร่วมกันและเป็นการส่งเสริมสุขภาพทั้งกายและใจซึ่งกันและกัน`,
      en: `1. First Step Together: Building good relationships for new students starting from freshman activities, designing more diverse activities to foster a sense of unity and improve relationships between new and existing students, such as organizing activities considering international students and students with various interests so everyone can enjoy and have memorable experiences in their first steps at university.\n2. Space For Everyone's Creation: Creating activities for all science students of all years and departments to participate in creative activities, such as promoting group activities among students with similar interests to provide a space for science students to showcase their abilities and connect with like-minded students.\n3. Good Vibe, Great Life: Creating a warm and friendly atmosphere to foster unity and well-being for students within the Faculty of Science, such as promoting recreational activities including recreational dance and other recreational activities, to provide a space for students to spend time together and promote both physical and mental health.\n(Automatically translated from Thai)`,
    },
    personal_experience: {
      th: `1. สมาชิกฝ่ายนิสิตสัมพันธ์ สโมสรนิสิตคณะวิทยาศาสตร์ ปีการศึกษา 2568\n2. ประธานฝ่ายเนื้อหา โครงการกีฬาสานสัมพันธ์คณะวิทยาศาสตร์จุฬาฯ-ธรรมศาสตร์ ประจำปีการศึกษา 2568\n3. ประธานฝ่ายเวทีกลาง โครงการเปิดโลกคณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ปี 2569 (Science Chula Open House 2026)\n4. หัวหน้าฝ่ายกิจกรรมกลาง โครงการเทศกาลต้อนรับนิสิตใหม่ คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ปีการศึกษา 2568\n5. หัวหน้าฝ่ายประสานผู้เข้าแข่งขัน โครงการคัดเลือกพิธีกร คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ปีการศึกษา 2568\n6. หัวหน้าฝ่ายประสานโชว์ โครงการตลาดนัดนิสิต เสือเหลือง แฟร์ 2026 (SUEALUEANG FAIR 2026)\n7. หัวหน้าฝ่ายนิทรรศการภาควิชา โครงการ Science Chula Open House 2026\n8. สมาชิกผู้นำเชียร์คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย (Vidya CU Cheerleader) รุ่นที่ 91\n9. สมาชิก Chulalongkorn University's Athletic Cheer (CU POMPOM) รุ่นที่ 76`,
      en: `1. Member of Student Relations, Science Student's Union, Academic Year 2568\n2. Content Head of the Science Faculty Sports-Bonding Event between Chula and Thammasat, Academic Year 2568\n3. Main Stage Head of the Science Chula Open House 2026\n4. Central Activities Head of the Freshmen Festival, Faculty of Science, Chulalongkorn University, Academic Year 2568\n5. Coordinator Head for Participants of the Master of Ceremonies Selection, Faculty of Science, Chulalongkorn University, Academic Year 2568\n6. Show Coordination Head of the SUEALUEANG FAIR 2026\n7. Department Exhibition Head of the Science Chula Open House 2026\n8. Member of Vidya CU Cheerleader (Science Faculty Cheer Leader), Generation 91\n9. Member of Chulalongkorn University's Athletic Cheer (CU POMPOM), Generation 76\n(Automatically translated from Thai)`,
    },
    image: "/c2.jpg",
  },
  {
    candidate_id: "c3" as const,
    full_name: "สุชญา มติภักดี",
    study_year: 3,
    study_program: {
      th: "เทคโนโลยีทางอาหาร",
      en: "Food Technology",
    },
    position_id: "head_of_sports",
    party_id: "scipah",
    personal_vision: {
      th: "เชื่อมโยงความหลากหลาย สร้างมิตรภาพที่ยั่งยืนผ่านกีฬา ด้วยการเปิดพื้นที่ให้นิสิตทุกคนได้มีโอกาสเล่นกีฬาที่หลากหลาย พบสังคมใหม่ ๆ เพื่อเสริมสร้างสุขภาพกายที่แข็งแรง และสุขภาพจิตที่ดี ให้แก่นิสิตคณะวิทยาศาสตร์ทุกคน",
      en: "Connecting diversity, building lasting friendships through sports, by opening spaces for all students to play various sports and meet new social circles, to strengthen physical and mental health for all science students (Automatically translated from Thai)",
    },
    personal_mission: {
      th: `1. Sci-Port Sport Community: มุ่งเน้นการใช้กิจกรรมกีฬาเป็นสื่อกลางในการสร้างปฏิสัมพันธ์ระหว่างนิสิตภายในคณะวิทยาศาสตร์ เพื่อสร้างความสามัคคีและให้นิสิตทุกคนรู้สึกถึงการเป็นส่วนหนึ่งของสังคมคณะวิทยาศาสตร์ที่แน่นแฟ้นและยั่งยืน\n2. Sci-Health @ Sci-Square: เปลี่ยนพื้นที่ส่วนกลาง ให้เป็นพื้นที่แห่งสุขภาพและพลังสร้างสรรค์ ยกระดับ Sci Square ให้กลายเป็นศูนย์กลางแห่งสุขภาวะผ่านกิจกรรมเคลื่อนไหวร่างกายและแอโรบิก หรือกิจกรรมอื่น ๆ ที่ทุกคนเข้าถึงได้ โดยมุ่งเน้นการสร้างสมดุลระหว่างการเรียนและการดูแลสุขภาพ เพื่อให้นิสิตและบุคลากรได้ผ่อนคลายความเครียดสะสม และสร้าง Vibe ที่ดีภายในคณะผ่านการเคลื่อนไหวร่วมกัน\n3. Support Sport in Sci: ยกระดับโครงการกีฬา สนับสนุนทุกศักยภาพอย่างเป็นระบบ พร้อมเป็นตัวกลางในการซัพพอร์ตโครงการของกลุ่มนิสิตกีฬาและองค์กรต่าง ๆ ภายใต้คณะวิทยาศาสตร์ในทุกมิติทั้งด้านงบประมาณ อุปกรณ์ การบริหารจัดการพื้นที่และสวัสดิการนักกีฬา รวมถึงเพิ่มการมองเห็นของชมรมกีฬา เพื่อผลักดันให้นิสิตที่มีใจรักกีฬาได้มีโอกาสแสดงความสามารถอย่างเต็มศักยภาพ เพราะเราเชื่อว่าทุกความสำเร็จของชมรมกีฬา คือความภูมิใจและภาพลักษณ์ที่ดีของคณะวิทยาศาสตร์`,
      en: `1. Sci-Port Sport Community: Focused on using sports activities as a medium for building interactions among science students to foster unity and make every student feel part of a strong and lasting science faculty community.\n2. Sci-Health @ Sci-Square: Transforming common areas into health and creative energy spaces, elevating Sci Square into a wellness hub through physical movement and aerobic activities or other accessible activities, focusing on creating balance between studying and health care so students and staff can relieve accumulated stress and create a good Vibe within the faculty through movement together.\n3. Support Sport in Sci: Elevating sports projects, supporting all potentials systematically, and serving as an intermediary to support projects of sports student groups and organizations within the Faculty of Science in all dimensions including budget, equipment, space management and athlete welfare, as well as increasing the visibility of sports clubs to push sports-loving students to have the opportunity to showcase their abilities to the fullest, because we believe every success of sports clubs is the pride and good image of the Faculty of Science.\n(Automatically translated from Thai)`,
    },
    personal_experience: {
      th: `1. ประธานโครงการค่าย 3 สัญจร สอนสัมพันธ์ครั้งที่ 2\n2. ประธานฝ่ายเนื้อหา โครงการกีฬาเพื่อนใหม่ ประจำปีการศึกษา 2568\n3. ประธานฝ่าย Event โครงการถนนคนเดินเชื่อมสัมพันธ์ วิศวฯ-วิทยาฯ (Vid Love Vid U 2026)\n4. หัวหน้าฝ่าย Graphic Design โครงการกีฬาสานสัมพันธ์คณะวิทยาศาสตร์จุฬาฯ-มหิดล ปีการศึกษา 2568\n5. หัวหน้าฝ่ายสถานที่ โครงการเทศกาลสานสัมพันธ์และต้อนรับนิสิตใหม่ ปีการศึกษา 2568 เข้าร่วม CU Freshmen Night 2025\n6. สมาชิกฝ่ายทะเบียนนักวิ่ง โครงการการกุศล ภายใต้ชื่อ "ห้าหมูนี่แชริตี้รัน 2026"`,
      en: `1. President of the 3rd Roaming Relations Teaching Camp\n2. Content Head of the Freshmen Sports Project, Academic Year 2568\n3. Event Head of the Vid Love Vid U 2026 Walking Street (Engineering-Science bonding)\n4. Graphic Design Head of the Science Faculty Sports-Bonding Event between Chula and Mahidol, Academic Year 2568\n5. Venue Head of the Bonding Festival and Freshmen Welcome Event, Academic Year 2568, participated in CU Freshmen Night 2025\n6. Runner Registration Member of the "Ha Moo Nee Charity Run 2026" charity project\n(Automatically translated from Thai)`,
    },
    image: "/c3.jpg",
  },
] satisfies Candidate[];
