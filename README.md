# Zense — AI-Powered Health Symptom Analyzer

> **Bitsmikro Innovative Vibecode 2026** — Submission by Tim **.** (Gerald Martadinata + 2 anggota)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgeraldmartadinata%2Fbitsmikro)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)

---

## 🎯 Tentang Aplikasi

**Zense** membantu orang yang merasa "kurang enak badan" tapi tidak tahu mulai dari mana. Dengan bahasa sehari-hari, user ceritakan gejala → AI memecah kemungkinan faktor penyebab (tidur, nutrisi, hidrasi, stres) → memberikan **rekomendasi prioritas dengan reasoning** + **rencana 7 hari actionable** + **partner pendamping** (AI persona + grup chat) untuk saling menyemangati.

**Bukan diagnosis medis** — panduan pola hidup edukatif. Disclaimer medis ditampilkan di setiap halaman.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Analisis Gejala** | Input natural language → AI breakdown faktor penyebab → rekomendasi prioritas dengan reasoning |
| **Red-Flag Safety** | 33 pola bilingual (ID/EN) deteksi kondisi serius → block analisis + emergency CTA |
| **Rencana 7 Hari** | Checklist harian berbasis rekomendasi, progress bar real-time, celebration card |
| **Partner Inbox** | WhatsApp-style list: grup "Grup Bugar Pagi" + 4 persona (Rara/Bima/Sinta/Danu) |
| **Persona Chat** | 1-on-1 chat per persona (Rara/Bima pakai Gemini real, Sinta/Danu template), streak harian |
| **Group Chat** | WhatsApp-style grup dengan seeded history, chatter logic (55%), check-in otomatis |
| **Quick Answer** | Hero glass card → analisis cepat → handoff ke `/analyze` via sessionStorage (1 request) |
| **Riwayat Lokal** | Semua data di localStorage (zense_history, zense_plan_progress, zense_partner, zense_group_messages) |
| **Mock-First AI** | Demo 100% reliable tanpa API key; swap ke Gemini 2.5 Flash via env var |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS v4 (CSS-first, `@theme` tokens), no `tailwind.config.ts` |
| **Animation** | Framer Motion (staggered fade-up, typing dots, SVG path draw, spring transitions) |
| **Icons** | Lucide React |
| **Testing** | Vitest (94 unit tests) |
| **AI** | MockProvider (4 skenario) + OpenAICompatibleProvider (Gemini 2.5 Flash via Google AI Studio) |
| **Deploy** | Vercel (gratis) |
| **Package Manager** | npm |

**Design System:** Warm Light Editorial — Cream `#FAF6EE`, Terracotta `#B05A36`, Sage `#3E7C5B`, Ink `#2A2B2F`, Instrument Serif (display) + Inter (body).

---

## 🚀 Quick Start

### Prasyarat
- Node.js 20+ (LTS)
- npm 10+

### Instalasi Lokal
```bash
# Clone repo
git clone https://github.com/geraldmartadinata/bitsmikro.git
cd bitsmikro/app

# Install dependencies
npm install

# Copy env example (optional - untuk AI real)
cp .env.example .env.local
# Edit .env.local dengan API key Gemini jika ingin pakai AI real

# Jalankan development server
npm run dev
# Buka http://localhost:3000
```

### Environment Variables (Optional - untuk AI Real)
Buat `.env.local` di folder `app/`:
```env
AI_PROVIDER=openai-compatible
AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
AI_MODEL=gemini-2.5-flash
AI_API_KEY=key1,key2,key3  # comma-separated, dari akun Google yang BERBEDA
```
**Tanpa env ini → aplikasi pakai MockProvider (demo tetap jalan 100%).**

### Build Production
```bash
npm run build
npm run start  # port 3001
```

### Testing & Quality
```bash
npm test           # 94 unit tests
npm run typecheck  # TypeScript strict check
npm run lint       # ESLint
npm run build      # Full production build
```

---

## 📁 Struktur Proyek (Ringkas)

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout (fonts, metadata)
├── globals.css                 # Tailwind v4 @theme + utilities
├── analyze/page.tsx            # Analyze route
├── partner/page.tsx            # Partner inbox
├── partner/[personaId]/page.tsx# Persona chat route
├── group/page.tsx              # Group chat
├── api/analyze/route.ts        # Server analyze (mutex, multi-key, fallback)
└── api/chat/route.ts           # Server chat (persona-aware)

components/
├── ui/                         # Button, Card, Badge, Input, Textarea
├── navbar.tsx                  # Floating pill navbar
├── footer.tsx                  # Footer + disclaimer
├── analyze-section.tsx         # Analyze flow
├── results-view.tsx            # Results rendering
├── plan-section.tsx            # 7-day plan
├── partner-inbox.tsx           # WhatsApp-style inbox
├── persona-chat.tsx            # Persona chat window
├── group-section.tsx           # Group chat UI
├── quick-answer.tsx            # Hero glass card
└── faq.tsx                     # FAQ accordion

lib/
├── ai.ts                       # AIProvider, MockProvider, OpenAICompatibleProvider
├── redflag.ts                  # 33 red-flag patterns
├── plan.ts                     # 7-day plan engine
├── partner.ts                  # Personas, per-persona state
└── group.ts                    # Group chat logic

types/
└── analysis.ts                 # TypeScript contracts
```

---

## 🏗 Arsitektur Kunci

### Mock-First AI (`lib/ai.ts`)
- `AIProvider` interface: `analyze()` + `chat()` — swap seamless mock ↔ real
- **MockProvider**: 4 skenario deterministik (tired, dizzy, stomach, fallback)
- **OpenAICompatibleProvider**: System prompt empatik, strict JSON, disclaimer otomatis
- **Multi-key rotation**: Round-robin `AI_API_KEY` (comma-separated, akun Google berbeda)
- **Mutex**: Max 2 concurrent requests (hindari burst rate-limit)
- **429 Fail-fast**: Immediate fallback ke mock (tidak tunggu Retry-After)

### Route-Per-Chat Stability
- **Masalah**: Single-page conditional render → hydration flash → "harus refresh"
- **Solusi**: Route per chat
  - `/partner` → `PartnerInbox` (list only, `Link`-based)
  - `/partner/{id}` → `PersonaChat` (lazy `useState(() => loadChats()[id])` — **SYNC**, no `useEffect`)
  - `/group` → `GroupSection` (sudah route-based)
- **Hasil**: Reload `/partner/bima` → chat langsung render history (no flash)

### Safety First
- `lib/redflag.ts`: 33 pola bilingual (dada sakit, sesak, stroke, suicidal, dll.)
- `isRedFlag(text)` → block analyze sebelum API call + emergency CTA

---

## 📦 Submission Package

Untuk judging/lokal testing, gunakan zip **exclude internal dev files**:

```bash
# Dari root folder bitsmikro/
zip -r zense-bitsmikro-2026.zip \
  app/ components/ lib/ types/ public/images/*.webp \
  package.json package-lock.json README.md .env.example \
  -x "*/node_modules/*" "*/.next/*" "*/.git/*" \
  "*/docs/*" "*/scripts/*" "*/lighthouse-*" "*/*.md" \
  "!README.md" "!.env.example"
```

**Isi zip:** Hanya file yang dibutuhkan run app lokal (source + config + assets + deps lock).
**Dikecualikan:** `node_modules`, `.next`, `.git`, `docs/` (prompt library, design research, milestone plan), `scripts/`, `lighthouse-*`, file `.md` internal.

---

## 👥 Tim

**Tim "."** (BINUS University)
- **Gerald Samuel Martadinata** — Vibe Coder
- **Felicia Natania Rahardjo** — Idea and Writer
- **Christian Darren Owen** — Idea and Writer

---

## 📄 Lisensi

MIT License — bebas digunakan untuk pembelajaran & pengembangan lanjutan.

---

## 🔗 Link Penting

- **Repo:** https://github.com/geraldmartadinata/bitsmikro
- **Vercel Demo:** https://bitsmikro.vercel.app
- **Video Demo:** https://drive.google.com/file/d/1JfhAd-Lmn0TrdqJ45TVXx5Tt7yD87_37/view?usp=drive_link
- **Source Code:** https://drive.google.com/drive/folders/1dyjaPohOk4vWaasXMi5tEYUMNxczmC14?usp=drive_link

---

> **Catatan untuk Juri:** Aplikasi dirancang **mock-first** — demo 100% jalan tanpa API key. Untuk mencoba AI real (Gemini 2.5 Flash), set `AI_PROVIDER=openai-compatible` + `AI_API_KEY` di environment. Semua data disimpan lokal (localStorage) — **tidak ada backend, tidak ada database, tidak ada auth**.