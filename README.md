# SkillAura PathFinder AI frontend

SkillAura's React/TypeScript career-development interface includes RPG onboarding, quests, skill trees, progress views, themed mentor chat and resume-upload screens. This revision contains the frontend only: the backend directory and server described by the former README are absent. UI paths do not establish working AI, database persistence or authenticated career services.

## Run the frontend

Use Node.js 22.12+ and npm compatible with the locked Vite dependencies. From the repository root:

```sh
git clone https://github.com/Skill-Aura-Official/SkillAura-Pathfinder.git
cd SkillAura-Pathfinder
npm ci
npm run dev -- --host 127.0.0.1
```

The Vite configuration uses port 8080, not 5173. Read the printed URL if the port is occupied. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the authorized Supabase project URL and public browser key. Missing or invalid configuration displays a setup-required screen before the application initializes its services. HTTPS project URLs and local HTTP development URLs are accepted. Never use a service-role key. Set `VITE_API_URL` to the authorized backend API base, including its `/api` prefix; the source fallback is `http://localhost:5000/api`. This repository does not supply that server. Browser-prefixed variables are public build inputs, never a place for API secrets or service credentials.

## Integration boundary

Authentication, database queries and edge-function calls use Supabase. Login and signup use the same Supabase session consumed by the existing authentication context. Signup without a returned session asks the user to confirm their email before login. The separate REST adapter in `src/integrations/api/client.ts` forwards the current Supabase session access token; its backend must independently validate that token. Some screens still depend on this separate API.

This repository does not supply the backend server, database schema/policies or deployed edge functions. Obtain compatible authorized services from the maintainer before testing resume analysis, chat or persistence. Configuration checks establish URL shape and key presence, not project access or correctness. No live provider or hosted deployment is verified here.

## Checks

```sh
npm run build
npm run lint
npm test
npx tsc --noEmit -p tsconfig.app.json
npm run preview -- --host 127.0.0.1
```

The package declares Vitest tests and a local preview. A successful build or unit test would not prove external API acceptance. If the dashboard cannot load data, verify the supplied backend origin and authorization; do not assume a frontend build starts the missing server. Production static hosting also needs SPA fallback and the intended API configuration.

## Attribution and licence

SkillAura project and existing Git contributor attribution are preserved, along with React, Vite, shadcn/ui and other dependency notices. The previous README asserted MIT, but this revision contains no repository LICENSE file. Confirm intended terms with the maintainer; this update does not create or change a licence.

## Verified limits (2026-11-07)

On Node 24.3.0, the production build, application TypeScript check and lint passed. Lint retains eight existing Fast Refresh warnings; no lint rules were disabled. Ten tests across five files passed, covering configuration validation, skill relationship normalization, mocked login/signup navigation and current-session REST authorization, plus the existing example test.

With external configuration explicitly blank and all non-local browser requests blocked, the production build showed the setup-required screen after initial load and reload at 390, 768 and 1440 pixels, with no horizontal overflow or page errors. No Supabase or backend API request occurred. Google Fonts requests were blocked during this check.

These checks do not verify real account provisioning, email delivery, authorization policies, database persistence, AI output, deployed functions or the separate API contract. Those remain integration acceptance work against maintainer-approved services.
