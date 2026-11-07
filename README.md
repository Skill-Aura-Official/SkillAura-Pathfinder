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

The Vite configuration uses port 8080, not 5173. Read the printed URL if the port is occupied. Set `VITE_API_URL` to the authorized backend API base, including its `/api` prefix; the source fallback is `http://localhost:5000/api`. This repository does not supply that server. Browser-prefixed variables are public build inputs, never a place for API secrets or service credentials.

## Integration boundary

`src/integrations/api/client.ts` calls the separate API using the stored authentication token. Account provisioning, MongoDB, Gemini configuration, migrations, token validation and backend startup cannot be configured from absent backend source. Obtain a compatible backend and its contract from the maintainer before testing login, resume analysis, chat or persistence. Prior full-stack installation instructions and provider deployment claims do not apply to this checkout. No live provider or hosted deployment is verified here.

## Checks

```sh
npm run build
npm run lint
npm test
npm run preview -- --host 127.0.0.1
```

The package declares Vitest tests and a local preview. A successful build or unit test would not prove external API acceptance. If the dashboard cannot load data, verify the supplied backend origin and authorization; do not assume a frontend build starts the missing server. Production static hosting also needs SPA fallback and the intended API configuration.

## Attribution and licence

SkillAura project and existing Git contributor attribution are preserved, along with React, Vite, shadcn/ui and other dependency notices. The previous README asserted MIT, but this revision contains no repository LICENSE file. Confirm intended terms with the maintainer; this update does not create or change a licence.

## Verified limits (2026-11-07)

On Node 24.3.0, locked installation with lifecycle scripts disabled passed. `npm run build` failed because source still imports the missing `src/integrations/supabase/client` module. `npm run lint` reported 25 errors and 9 warnings. The checkout therefore is not a verified runnable frontend; restore/reconcile the missing integration through a reviewed source change before expecting development or production builds to work.

The single example Vitest test passed; it asserts a constant and does not exercise application behavior.
