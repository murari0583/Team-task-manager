# Team Task Manager

> Full-stack Team Task Manager — create projects, assign tasks, and track progress with role-based access (Admin / Member).

LIVE: https://<LIVE_URL>
REPO: https://github.com/<YOUR_USERNAME>/<REPO_NAME>
DEMO VIDEO: https://youtu.be/<VIDEO_ID>

## Tech stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React + Vite, Tailwind CSS
- Auth: JWT
- Deployment: Railway

## Key features
- Signup / Login (JWT)
- Role-based access (Admin / Member)
- Create projects, add members
- Create tasks, assign to team members, update status
- Dashboard with filters and overdue detection

---

## Quick start (local)

Prerequisites: Node.js, npm/yarn, MongoDB (or use hosted MongoDB)

1. Backend

```bash
cd backend
npm install
# copy .env.example to .env and set values
# example .env:
# MONGO_URI=<your-mongo-uri>
# JWT_SECRET=<your-jwt-secret>
# PORT=5000

npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173 (or the URL shown by Vite)
```

Notes: Backend scripts found in `backend/package.json`: `npm run dev` (nodemon) and `npm start` (node server.js). Frontend uses Vite (`npm run dev`, `npm run build`).

---

## Environment variables

Backend `.env` (example):

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing tokens
- `PORT` — server port (default 5000)

Frontend: set API base URL where needed (e.g., `VITE_API_URL=http://localhost:5000` or your Railway URL).

---

## Deployment (Railway)

1. Push your repo to GitHub.
2. Create two Railway services (or one service with two deployments):
   - Backend: Node service — connect repo, set `MONGO_URI`, `JWT_SECRET`, and `PORT` env vars.
   - Frontend: Static site — build with `npm run build` and serve the `dist` folder (or use Railway static plugin / host on Netlify/Vercel if easier).
3. Ensure backend's `start` script is `node server.js` (already present) so Railway can run the app.

Railway resources:
- https://railway.app/docs

---

## Project structure (important files)
- `backend/server.js` — Express entrypoint
- `backend/controllers/` — request handlers
- `backend/models/` — Mongoose models (`User`, `Project`, `Task`)
- `frontend/src/pages/` — main views (Dashboard, Projects, Tasks, etc.)

---

## Running tests
If you add tests, include commands here (e.g., `npm test`).

---

## README / Demo Checklist
- Confirm live site URL and replace `<LIVE_URL>` above.
- Replace repo and video links.
- Add any additional environment variables used by your code.

---

If you want, I can fill the placeholders with your live URL and GitHub repo and add a short demo script into the README — provide the links and preferred name to show. 
# 🚀 TeamTasker - MERN Stack Task Management System

![TeamTasker Banner](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

A fully responsive, production-ready full-stack application built for seamless team collaboration and task management. Designed with a premium, modern user interface and a robust Role-Based Access Control (RBAC) backend system.

## ✨ Key Features

### 🛡️ Role-Based Authentication & Security
- Secure JWT-based authentication
- **Admin Role**: Full system control. Can create projects, invite users, and assign tasks.
- **Member Role**: Focused workspace. Can view assigned projects and update task statuses.
- Password encryption using `bcryptjs`
- Protected API routes and React Router integration

### 📊 Dynamic Dashboards
- Intelligent routing based on user roles
- **Admin Control Center**: Overview of all system activities, total users, global overdue tasks, and complete task assignments.
- **Member Workspace**: Focused view of personal pending tasks, overdue alerts, and assigned projects.
- Real-time statistics and summary cards

### 📋 Interactive Task Management (Kanban Style)
- Premium Kanban-style board layout (`Todo`, `In Progress`, `Done`)
- Real-time status updates via seamless dropdowns
- Visual priority indicators (color-coded columns, overdue warnings)

### 📁 Project Organization
- Dedicated project details pages
- Team member visibility per project
- Task assignment constraints

## 🛠️ Technology Stack

**Frontend Architecture (Vite + React)**
*   **React 18** (Functional components, Hooks)
*   **Vite** (Lightning-fast build tooling)
*   **React Router v7** (Declarative routing)
*   **Axios** (HTTP client with interceptors)
*   **Heroicons** (Premium SVG icons)

**Backend Architecture (Node.js + Express)**
*   **Node.js & Express.js** (RESTful API framework)
*   **MongoDB Atlas & Mongoose** (Cloud NoSQL Database)
*   **JSON Web Tokens (JWT)** (Stateless authentication)
*   **CORS & Dotenv** (Environment & security configuration)

## 🚀 Quick Start / Local Development

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory (refer to `backend/.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`. 
*(Note: The Vite proxy is configured to automatically route `/api` requests to the backend).*

## 🏗️ Project Structure

```text
team-task-manager/
├── backend/                  # Express/Node API Server
│   ├── config/               # Database connection (MongoDB)
│   ├── controllers/          # Request handlers (Auth, Projects, Tasks)
│   ├── middleware/           # JWT Protection & Admin guards
│   ├── models/               # Mongoose Schemas
│   ├── routes/               # API endpoint definitions
│   └── server.js             # Entry point
│
└── frontend/                 # Vite/React Client App
    ├── src/
    │   ├── components/       # Reusable UI (Navbar, ProtectedRoute)
    │   ├── context/          # Global State (AuthContext)
    │   ├── pages/            # Main views (Dashboard, Tasks, Projects)
    │   ├── App.jsx           # App routing layout
    │   └── main.jsx          # React entry point
    └── vite.config.js        # Vite & API proxy config
```

## ☁️ Deployment Ready

This application is configured for modern PaaS deployment (like Railway.app, Render, or Heroku). 

- **Frontend**: Uses relative API paths `import.meta.env.VITE_API_URL` allowing seamless deployment.
- **Backend**: Configured with proper CORS policies for production and graceful error handling on database connections.

---
*Developed with focus on clean code, scalability, and modern UX design principles.*
