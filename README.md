# AI Coding Mentor (Monorepo)

An adaptive, interactive coding mentor web application built with a gamified retro-modern aesthetic for beginner programmers.

---

## 🏗️ Architecture & Monorepo Structure

```
/
├── shared/                 # Shared TypeScript contracts & models
│   ├── types.ts            # Lang, RunResult, MentorRequest/Response, AttemptPayload, ProgressResponse
│   └── package.json        # @mentor/shared
│
├── frontend/               # Next.js (App Router, Tailwind CSS, Monaco Editor)
│   ├── app/                # App router pages (/, /dashboard, /challenge/[id])
│   ├── components/         # ui/, workspace/, dashboard/, layout/
│   ├── lib/                # runner.ts, runners/ (Pyodide & JS workers), api-client.ts, session.ts
│   ├── hooks/              # Custom React hooks
│   ├── data/               # Starter coding challenges
│   └── .env.example        # NEXT_PUBLIC_API_URL=http://localhost:4000
│
├── backend/                # Standalone Express + TypeScript server (port 4000)
│   ├── src/
│   │   ├── index.ts        # Server entrypoint
│   │   ├── app.ts          # Express configuration, CORS, routes
│   │   ├── config/env.ts   # Environment variable loader
│   │   ├── routes/         # Express routers (/api/health, /api/mentor, /api/progress, /api/run-cpp)
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic (Groq LLM, hint ladder, progress calculations, C++ runner)
│   │   ├── middleware/     # Error handling & validation
│   │   ├── db/             # Supabase client integration
│   │   └── mocks/          # Mock data for USE_MOCK_AI=true
│   └── .env.example        # PORT, FRONTEND_ORIGIN, USE_MOCK_AI, GROQ_API_KEY, SUPABASE_URL...
│
└── package.json            # Root npm workspaces configuration
```

---

## 🚀 Getting Started

### 1. Installation
From the root directory, install all workspace dependencies:
```bash
npm install
```

### 2. Running in Development
Run both frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Health Check:** http://localhost:4000/api/health

To run packages individually:
```bash
npm run dev:frontend   # Runs only Next.js (port 3000)
npm run dev:backend    # Runs only Express server with tsx watch (port 4000)
```

### 3. Production Build
Build all workspaces from root:
```bash
npm run build
```

---

## 🧑‍💻 Guide for Teammate (Backend & AI)

Welcome! You own the `backend/` directory. The server is ready with mock endpoints so the frontend is fully functional while you develop:

1. **Where to start:**
   - Copy `backend/.env.example` to `backend/.env` and set your credentials (`GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`).
   - Run only the backend in watch mode: `npm run dev:backend`.
2. **Key files to work on:**
   - [backend/src/services/llm.service.ts](file:///Users/madhura/Desktop/AI%20Coding%20Mentor/backend/src/services/llm.service.ts): Connect Groq SDK (`groq-sdk`) when `USE_MOCK_AI=false`.
   - [backend/src/services/mentor.service.ts](file:///Users/madhura/Desktop/AI%20Coding%20Mentor/backend/src/services/mentor.service.ts): Implement prompt generation and hint ladder logic (Levels 1–4).
   - [backend/src/services/progress.service.ts](file:///Users/madhura/Desktop/AI%20Coding%20Mentor/backend/src/services/progress.service.ts): Connect Supabase to store progress and compute XP/streaks/badges.
   - [backend/src/services/runner.service.ts](file:///Users/madhura/Desktop/AI%20Coding%20Mentor/backend/src/services/runner.service.ts): Implement remote C++ runner (Judge0 or Docker runner).
   - [backend/src/db/index.ts](file:///Users/madhura/Desktop/AI%20Coding%20Mentor/backend/src/db/index.ts): Initialize `@supabase/supabase-js`.
3. **Contract rule:**
   - Request and response schemas are strictly defined in [shared/types.ts](file:///Users/madhura/Desktop/AI%20Coding%20Mentor/shared/types.ts). Keep response shapes intact when replacing mock services.
