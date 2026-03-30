# SkillAura PathFinder AI

> A gamified career intelligence platform that transforms your professional growth into an epic RPG adventure.

```
Choose your universe. Select your mentor. Complete quests. Level up. Build your career.
```

---

## What Is This?

SkillAura PathFinder AI is a full-stack web application that gamifies career development. Instead of boring career advice pages, you get:

- An **RPG onboarding** with a boot sequence, universe selection, AI mentor, and class picking
- **Quests** with steps, XP, and completion tracking
- A **skill tree** with levelable abilities
- **AI-powered resume analysis** using Google Gemini
- An **AI mentor chatbot** that speaks in-character as your chosen anime hero
- **4 anime themes** that change the entire dashboard color scheme
- **Career GPS** with salary estimates and job readiness scores

---

## Features

### RPG Onboarding
The onboarding is a full-screen immersive experience:
1. **Boot Sequence** — System initialization with animated terminal
2. **Universe Selection** — Choose your anime world (Solo Leveling, DBZ, One Piece, Demon Slayer)
3. **AI Mentor** — Pick a character to guide you (3 per universe, 12 total)
4. **Account Creation** — Email/password signup integrated into the flow
5. **Identity** — Username and display name with uniqueness check
6. **Resume Scan** — Upload PDF/DOCX/TXT for AI analysis (skippable, can add later from Settings)
7. **Profile Generation** — AI extracts skills, stats, suggested class, readiness score
8. **Goal Selection** — Pick your objective (Get a Job, Master a Skill, Explore, Build a Startup)
9. **Class Selection** — Choose career class (Software Engineer, Data Scientist, AI Engineer, PM, Cybersecurity, Entrepreneur)
10. **System Activation** — Quests and skills assigned, dashboard unlocked

### Quest System
- **30+ quests** across 5 types: Skill, Project, Learning, Career, Social
- **4 difficulty levels**: Easy, Medium, Hard, Legendary
- **Per-user assignment** — each user gets their own quest copies
- **Step-by-step progress** — mark individual steps complete
- **Status tracking**: Available → In Progress → Completed
- **XP rewards** on completion, automatic level-up

### AI Mentor
- 12 unique character personas (Sung Jinwoo, Beru, Igris, Goku, Vegeta, Piccolo, Luffy, Zoro, Nami, Tanjiro, Rengoku, Giyu)
- Each has unique dialogue style and personality
- Powered by Google Gemini API (falls back to mock responses without API key)
- Chat history persisted in MongoDB

### RPG Progression
- **Level system** — gain XP from quests, level up at thresholds
- **Rank tiers** — E → D → C → B → A → S
- **6 core stats** — Technical, Logic, Creativity, Communication, Leadership, Problem Solving
- **Skill tree** — 16 skills across categories (Programming, Frontend, Backend, DevOps, AI, Soft Skills)

### Analytics
- Radar chart for ability stats
- Quest progress breakdown
- Skill count and categories
- Job readiness percentage
- Salary estimate

### Themes
| Theme | Colors | Inspired By |
|-------|--------|-------------|
| Solo Leveling | Purple / Deep Blue | Shadow Monarch aesthetic |
| Dragon Ball Z | Orange / Gold | Saiyan power aura |
| One Piece | Red / Warm Orange | Pirate adventure |
| Demon Slayer | Teal / Green-Blue | Breathing technique calm |

Themes apply instantly on selection. Change anytime from Settings.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite 8 |
| **Styling** | Tailwind CSS 3, Framer Motion 12 |
| **UI Components** | Radix UI primitives (shadcn/ui pattern) |
| **State** | React Context API, TanStack React Query 5 |
| **Routing** | React Router DOM 6 |
| **Charts** | Recharts 2 |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB (Mongoose 7) |
| **Authentication** | JWT (jsonwebtoken + bcrypt) |
| **AI** | Google Gemini 2.5 Flash |
| **File Upload** | Multer |
| **Notifications** | Sonner |

---

## Prerequisites

| Requirement | Version | Notes |
|------------|---------|-------|
| Node.js | 18+ | LTS recommended |
| MongoDB | 6+ | Local install or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier |
| Google Gemini API key | — | **Optional.** App works without it using mock AI responses |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/SkillAura-Pathfinder.git
cd SkillAura-Pathfinder
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillaura
JWT_SECRET=replace_with_a_random_secret_string
GEMINI_API_KEY=your_gemini_api_key_here
```

**Where to get Gemini API key:**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key
3. Paste it in `.env`

> **Note:** If `GEMINI_API_KEY` is not set, resume analysis and mentor chat fall back to built-in mock responses. Everything else works normally.

---

## Running Locally

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```
Output: `Connected to MongoDB` and `Server running on port 5000`

**Terminal 2 — Frontend:**
```bash
npm run dev
```
Output: `Local: http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Backend server port |
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `JWT_SECRET` | Yes | — | Secret key for JWT tokens |
| `GEMINI_API_KEY` | No | — | Google Gemini API key |

### Frontend (set in hosting platform or `.env` at root)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:5000/api` | Backend API base URL |

The frontend client (`src/integrations/api/client.ts`) already reads `VITE_API_URL`:
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```
No code changes needed for deployment — just set the env variable.

---

## Deployment

### Option 1 — Render (Free, Recommended)

**Step 1: Deploy Backend**

1. Go to [Render Dashboard](https://dashboard.render.com) → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name:** `skillaura-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
4. Add Environment Variables:
   - `MONGODB_URI` → your MongoDB Atlas connection string
   - `JWT_SECRET` → any random string (e.g. generate at [randomkeygen.com](https://randomkeygen.com))
   - `GEMINI_API_KEY` → your Gemini API key (optional)
5. Click **Create Web Service**
6. Wait for deploy, copy the URL (e.g. `https://skillaura-backend.onrender.com`)

**Step 2: Deploy Frontend**

1. Render Dashboard → New → Static Site
2. Same repository
3. Configure:
   - **Name:** `skillaura-frontend`
   - **Root Directory:** leave empty (root)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` → `https://skillaura-backend.onrender.com/api` (your backend URL + `/api`)
5. Click **Create Static Site**

---

### Option 2 — Railway

1. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub
2. Add **MongoDB** plugin (Railway provisions it automatically)
3. Create two services from the same repo:
   - **Backend:** Root directory = `backend`, Start command = `node server.js`
   - **Frontend:** Root directory = `/`, Build command = `npm install && npm run build`, Publish = `dist`
4. Set environment variables on backend service:
   - `MONGODB_URI` → Railway provides this from the MongoDB plugin
   - `JWT_SECRET` → your secret
   - `GEMINI_API_KEY` → your key
5. Set environment variable on frontend service:
   - `VITE_API_URL` → `https://your-backend-url.up.railway.app/api`
6. Deploy

---

### Option 3 — Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**
```bash
npm i -g vercel
vercel
```
During setup, add environment variable:
- `VITE_API_URL` = `https://your-backend-url.onrender.com/api`

**Backend on Render:** Same as Option 1 backend steps.

---

### Option 4 — Docker Compose (Self-Hosted)

**Create `Dockerfile` in project root:**
```dockerfile
FROM node:18-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .

FROM node:18-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=backend /app/backend ./backend
COPY --from=frontend /app/dist ./dist
RUN npm install -g serve

EXPOSE 5000
EXPOSE 3000

CMD ["sh", "-c", "cd backend && node server.js & serve -s dist -l 3000"]
```

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGODB_URI=mongodb://mongo:27017/skillaura
      - JWT_SECRET=your_random_secret_here
      - GEMINI_API_KEY=your_key_here
    depends_on:
      - mongo
    restart: unless-stopped

volumes:
  mongo_data:
```

**Run:**
```bash
docker-compose up -d
```

App available at `http://localhost:5000` (backend) and `http://localhost:3000` (frontend).

---

### Option 5 — VPS with Nginx + PM2

Tested on Ubuntu 22.04.

**Step 1: Server Setup**
```bash
# SSH into your server
ssh root@your-server-ip

# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB 7
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx and PM2
sudo apt install -y nginx
sudo npm install -g pm2
```

**Step 2: Deploy Application**
```bash
# Clone repo
cd /var/www
git clone https://github.com/your-username/SkillAura-Pathfinder.git
cd SkillAura-Pathfinder

# Install dependencies
npm install
cd backend && npm install && cd ..

# Create .env file
cat > backend/.env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillaura
JWT_SECRET=your_generated_secret_here
GEMINI_API_KEY=your_key_here
EOF

# Start backend with PM2
pm2 start backend/server.js --name skillaura-api
pm2 save
pm2 startup

# Build frontend
npm run build
```

**Step 3: Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/skillaura
```

Paste this config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (built static files)
    location / {
        root /var/www/SkillAura-Pathfinder/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/skillaura /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

**Step 4 (Optional): SSL with Let's Encrypt**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

App live at `https://your-domain.com`.

---

## API Endpoints

All endpoints prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Create account. Body: `{ username, email, password, full_name }` |
| POST | `/auth/login` | No | Login. Body: `{ email, password }`. Returns JWT token |
| POST | `/auth/check-username` | No | Check username availability. Body: `{ username }` |
| POST | `/auth/change-password` | Yes | Change password. Body: `{ currentPassword, newPassword }` |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | Yes | Get profile (displayName, bio, theme, mentor, hasResume) |
| PUT | `/profile/update` | Yes | Update profile. Body: `{ displayName, bio, theme, avatarUrl, resumeAnalysis }` |
| GET | `/profile/career` | Yes | Get career data (stats, level, rank, XP, theme, mentor) |
| PUT | `/profile/onboarding` | Yes | Save all onboarding data at once |
| GET | `/profile/skills` | Yes | Get user's assigned skills |
| GET | `/profile/achievements` | Yes | Get achievements list |
| GET | `/profile/leaderboard` | Yes | Get top players leaderboard |

### Quests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/quests?status=<status>` | Yes | Get quests filtered by status (available/in_progress/completed) |
| GET | `/quests/stats` | Yes | Get quest statistics |
| POST | `/quests/assign` | Yes | Assign starter quests. Body: `{ career_class, limit }` |
| PUT | `/quests/:id/start` | Yes | Start a quest (available → in_progress) |
| PUT | `/quests/:id/complete` | Yes | Complete a quest (awards XP) |
| POST | `/quests/:id/complete-step` | Yes | Complete one step. Body: `{ stepOrder }` |

### Skills

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/skills` | Yes | Get all available skills in the system |
| GET | `/skills/user` | Yes | Get current user's skills |
| POST | `/skills/assign` | Yes | Assign skills to user. Body: `{ limit }` |
| POST | `/skills/:name/add-xp` | Yes | Add XP to a skill. Body: `{ xp }` |

### AI

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai/analyze-resume` | Yes | Upload & analyze resume. Form data: `resume` (file), `userId` |
| POST | `/ai/mentor` | Yes | Chat with AI mentor. Body: `{ messages, character }` |
| POST | `/ai/generate-quests` | Yes | Generate career-specific quests |
| GET | `/ai/chat-history` | Yes | Get chat history with mentor |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/users` | Yes (admin) | Get all users |
| GET | `/admin/stats` | Yes (admin) | Get platform statistics |

---

## Project Structure

```
SkillAura-Pathfinder/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema (profile, stats, skills, achievements)
│   │   ├── Quest.js             # Quest schema (steps, status, XP, assignedTo)
│   │   ├── Skill.js             # Skill schema (category, difficulty, xpRequired)
│   │   ├── ChatMessage.js       # Chat history schema
│   │   ├── Company.js           # Company schema (recruiter feature)
│   │   └── Job.js               # Job schema (recruiter feature)
│   ├── routes/
│   │   ├── auth.js              # Signup, login, password change
│   │   ├── profile.js           # Profile CRUD, career data, onboarding
│   │   ├── quests.js            # Quest CRUD, start, complete, step tracking
│   │   ├── skills.js            # Skill assign, XP, level up
│   │   ├── ai.js                # Resume analysis, mentor chat, quest generation
│   │   ├── admin.js             # Admin panel routes
│   │   ├── recruiter.js         # Recruiter panel routes
│   │   ├── subscription.js      # Subscription/plan routes
│   │   ├── chat.js              # Chat routes
│   │   └── upload.js            # File upload routes
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── utils/
│   │   └── ...                  # Utility functions
│   ├── uploads/                 # Resume upload directory
│   ├── server.js                # Express server entry point
│   ├── package.json
│   └── .env                     # Environment variables (not in git)
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── XPBar.tsx        # XP/level bar in header
│   │   │   ├── QuestCard.tsx    # Quest display card
│   │   │   ├── SkillTree.tsx    # Skill tree component
│   │   │   ├── StatRadar.tsx    # Radar chart for stats
│   │   │   ├── CareerGPS.tsx    # Career GPS widget
│   │   │   ├── Leaderboard.tsx  # Leaderboard widget
│   │   │   └── Achievements.tsx # Achievements widget
│   │   ├── ui/                  # Reusable UI primitives (shadcn/ui)
│   │   ├── DashboardLayout.tsx  # Main dashboard shell (sidebar + header)
│   │   ├── ProtectedRoute.tsx   # Auth guard component
│   │   └── NavLink.tsx          # Navigation link component
│   ├── contexts/
│   │   └── AuthContext.tsx       # Auth state (user, token, login, logout)
│   ├── hooks/                   # Custom React hooks
│   ├── integrations/
│   │   └── api/
│   │       └── client.ts        # API client (fetch wrapper with auth)
│   ├── lib/                     # Utility libraries
│   ├── pages/
│   │   ├── Landing.tsx          # Landing page
│   │   ├── AboutPage.tsx        # About page
│   │   ├── Login.tsx            # Login page
│   │   ├── Signup.tsx           # Signup (redirects to onboarding)
│   │   ├── ForgotPassword.tsx   # Forgot password
│   │   ├── ResetPassword.tsx    # Reset password
│   │   ├── Onboarding.tsx       # RPG onboarding flow
│   │   ├── DashboardHome.tsx    # Dashboard home
│   │   ├── QuestLog.tsx         # Quest list with tabs
│   │   ├── CareerGPSPage.tsx    # Career GPS page
│   │   ├── SkillTreePage.tsx    # Skill tree + stat chart
│   │   ├── AnalyticsPage.tsx    # Analytics dashboard
│   │   ├── AchievementsPage.tsx # Achievements page
│   │   ├── LeaderboardPage.tsx  # Leaderboard page
│   │   ├── AIMentor.tsx         # AI mentor chat
│   │   ├── SettingsPage.tsx     # Settings (profile, theme, resume, security)
│   │   ├── PricingPage.tsx      # Pricing page
│   │   ├── AdminPanel.tsx       # Admin panel
│   │   ├── RecruiterPanel.tsx   # Recruiter panel
│   │   └── NotFound.tsx         # 404 page
│   ├── styles/
│   │   └── themes.css           # CSS variables for 4 anime themes
│   ├── assets/                  # Static assets
│   ├── App.tsx                  # Router + providers
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
│
├── public/                      # Static public files
│   └── favicon.png
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── postcss.config.js
├── index.html
└── README.md
```

---

## User Flow

```
Landing Page
    │
    ▼
Sign Up → Onboarding
    │         │
    │         ▼
    │    Boot Sequence (animated terminal)
    │         │
    │         ▼
    │    Choose Universe (Solo Leveling / DBZ / One Piece / Demon Slayer)
    │         │
    │         ▼
    │    Pick AI Mentor (3 characters per universe)
    │         │
    │         ▼
    │    Create Account (email + password)
    │         │
    │         ▼
    │    Set Username + Display Name
    │         │
    │         ▼
    │    Upload Resume (optional, AI analyzes it)
    │         │
    │         ▼
    │    Pick Goal + Career Class
    │         │
    │         ▼
    │    System Activated → Dashboard
    │
    ▼
Dashboard
    ├── Home (stats, quests, skills overview)
    ├── Quest Log (available / in progress / completed)
    ├── Career GPS (path planning)
    ├── Skill Tree (abilities + radar chart)
    ├── Analytics (charts + metrics)
    ├── Achievements (badges)
    ├── Leaderboard (top players)
    ├── AI Mentor (chat with your character)
    └── Settings (profile, theme, resume, security)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.