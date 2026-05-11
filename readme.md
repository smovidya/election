## SMO Vidya Election

ใน repository นี้เป็นแอปพลิเคชันสำหรับการเลือกตั้งคณะกรรมการสโมสรนิสิต คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย โดยแบ่งเป็น 2 แอปพลิเคชันย่อยในรูปแบบ Monorepo
- `apps/backend` เป็น Elysia Instance สำหรับรัน API ของแอปพลิเคชัน
- `apps/frontend` เป็นเว็บ Astro สำหรับแสดงผลและให้ผู้ใช้โหวต

นอกจากแอปที่ใช้รันด้านบน จะมี package ที่ใช้สำหรับเก็บโค้ดที่ใช้ร่วมกันระหว่างแอปพลิเคชันทั้งสอง ได้แก่
- `packages/api` เป็น Elysia Instance นั่นแหละที่จะถูก Import ไปใช้ใน `apps/backend` อีกทีหนึ่ง โดยการเขียน API จะเขียนที่นี่เป็นหลัก ส่วน `apps/backend` จะเป็นเพียงตัวที่ใช้ deploy เท่านั้น
- `packages/constants` เป็นที่เก็บค่าคงที่ต่าง ๆ ที่ใช้ร่วมกันระหว่างแอปพลิเคชันทั้งสอง เช่น ค่าต่าง ๆ ที่เกี่ยวกับการเลือกตั้ง ทั้งข้อมูลผู้สมัคร ตำแหน่ง และข้อความระบบต่าง ๆ ที่ใช้ในแอปพลิเคชัน

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Backend | [Elysia](https://elysiajs.com/) บน Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) + KV |
| Frontend | [Astro](https://astro.build/) + Svelte + React + Tailwind CSS v4 |
| Deploy | Cloudflare Workers (ทั้ง frontend และ backend) |
| Package Manager | pnpm (workspace) |

## การติดตั้ง

ถ้าไม่ได้บอกไว้เป็นอื่น ให้รันคำสั่งทั้งหมดจาก root ของ repository

```bash
# ติดตั้ง dependencies ทั้ง monorepo
pnpm install
```

### Backend — ตั้งค่า environment variables

สร้างไฟล์ `apps/backend/.dev.vars` จาก example:

```bash
cp apps/backend/.dev.vars.example apps/backend/.dev.vars
```

แก้ไขค่าตามต้องการ:

```env
# สร้างได้จาก: openssl rand -hex 32
JWT_SECRET=your_jwt_secret_here
```

## การพัฒนา

```bash
# รัน backend + frontend พร้อมกัน
pnpm dev
```

| แอป | URL |
|-----|-----|
| Frontend | http://localhost:4321 |
| Backend API | http://localhost:8787 |

### Seed ฐานข้อมูล (local)

```bash
pnpm --filter election-backend run db:seed
```

## API Endpoints

Base URL (production): `https://election-api.vidyachula.org`

| Method | Path | คำอธิบาย |
|--------|------|----------|
| `GET` | `/health` | Health check |
| `POST` | `/auth/login` | Login ด้วย Google ID Token → JWT |
| `GET` | `/auth/me` | ดูข้อมูลผู้ใช้ปัจจุบัน |
| `GET` | `/election/voter-count` | จำนวนผู้ลงคะแนนทั้งหมด |
| `GET` | `/election/eligibility` | ตรวจสอบสิทธิ์โหวตของผู้ใช้ (ต้องใช้ JWT) |
| `POST` | `/election/cast-vote` | ส่งคะแนนโหวต (ต้องใช้ JWT) |
| `GET` | `/election/result` | ผลการเลือกตั้ง (เข้าถึงได้หลังประกาศผล) |

OpenAPI spec: `https://election-api.vidyachula.org/reference`

### Authentication

ระบบใช้ Google OAuth โดย frontend ส่ง Google ID Token ไปที่ `POST /auth/login` แล้วรับ JWT session token กลับมา (หมดอายุใน 30 นาที) จากนั้นใช้ JWT ใน header `Authorization: Bearer <token>` สำหรับ endpoint ที่ต้องการ auth

เฉพาะ email ที่ลงท้ายด้วย ` 23@student.chula.ac.th` เท่านั้นที่สามารถโหวตได้

## การ Deploy

### Staging

```bash
pnpm deploy:staging
```

| แอป | URL |
|-----|-----|
| Frontend | https://election-staging.vidyachula.org |
| Backend | https://election-api-staging.vidyachula.org |

### Production

```bash
pnpm deploy:production
```

| แอป | URL |
|-----|-----|
| Frontend | https://election.vidyachula.org |
| Backend | https://election-api.vidyachula.org |

### Seed ฐานข้อมูลบน remote

```bash
# Staging
pnpm --filter election-backend run db:seed:staging

# Production
pnpm --filter election-backend run db:seed:production
```

## การปรับใช้กับการเลือกตั้งครั้งถัดไป

ข้อมูลทั้งหมดที่ต้องแก้ไขอยู่ใน `packages/constants/src/` เป็นหลัก ไม่ต้องแตะโค้ด backend หรือ frontend

### 1. แก้ไขวันและเวลาเลือกตั้ง

ไฟล์: `packages/constants/src/event.ts`

```ts
// ชื่อการเลือกตั้ง
export const full_name = "การเลือกตั้ง...";
export const short_name_th = "...";

// วันเวลาเปิด-ปิดโหวต (ISO 8601, timezone +07:00)
export const votingStartString = "YYYY-MM-DDTHH:mm:ss+07:00";
export const votingEndString   = "YYYY-MM-DDTHH:mm:ss+07:00";

// เปิด false ระหว่างโหวต → true เมื่อพร้อมประกาศผล
export const isResultAnnounced = false;
```

> `isResultAnnounced = true` ทำให้ `GET /election/result` เปิดให้เข้าถึงได้

### 2. แก้ไขตำแหน่งที่เลือกตั้ง

ไฟล์: `packages/constants/src/candidates.ts` — array `running_positions`

```ts
export const running_positions = [
  {
    position_id: "president" as const,   // ต้อง unique, ใช้ใน DB
    name: { th: "นายกสโมสรนิสิต", en: "President" },
  },
  // เพิ่ม/ลดตำแหน่งตามจริง
] satisfies Position[];
```

> `position_id` ถูกเก็บลงใน D1 ตรง ๆ อย่าเปลี่ยน ID ของ election ที่รันไปแล้ว

### 3. แก้ไขพรรคและผู้สมัคร

ไฟล์: `packages/constants/src/candidates.ts` — array `parties` และ `candidates`

**พรรค:**
```ts
export const parties = [
  {
    party_id: "my-party" as const,
    name: { th: "...", en: "..." },
    visions: { th: "...", en: "..." },
    color: "#RRGGBB",
  },
] satisfies Party[];
```

**ผู้สมัคร:**
```ts
export const candidates = [
  {
    candidate_id: "c1" as const,   // ต้อง unique
    full_name: "ชื่อ นามสกุล",
    study_year: 3,
    study_program: { th: "...", en: "..." },
    position_id: "president",      // ต้องตรงกับ running_positions
    party_id: "my-party",          // ต้องตรงกับ parties
    personal_vision: { th: "...", en: "..." },
    personal_mission: { th: "...", en: "..." },
    personal_experience: { th: "...", en: "..." },
    image: "/c1.jpg",              // path ใต้ apps/frontend/src/assets/
  },
] satisfies Candidate[];
```

### 4. เปลี่ยนรูปผู้สมัคร

รูปของผู้สมัครอยู่ใน `apps/frontend/src/assets/` โดย path ใน field `image` ของ candidate เป็น path สัมพัทธ์จาก folder นี้ (ขึ้นต้นด้วย `/`)

```
apps/frontend/src/assets/
├── c1.jpg        ← รูปผู้สมัคร candidate_id = "c1"
├── c1_remove.png ← รูปแบบ background removed (ใช้แสดงบนหน้าโหวต)
├── c2.jpg
├── c2_remove.png
└── ...
```

**ขั้นตอน:**
1. เตรียมรูปในรูปแบบ `.jpg` หรือ `.png` ขนาดแนะนำ **400×500px** ขึ้นไป
2. วางไว้ใน `apps/frontend/src/assets/` ตั้งชื่อให้ตรงกับ `candidate_id` เช่น `c1.jpg`
3. เตรียมรูปแบบ background removed (`.png` พื้นโปร่งใส) ใช้ชื่อ `c1_remove.png`
4. ตรวจสอบว่า field `image` ใน `candidates.ts` ชี้ถูกต้อง เช่น `image: "/c1.jpg"`

### 5. รีเซ็ตผลโหวต (ก่อนเปิดรับโหวตจริง)

ฐานข้อมูล D1 เก็บ ballot และ voter ไว้ในตาราง `ballots` และ `voters` seed ใหม่จะไม่ลบข้อมูลเก่า ต้องทำผ่าน Cloudflare Dashboard หรือรัน SQL ตรง:

```sql
DELETE FROM ballots;
DELETE FROM voters;
```

## โครงสร้าง Repository

```
election/
├── apps/
│   ├── backend/          # Cloudflare Worker — Elysia API server
│   ├── frontend/         # Cloudflare Worker — Astro static site
│   └── frontendv2/       # (WIP) Next.js frontend
├── packages/
│   ├── api/              # Elysia app logic (shared, imported by backend)
│   └── constants/        # ข้อมูลผู้สมัคร ตำแหน่ง และวันเลือกตั้ง
└── readme.md
```

## License

MIT — จัดทำโดย [ฝ่าย IT สโมสรนิสิตคณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย](https://vidyachula.org)
