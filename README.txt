Team Task Manager

Full-stack Team Task Manager — create projects, assign tasks, and track progress with role-based access (Admin / Member).

LIVE: https://<LIVE_URL>
REPO: https://github.com/<YOUR_USERNAME>/<REPO_NAME>
DEMO VIDEO: https://youtu.be/<VIDEO_ID>

Tech stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React + Vite, Tailwind CSS
- Auth: JWT
- Deployment: Railway

Key features
- Signup / Login (JWT)
- Role-based access (Admin / Member)
- Create projects, add members
- Create tasks, assign to team members, update status
- Dashboard with filters and overdue detection

Quick start (local)

Prerequisites: Node.js, npm/yarn, MongoDB (or use hosted MongoDB)

1. Backend

cd backend
npm install
# copy .env.example to .env and set values
# example .env:
# MONGO_URI=<your-mongo-uri>
# JWT_SECRET=<your-jwt-secret>
# PORT=5000

npm run dev

2. Frontend

cd frontend
npm install
npm run dev
# open http://localhost:5173 (or the URL shown by Vite)

Notes: Backend scripts found in backend/package.json: "npm run dev" (nodemon) and "npm start" (node server.js). Frontend uses Vite ("npm run dev", "npm run build").

Environment variables

Backend .env (example):
- MONGO_URI — MongoDB connection string
- JWT_SECRET — secret for signing tokens
- PORT — server port (default 5000)

Frontend: set API base URL where needed (e.g., VITE_API_URL=http://localhost:5000 or your Railway URL).

Deployment (Railway)

1. Push your repo to GitHub.
2. Create two Railway services (or one service with two deployments):
   - Backend: Node service — connect repo, set MONGO_URI, JWT_SECRET, and PORT env vars.
   - Frontend: Static site — build with "npm run build" and serve the dist folder (or use Railway static plugin / host on Netlify/Vercel if easier).
3. Ensure backend's start script is "node server.js" so Railway can run the app.

Railway resources: https://railway.app/docs

Project structure (important files)
- backend/server.js — Express entrypoint
- backend/controllers/ — request handlers
- backend/models/ — Mongoose models (User, Project, Task)
- frontend/src/pages/ — main views (Dashboard, Projects, Tasks, etc.)

Running tests
If you add tests, include commands here (e.g., "npm test").

README / Demo Checklist
- Confirm live site URL and replace <LIVE_URL> above.
- Replace repo and video links.
- Add any additional environment variables used by your code.

If you want, I can fill the placeholders with your live URL, GitHub repo and demo video link — provide the links and preferred display name.