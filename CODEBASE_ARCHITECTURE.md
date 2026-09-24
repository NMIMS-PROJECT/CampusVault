# CODEBASE_ARCHITECTURE

## 1) Audit scope and evidence rules

- This audit is **source-code-only** and was derived from executable/configurable artifacts only: `package.json`, TypeScript/Angular configs, Docker Compose, env example, Prisma schema/migrations/seed/scripts, and `.ts/.html/.css/.json/.sql/.yml/.toml` files.
- **Markdown documentation was excluded** from evidence. Specifically, no claims in this document are sourced from `README.md`, `client/README.md`, `PlacementOS_Prompt.md`, `CONTRIBUTING.md`, or any docs Markdown.
- Every feature/architecture claim below references exact repository paths and concrete symbols (for example route handlers like `companiesRouter.post("/:id/unlock-bundle")`, middleware like `requireAuth`, or Prisma models like `CompanyUnlock`).
- Wired end-to-end behavior is separated from partial/mock/disconnected behavior.

## 2) Verified Tech Stack (proven by imports/config)

| Technology | Proof (exact file + symbol/config) | Runtime status |
|---|---|---|
| Node.js HTTP server | `server/src/index.ts` -> `createServer(app)`, `server.listen(env.PORT, ...)` | Active |
| Express 5 API | `server/src/app.ts` -> `express()`, `app.use("/api", apiRouter)` | Active |
| CORS | `server/src/app.ts` -> `cors({ origin: env.CLIENT_URL, credentials: true })` | Active |
| Helmet | `server/src/app.ts` -> `app.use(helmet())` | Active |
| Morgan | `server/src/app.ts` -> `app.use(morgan("dev"))` | Active |
| Cookie parser | `server/src/app.ts` -> `app.use(cookieParser())` | Active |
| Zod validation | `server/src/config/env.ts` -> `envSchema`, route schemas (`registerSchema`, `bookSchema`, etc.) | Active |
| Prisma ORM + Prisma Client | `server/src/lib/prisma.ts` -> `new PrismaClient()`, DB operations across `server/src/routes/*.ts` | Active |
| PostgreSQL | `server/prisma/schema.prisma` -> `datasource db { provider = "postgresql" }`; `docker-compose.yml` -> `postgres` service | Active |
| JWT auth | `server/src/middleware/auth.ts` -> `jwt.verify`, `server/src/services/auth.ts` -> `signAccessToken`, `signRefreshToken` | Active |
| bcrypt password hashing | `server/src/services/auth.ts` -> `hashPassword()`, `verifyPassword()` | Active |
| Socket.IO | `server/src/services/socket.ts` -> `initializeSocket`, `attachSocketHandlers`, `notifyUser` | Active |
| Multer | `server/src/routes/users.ts` -> `const upload = multer()`; `server/src/routes/analyzer.ts` -> `upload.single("resumePdf")` | Active |
| OpenAI SDK | `server/src/services/assessment.ts` -> `new OpenAI(...)`; `server/src/routes/questions.ts` -> `new OpenAI(...)` | Active |
| Fetch-based Ollama integration | `server/src/routes/analyzer.ts` -> `fetch(`${ollamaUrl}/api/chat`, ...)` | Active |
| Angular standalone bootstrap | `client/src/main.ts` -> `bootstrapApplication(App, appConfig)` | Active |
| Angular Router | `client/src/app/app.config.ts` -> `provideRouter(routes)` | Active, but no app routes configured (`client/src/app/app.routes.ts` -> `routes: []`) |
| Angular signals | `client/src/app/app.ts` -> `title = signal('client')` | Active |
| Angular unit testing via TestBed + Vitest globals typing | `client/src/app/app.spec.ts` -> `TestBed`; `client/tsconfig.spec.json` -> `types: ["vitest/globals"]` | Active |
| Docker Compose infra | `docker-compose.yml` -> `postgres`, `redis` services | Infra config present |

### Declared dependencies not found imported in repository source

- Server `dependencies` in `server/package.json` not imported by source files:
  - `cloudinary`
  - `ioredis`
  - `prisma` (CLI package; used by scripts/tooling, not runtime imports)
- Client `dependencies` in `client/package.json` without direct imports in `client/src`:
  - `@angular/common`
  - `@angular/compiler`
  - `@angular/forms`
  - `rxjs`
  - `tslib`
  - Note: these can still be required transitively by Angular build/runtime even without explicit project-level imports.

## 3) Complete directory/file map (non-documentation source/config/test)

### Repository root

- `/package.json` — workspace scripts (`dev-client`, `dev-server`, `build`, Prisma workspace scripts).
- `/package-lock.json` — lockfile for workspace dependency graph.
- `/.env.example` — environment contract keys (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, `VITE_API_URL`, etc.).
- `/docker-compose.yml` — local infra services (`postgres`, `redis`).
- `/.gitignore` — excludes runtime/build artifacts (`node_modules`, `dist`, `.env`, `coverage`, etc.).
- `/.vscode/c_cpp_properties.json` — editor IntelliSense config; unrelated to TS runtime.

### `/server`

- `/server/package.json` — server scripts and dependency declarations.
- `/server/tsconfig.json` — `module: NodeNext`, `rootDir: src`, `outDir: dist`.
- `/server/cleanup.ts` — maintenance script `cleanup()` deleting `AnswerUnlock`, `Answer`, `Question` via Prisma.
- `/server/update-db.ts` — maintenance one-liner `prisma.question.updateMany({ data: { isPremium: true, creditsToUnlock: 20 } })`.

#### `/server/prisma`

- `/server/prisma/schema.prisma` — canonical data model and enums (`User`, `Company`, `Question`, etc.; `Tier`, `SessionStatus`).
- `/server/prisma/seed.ts` — `main()` seeds `Company` and `Question`, and clears unlock/answer/question/company tables first.
- `/server/prisma/migrations/migration_lock.toml` — migration provider lock (`postgresql`).
- `/server/prisma/migrations/20260411191736_init/migration.sql` — base schema DDL (tables, enums, FKs, unique indexes).
- `/server/prisma/migrations/20260413000100_add_company_bundle/migration.sql` — adds `Company.bundlePrice`, creates `CompanyUnlock`.
- `/server/prisma/migrations/20260414_make_posted_by_optional/migration.sql` — drops NOT NULL on `Question.postedById`.

#### `/server/src`

- `/server/src/index.ts` — entrypoint; `createServer(app)`, `initializeSocket(server)`, `attachSocketHandlers()`, `checkDatabaseConnection()`.
- `/server/src/app.ts` — Express app assembly; middleware stack; root route `GET /`; mounts `/api`.
- `/server/src/config/env.ts` — validates env with `envSchema`.
- `/server/src/lib/prisma.ts` — singleton `export const prisma = new PrismaClient()`.
- `/server/src/types/auth.ts` — `AuthUser` type.
- `/server/src/middleware/auth.ts` — `optionalAuth` and `requireAuth` JWT middleware, `AuthedRequest` type.

##### `/server/src/services`

- `/server/src/services/auth.ts` — `hashPassword`, `verifyPassword`, token sign/verify (`signAccessToken`, `signRefreshToken`, `verifyRefreshToken`).
- `/server/src/services/credits.ts` — credit ledger primitives `addCredits`, `spendCredits` with `CreditTransaction` writes.
- `/server/src/services/assessment.ts` — tiering (`resolveTier`) and AI question generation (`generateQuestions`).
- `/server/src/services/socket.ts` — Socket.IO lifecycle (`initializeSocket`, `attachSocketHandlers`) and push helper `notifyUser`.

##### `/server/src/routes`

- `/server/src/routes/index.ts` — `apiRouter`; health routes and all sub-router mounts.
- `/server/src/routes/auth.ts` — auth endpoints (`/register`, `/login`, `/refresh`, `/me`).
- `/server/src/routes/users.ts` — self-profile read/update/avatar endpoints by `:id`.
- `/server/src/routes/credits.ts` — credit history endpoint.
- `/server/src/routes/companies.ts` — company listing/detail/questions and bundle unlock flow.
- `/server/src/routes/questions.ts` — question CRUD-ish operations, answer listing/posting, premium unlock flow.
- `/server/src/routes/answers.ts` — answer unlock and upvote endpoints.
- `/server/src/routes/mentors.ts` — mentor list and static slot generation.
- `/server/src/routes/sessions.ts` — mentor booking and user session history.
- `/server/src/routes/assessment.ts` — assessment generation/submit with tier + credit adjustment.
- `/server/src/routes/analyzer.ts` — resume/profile analysis + deep-dive endpoints.

### `/client`

- `/client/package.json` — Angular scripts/dependencies.
- `/client/angular.json` — Angular build/serve/test builders and options.
- `/client/tsconfig.json`, `/client/tsconfig.app.json`, `/client/tsconfig.spec.json` — strict TS + app/spec compilation config.
- `/client/.editorconfig`, `/client/.prettierrc`, `/client/.gitignore` — formatting/editor ignore policy.
- `/client/.vscode/extensions.json`, `launch.json`, `mcp.json`, `tasks.json` — local IDE workflows.
- `/client/public/favicon.ico` — static asset.

#### `/client/src`

- `/client/src/main.ts` — bootstrap entry (`bootstrapApplication`).
- `/client/src/index.html` — host page with `<app-root>`.
- `/client/src/styles.css` — global style stub.

#### `/client/src/app`

- `/client/src/app/app.config.ts` — root providers (`provideBrowserGlobalErrorListeners`, `provideRouter(routes)`).
- `/client/src/app/app.routes.ts` — router table `routes: []` (no app routes).
- `/client/src/app/app.ts` — root component `App`, signal `title`.
- `/client/src/app/app.html` — Angular starter template plus `<router-outlet />`.
- `/client/src/app/app.css` — component stylesheet (empty file content).
- `/client/src/app/app.spec.ts` — tests app creation and title rendering.

## 4) Database and state architecture

### Prisma models, keys, relations, constraints, and notable gaps

Source of truth: `/server/prisma/schema.prisma`.

- `User`
  - PK: `id` (`@id @default(cuid())`)
  - Unique: `email` (`@unique`)
  - Defaults: `credits @default(100)`, `tier @default(BEGINNER)`, timestamps
  - Relations: `answers`, `assessments`, `certifications`, `creditTxns`, `mentorSessions` (`@relation("mentee")`), `hostedSessions` (`@relation("mentor")`), `projects`, `resume`, `companyUnlocks`
  - Gap: no DB-level check constraints for `credits >= 0`, URL validity, or GPA bounds.

- `Project`
  - PK: `id`; FK: `userId -> User.id`
  - Array field: `techStack String[]`
  - Gap: no uniqueness on `(userId, title)`.

- `Certification`
  - PK: `id`; FK: `userId -> User.id`
  - Gap: no uniqueness for duplicate cert entries per user.

- `Assessment`
  - PK: `id`; FK: `userId -> User.id`
  - Fields: `score`, `totalQ`, `topics String[]`, `tier Tier`, `answers Json`
  - Gap: no check constraints on score bounds.

- `Company`
  - PK: `id`
  - Fields include array attributes (`eligibleBranches`, `roles`, `requiredSkills`) and `bundlePrice @default(50)`
  - Relations: `questions`, `unlocks`
  - Gap: no unique constraint on `name`.

- `Question`
  - PK: `id`
  - FK: `companyId -> Company.id`
  - `postedById String?` is nullable but has **no relation declaration** to `User`
  - Fields: premium flags (`isPremium`, `creditsToUnlock`)
  - Gap: missing FK/user relation for `postedById`; migration changed nullability only.

- `Answer`
  - PK: `id`
  - FKs: `questionId -> Question.id`, `userId -> User.id`
  - Fields: premium flags, `creditsEarned`, `upvotes`
  - Relation: `unlocks` (`AnswerUnlock[]`)

- `AnswerUnlock`
  - PK: `id`
  - FK: `answerId -> Answer.id`
  - Unique: `@@unique([answerId, userId])`
  - Gap: `userId` has no FK to `User` in Prisma schema (and init migration also omitted that FK), so unlock user referential integrity is not enforced.

- `CompanyUnlock`
  - PK: `id`
  - FKs: `companyId -> Company.id`, `userId -> User.id`
  - Unique: `@@unique([companyId, userId])`

- `MentorSession`
  - PK: `id`
  - FKs: `menteeId -> User.id`, `mentorId -> User.id`
  - Enum field: `status SessionStatus @default(PENDING)`

- `CreditTransaction`
  - PK: `id`; FK: `userId -> User.id`
  - Signed integer ledger style `amount`

- `Resume`
  - PK: `id`
  - Unique/FK: `userId @unique -> User.id`
  - JSON analysis payload `analysisJson`

- Enums
  - `Tier`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `PLACEMENT_READY`
  - `SessionStatus`: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`

### Seed/update/cleanup behavior

- `/server/prisma/seed.ts` -> `main()`
  - Destructive reset of `AnswerUnlock`, `Answer`, `Question`, `CompanyUnlock`, `Company` via `deleteMany`.
  - Seeds many `Company` records and random question sets; uses `Math.random()` for `bundlePrice`, `isPremium`, rounds, years.
- `/server/update-db.ts` -> mass-updates all questions premium fields (`updateMany`).
- `/server/cleanup.ts` -> removes answer/unlock/question data.

### Prisma client lifecycle

- API runtime: singleton at `/server/src/lib/prisma.ts` (`const prisma = new PrismaClient()`), reused across routes/services.
- No graceful shutdown hook in `/server/src/index.ts` (`SIGINT`/`SIGTERM` disconnect absent).
- Scripts (`seed.ts`, `cleanup.ts`) explicitly call `prisma.$disconnect()`.

### Angular client state architecture

- No global state library/store is implemented.
- Root component state only: `/client/src/app/app.ts` -> `title = signal('client')`.
- No API client service, no interceptor, no auth token store (`localStorage/sessionStorage/cookies`) in client source.

## 5) Backend execution graph

### Startup and health

1. `/server/src/index.ts` -> `createServer(app)` from `app.ts`.
2. `initializeSocket(server)` and `attachSocketHandlers()` from `services/socket.ts` run before listen.
3. `server.listen(env.PORT, async () => ...)` logs env and DB host.
4. `checkDatabaseConnection()` executes `prisma.$queryRaw\`SELECT 1\``; exits process on failure.
5. API-level health checks:
   - `/server/src/routes/index.ts` -> `apiRouter.get("/health")`
   - `apiRouter.get("/health/db")`

### Middleware chain

- Global (in `/server/src/app.ts`):
  - `cors({ origin: env.CLIENT_URL, credentials: true })`
  - `helmet()`
  - `morgan("dev")`
  - `express.json({ limit: "5mb" })`
  - `cookieParser()`
- Auth middleware (in `/server/src/middleware/auth.ts`):
  - `optionalAuth` parses optional `Authorization: ******
  - `requireAuth` enforces JWT and sets `(req as AuthedRequest).auth`

### Route mounts (`/server/src/routes/index.ts` -> `apiRouter.use(...)`)

- `/auth` -> `authRouter`
- `/users` -> `usersRouter`
- `/assessment` -> `assessmentRouter`
- `/companies` -> `companiesRouter`
- `/questions` -> `questionsRouter`
- `/answers` -> `answersRouter`
- `/mentors` -> `mentorsRouter`
- `/sessions` -> `sessionsRouter`
- `/analyzer` -> `analyzerRouter`
- `/credits` -> `creditsRouter`

### Exact route behaviors (handler -> service -> DB)

- `authRouter.post("/register")` (`server/src/routes/auth.ts`)
  - Validates `registerSchema`; checks existing user via `prisma.user.findUnique(email)`.
  - Transaction: `tx.user.create(...)` + `tx.creditTransaction.create(...)` (welcome log only).
  - Returns `user`, `accessToken` (`signAccessToken`), `refreshToken` (`signRefreshToken`).

- `authRouter.post("/login")`
  - Validates `loginSchema`; user lookup by email.
  - Password check via `verifyPassword`.
  - Returns selected user fields + new tokens.

- `authRouter.post("/refresh")`
  - Validates body `refreshToken` string.
  - Uses `verifyRefreshToken`; fetches user by `payload.sub`; returns new access token.

- `authRouter.get("/me")` + `requireAuth`
  - Fetches and returns profile by `auth.id`.

- `usersRouter.get(":id")` + `requireAuth`
  - Enforces self-only access (`auth.id === id`); reads user with profile arrays.

- `usersRouter.put(":id")` + `requireAuth`
  - Self-only, schema-validated partial update (`updateUserSchema`) -> `prisma.user.update`.

- `usersRouter.post(":id/avatar")` + `requireAuth` + `upload.none()`
  - Self-only, expects text `avatarUrl`; updates `prisma.user.update({ avatarUrl })`.

- `creditsRouter.get("/history")` + `requireAuth`
  - Returns `prisma.creditTransaction.findMany({ where: { userId: auth.id } })`.

- `companiesRouter.get("/")`
  - Optional filters: `branch`, `gpa`, `search`; executes `prisma.company.findMany` with dynamic `where`.

- `companiesRouter.get("/:id")` + `optionalAuth`
  - Reads `prisma.company.findUnique(... include questions select subset)`.
  - If auth present, checks unlock via `prisma.companyUnlock.findUnique(companyId_userId)`.
  - Returns `isUnlocked` + `bundleStatus` augmentation.

- `companiesRouter.get("/:id/questions")` + `optionalAuth`
  - Reads company, unlock status, then `prisma.question.findMany(companyId)`.
  - If locked, maps all `question.content` to fixed lock string.

- `companiesRouter.post("/:id/unlock-bundle")` + `requireAuth`
  - Transaction: check user credits, check existing unlock, `spendCredits(...)`, `tx.companyUnlock.create(...)`.
  - Returns spend and remaining credits.

- `questionsRouter.get("/")`
  - Filtered `prisma.question.findMany` by query params.

- `questionsRouter.post("/")` + `requireAuth`
  - Validates `createQuestionSchema`; `prisma.question.create` with `postedById: auth.id`.

- `questionsRouter.get("/:id/answers")` + `optionalAuth`
  - Reads answers sorted by `upvotes`; includes `unlocks` relation filtered by `auth.id` when logged in.
  - Redacts `content` for premium answers when not unlocked/not owner.

- `questionsRouter.post("/:id/answers")` + `requireAuth`
  - Validates answer payload; ensures question exists.
  - Transaction: `tx.answer.create`; if premium then `tx.question.update({ isPremium: true })`; else reward via `addCredits(..., 10, ...)`.

- `questionsRouter.post("/:id/unlock")` + `requireAuth`
  - For premium questions only; computes unlock `cost`.
  - Transaction: verify user credits; detect prior unlock via `tx.answerUnlock.findFirst({ answer: { questionId } })`; spend credits if first unlock.
  - If answer exists: creates `answerUnlock`; if not: sets `needsGeneration` and later calls OpenAI (`client.chat.completions.create`) to generate content, persists via `prisma.answer.create` + `prisma.answerUnlock.create`.

- `answersRouter.post("/:id/unlock")` + `requireAuth`
  - For premium answer unlock: transaction checks existing unlock; `spendCredits` from unlocker and `addCredits` to answer owner; `tx.answerUnlock.create`.

- `answersRouter.post("/:id/upvote")` + `requireAuth`
  - `prisma.answer.update({ upvotes: { increment: 1 } })`.
  - Every 10 upvotes triggers transaction with `addCredits(..., 5, ...)` to answer owner.

- `mentorsRouter.get("/")`
  - Returns top 20 users with `tier: "PLACEMENT_READY"`.

- `mentorsRouter.get("/:id/slots")`
  - Returns generated static slots based on `Date.now()`; does not use `:id` or DB.

- `sessionsRouter.post("/book")` + `requireAuth`
  - Validates `bookSchema`; transaction optionally spends credits and creates `mentorSession`.
  - Emits Socket.IO event via `notifyUser(mentorId, "session-booked", session)` and `notifyUser(menteeId, ...)`.

- `sessionsRouter.get("/my")` + `requireAuth`
  - Returns mentee sessions sorted by schedule.

- `assessmentRouter.post("/generate")` + `requireAuth`
  - Validates payload; calls `generateQuestions(topics)` in `services/assessment.ts` (OpenAI-backed).

- `assessmentRouter.post("/submit")` + `requireAuth`
  - Scores answers; determines tier via `resolveTier(score)`.
  - Transaction updates user tier, updates credits, logs `CreditTransaction`, inserts `Assessment`.

- `analyzerRouter.post("/run")` + `requireAuth` + `upload.single("resumePdf")`
  - Takes `resumeText` or mocked extracted text.
  - Loads user profile data from Prisma.
  - Calls Ollama-compatible endpoint using `fetch` and validates response with `AnalyzerResultSchema`.
  - Stores/updates `Resume` via `prisma.resume.upsert`.

- `analyzerRouter.post("/deep-dive")` + `requireAuth`
  - Charges 50 credits in transaction (`spendCredits`), returns fixed summary/recommendations payload.

### Auth/RBAC model

- JWT bearer model only (`requireAuth`/`optionalAuth`).
- Route-level ownership checks only in `usersRouter` handlers (`auth.id !== req.params.id` -> 403).
- No role-based middleware exists (no admin role checks, no centralized RBAC matrix).

### Socket.IO, caching/Redis, external integrations, cron

- Socket setup: `/server/src/services/socket.ts`.
  - `initializeSocket` configures CORS and server.
  - `attachSocketHandlers` listens for `register-user-room` event and calls `socket.join('user:${userId}')`.
- Redis:
  - `REDIS_URL` is required by env schema (`server/src/config/env.ts`) and Redis is in `docker-compose.yml`, but no `ioredis` import or runtime Redis calls exist.
- External integrations:
  - OpenAI SDK in `services/assessment.ts` and `routes/questions.ts`.
  - Ollama HTTP call in `routes/analyzer.ts`.
  - `cloudinary` package is installed but never imported.
- Scheduled/cron behavior:
  - No scheduler libraries/imports (`node-cron`, `bull`, etc.) or periodic job code found.

## 6) Frontend execution graph

### Bootstrap and root

1. `/client/src/main.ts` -> `bootstrapApplication(App, appConfig)`.
2. `/client/src/app/app.config.ts` -> providers: `provideBrowserGlobalErrorListeners()`, `provideRouter(routes)`.
3. `/client/src/app/app.routes.ts` defines `export const routes: Routes = []` (empty).
4. `/client/src/app/app.ts` root standalone component `App` with `title` signal.
5. `/client/src/app/app.html` renders Angular starter UI and `<router-outlet />`.

### Routing, state, API usage, forms, tokens

- Routes: none configured (`routes` empty array).
- Components/pages: only root `App` component.
- State/store: only `signal('client')` in `App`; no NgRx/Akita/custom store.
- API calls: none (`HttpClient`, `fetch`, `axios`, interceptors, API services absent in `client/src`).
- Forms: no `FormControl`, `FormGroup`, template forms usage.
- Token storage: no `localStorage`, `sessionStorage`, cookie handling, or auth header injection code.
- WebSockets: no client-side Socket.IO/WebSocket code.
- Response handling: no backend-response processing logic exists in frontend code.

## 7) End-to-end feature pipelines (verified)

### Full-stack UI -> backend -> DB pipelines

- **None found.** There are no frontend API callers in `client/src`, so no UI-triggered backend route is wired.

### Backend-only pipelines (implemented without frontend caller)

- **Authentication pipeline**
  - Trigger: direct HTTP call to `/api/auth/register|login|refresh|me`
  - Backend: `/server/src/routes/auth.ts` handlers
  - Middleware: `requireAuth` on `/me`
  - DB: `user.findUnique`, `user.create`, `creditTransaction.create`, etc.

- **Companies + unlock pipeline**
  - Trigger: `/api/companies/*`
  - Backend: `/server/src/routes/companies.ts`
  - Middleware: `optionalAuth` / `requireAuth`
  - DB: `company.findMany/findUnique`, `companyUnlock.findUnique/create`, `spendCredits` -> `user.update` + `creditTransaction.create`

- **Questions/answers premium pipeline**
  - Trigger: `/api/questions/*` and `/api/answers/*`
  - Backend: `/server/src/routes/questions.ts`, `/server/src/routes/answers.ts`
  - Middleware: `optionalAuth` / `requireAuth`
  - Services: `addCredits`, `spendCredits`
  - DB: `question.*`, `answer.*`, `answerUnlock.*`, `user.update`, `creditTransaction.create`
  - External AI branch: OpenAI generation in `questionsRouter.post("/:id/unlock")` when no existing answer.

- **Assessment pipeline**
  - Trigger: `/api/assessment/generate|submit`
  - Backend/service: `assessmentRouter` -> `generateQuestions`, `resolveTier`
  - DB on submit: updates `User`, writes `CreditTransaction`, inserts `Assessment`.

- **Resume analyzer pipeline**
  - Trigger: `/api/analyzer/run|deep-dive`
  - Backend: `analyzerRouter`
  - External: Ollama via `fetch`
  - DB: `user.findUnique`, `resume.upsert`, `spendCredits`/`creditTransaction` in deep-dive.

- **Mentor/session pipeline**
  - Trigger: `/api/mentors/*`, `/api/sessions/*`
  - Backend: `mentorsRouter`, `sessionsRouter`
  - DB: mentor query and session create/read
  - Socket notifications: `notifyUser` to mentor/mentee rooms on booking.

### UI-only pipelines

- Angular starter page render pipeline only:
  - Bootstrap -> `App` -> template render of static starter content + `Hello, {{ title() }}`.
  - No backend interaction.

## 8) Unwired, mocked, hardcoded, or broken features

- **Frontend/backend disconnect (major unwired boundary)**
  - Evidence: `client/src/app/app.routes.ts` has `routes: []`; no API call code in `client/src`.
  - Boundary: backend routes exist, but Angular app does not call any.

- **Mocked resume extraction and storage URL**
  - `server/src/routes/analyzer.ts`:
    - `const resumeText = req.body.resumeText || (req.file ? "Parsed PDF text mock" : "")`
    - `fileUrl: req.file ? "mock-cloudinary-url.pdf" : "inline://resume-text"`
  - Boundary: no real PDF parsing or Cloudinary upload despite installed `cloudinary` dependency.

- **Mentor slots are hardcoded synthetic data**
  - `server/src/routes/mentors.ts` -> `mentorsRouter.get("/:id/slots")` returns `[1,2,3,4]` day offsets from `Date.now()`.
  - Boundary: ignores `:id`; no persistence/availability model.

- **Deep-dive analyzer response is hardcoded**
  - `server/src/routes/analyzer.ts` -> `/deep-dive` returns static `summary` and fixed `recommendations` after charging credits.

- **Redis is configured but unused**
  - Required env key: `server/src/config/env.ts` (`REDIS_URL`), infra: `docker-compose.yml` service `redis`, dependency: `ioredis` in `server/package.json`.
  - Boundary: no `ioredis` import or cache/session logic in runtime source.

- **Commented “future implementation” markers corroborate partial design**
  - `server/src/services/auth.ts` and `server/src/services/credits.ts` mention future Redis-backed token/session/queue behavior; current code is synchronous DB/JWT-only.

## 9) Critical bugs, security flaws, integrity, contract/performance concerns

| Severity | Path + symbol | Proof | Impact | Fix recommendation |
|---|---|---|---|---|
| High | `server/prisma/schema.prisma` -> `model AnswerUnlock` (`userId` field) | `AnswerUnlock` lacks relation/FK to `User`; init migration has no `AnswerUnlock_userId_fkey` | Orphan unlock rows can exist for nonexistent users; weak referential integrity | Add `user User @relation(fields: [userId], references: [id])` and migration adding FK/index |
| High | `server/src/routes/questions.ts` -> `questionsRouter.post('/:id/unlock')` | Credits are spent inside transaction before AI call; if OpenAI generation fails later, there is no refund path | Users can lose credits without receiving unlocked content | Move generation before debit finalization, or add compensating transaction/refund on post-transaction failure |
| High | `server/src/services/socket.ts` -> `socket.on('register-user-room', (userId) => socket.join(...))` | No authentication on socket registration; arbitrary userId accepted | Client can subscribe to another user’s events (`session-booked`) | Authenticate socket handshake with JWT and derive room from verified subject, ignore arbitrary room requests |
| Medium | `server/src/routes/users.ts` -> `usersRouter.post('/:id/avatar')` | Accepts any string in `avatarUrl`; no URL validation unlike other schemas | Stored XSS/phishing URL injection risk in consumer UIs | Reuse Zod URL validator (`z.string().url()`) and optional allowlist/domain checks |
| Medium | `server/src/routes/auth.ts` -> `authRouter.post('/refresh')` + `services/auth.ts` | Stateless refresh token verification only; no token revocation store, no rotation tracking | Stolen refresh token remains valid until expiry | Implement refresh token rotation + revocation store (Redis/DB), bind token family/session metadata |
| Medium | `server/src/routes/assessment.ts` -> score percentage calculation | `scorePercentage = (score / parsed.data.questions.length) * 100`; no guard for empty questions array | `questions.length === 0` yields `Infinity`/`NaN` behavior | Enforce non-empty `questions` in schema (`min(1)`) and return 400 if empty |
| Medium | `server/src/routes/questions.ts` -> `questionsRouter.post('/')` | `postedById` accepted as nullable in DB but route always writes auth.id; no FK relation on `postedById` | Potential dangling author IDs and inability to join author safely | Add FK relation `postedBy` to `User`; migrate existing null/dangling values carefully |
| Medium | `server/src/routes/answers.ts` -> `answersRouter.post('/:id/upvote')` | No idempotency or voter tracking; repeated calls increment unboundedly | Vote manipulation; artificial credit farming at `%10` milestones | Add per-user vote table with unique `(answerId,userId)` and aggregate from rows |
| Low | `server/src/index.ts` + `server/src/lib/prisma.ts` | No graceful shutdown (`prisma.$disconnect`) in API runtime | Potential connection leakage during abrupt restarts | Add `process.on('SIGINT'/'SIGTERM')` shutdown handler with server close + prisma disconnect |
| Low | `server/src/routes/mentors.ts` -> `/slots` | Returns deterministic mock slots independent of `:id` | Misleading API contract and no real availability | Back slots with DB table keyed by mentor and date/time, or mark endpoint as explicit mock route |

## 10) Verified backend route-group coverage matrix vs Angular callers

| Backend group (mount) | Routes present | Angular caller found in `client/src` | Coverage verdict |
|---|---|---|---|
| `/api/auth` | `/register`, `/login`, `/refresh`, `/me` (`server/src/routes/auth.ts`) | No | Gap (backend-only) |
| `/api/users` | `GET/PUT /:id`, `POST /:id/avatar` (`server/src/routes/users.ts`) | No | Gap (backend-only) |
| `/api/credits` | `GET /history` (`server/src/routes/credits.ts`) | No | Gap (backend-only) |
| `/api/companies` | `GET /`, `GET /:id`, `GET /:id/questions`, `POST /:id/unlock-bundle` (`server/src/routes/companies.ts`) | No | Gap (backend-only) |
| `/api/questions` | `GET /`, `POST /`, `GET /:id/answers`, `POST /:id/answers`, `POST /:id/unlock` (`server/src/routes/questions.ts`) | No | Gap (backend-only) |
| `/api/answers` | `POST /:id/unlock`, `POST /:id/upvote` (`server/src/routes/answers.ts`) | No | Gap (backend-only) |
| `/api/mentors` | `GET /`, `GET /:id/slots` (`server/src/routes/mentors.ts`) | No | Gap (backend-only) |
| `/api/sessions` | `POST /book`, `GET /my` (`server/src/routes/sessions.ts`) | No | Gap (backend-only) |
| `/api/assessment` | `POST /generate`, `POST /submit` (`server/src/routes/assessment.ts`) | No | Gap (backend-only) |
| `/api/analyzer` | `POST /run`, `POST /deep-dive` (`server/src/routes/analyzer.ts`) | No | Gap (backend-only) |
| `/api/health*` | `GET /health`, `GET /health/db` (`server/src/routes/index.ts`) | No | Gap (backend-only) |

