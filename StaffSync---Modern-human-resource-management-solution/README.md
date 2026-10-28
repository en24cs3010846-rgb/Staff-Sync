# StaffSync — HRMS (MERN)

**Status: backend API + React client written. Not yet run end-to-end against MongoDB. docs/, workflow tests and deployment guide remain.** See checklist below.

## Run the backend
```bash
cd server
npm install
cp .env.example .env     # fill MONGODB_URI, JWT_SECRET (32+ chars), SEED_HR_EMAIL, SEED_HR_PASSWORD
npm run seed:admin       # creates the initial HR administrator
npm run dev              # http://localhost:5000/api/health
```

## Run the frontend
```bash
cd client
npm install
npm run dev      # http://localhost:5173 (proxies /api to http://localhost:5000)
```
Then: `cd server && npm run seed:demo` and sign in as `hr@staffsync.demo` / `Demo@12345`.

## Tests
```bash
# Option A: your own throwaway MongoDB (database is DROPPED by the tests)
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/staffsync_test npm test
# Option B: no variable -> mongodb-memory-server downloads a MongoDB binary (needs internet)
npm test
```

## Checklist
- [x] Phase 1: scaffolding, env validation, User model, JWT (httpOnly cookie + Bearer), role middleware, rate-limited login, change-password, HR seed script, auth tests (written, not yet executed — see note)
- [ ] Phase 2: React client, layout, login, protected routes, dashboards
- [x] Phase 3 (API only): employee & manager management, manager scoping
- [x] Phase 4 (API only): attendance check-in/out, HR corrections with audit
- [x] Phase 5 (API only): leaves, overlap checks, balances, atomic review
  (APIs written; NOT yet executed against MongoDB. Notifications on leave decisions arrive with Phase 6)
- [x] Phase 6 (API only): announcements, trainings (atomic capacity-safe enrollment), notifications
- [x] Phase 7 (API only): HR/manager analytics, CSV export (`/api/analytics/export/:type`, HR only)
- [x] Phase 8 (partial): `npm run seed:demo` (demo password `Demo@12345`, local use only, wipes data)
- [x] Phase 2: React client (Vite + Bootstrap + Redux Toolkit + Recharts); production build compiles. Not yet exercised in a browser against the API.
- [ ] Tests for attendance/leave/training workflows, docs/ folder, deployment guide

Note: auth tests have not been executed yet because the build sandbox cannot reach MongoDB downloads.

## Demo accounts (after `npm run seed:demo`; local demo only, never production)
`hr@staffsync.demo`, `manager1@staffsync.demo`, `manager2@staffsync.demo`, `employee1@staffsync.demo` ... `employee8@staffsync.demo` — password `Demo@12345`
