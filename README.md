# Team Task Manager (MERN Stack)

A full-stack project and task management application built using MongoDB, Express.js, React, Node.js, and Tailwind CSS. Features role-based access control (Admin & Member) and an intuitive dashboard.

## Features
- **Authentication:** Secure login and registration using JWT and bcrypt.
- **Role-Based Access:** Admins can create projects and add tasks. Members can view their assigned tasks and update status.
- **Dashboard:** Overview of projects, pending tasks, and overdue tasks.
- **Kanban-Style Tasks:** Tasks organized by Todo, In Progress, and Done.

## Tech Stack
- **Frontend:** React (Vite), React Router, Tailwind CSS, Heroicons, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).

---

## Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, OR a MongoDB Atlas URI.

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
# If using MongoDB Atlas, replace the URI above with your Atlas connection string
JWT_SECRET=supersecretjwtkey123
NODE_ENV=development
```

### 3. Install Dependencies
Open a terminal and install dependencies for the backend and frontend:
```bash
# In the root project folder
cd backend
npm install

cd ../frontend
npm install
```

### 4. Run the Application
You'll need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Your app will be running at `http://localhost:5173`.

---

## Railway Deployment Guide (Mandatory for Assignment)

Deploying to Railway is simple because we've set up a root `package.json` with a custom `build` and `start` script.

### Step 1: Push to your GitHub
1. Create a new repository on your GitHub account.
2. Initialize Git in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Set up Railway Database
1. Log in to [Railway](https://railway.app/).
2. Click **New Project** -> **Provision PostgreSQL/MySQL/MongoDB**. Choose **MongoDB**.
3. Once provisioned, click the MongoDB instance, go to **Connect**, and copy the `Mongo Connection URL`.

### Step 3: Deploy the Application
1. In the same Railway project, click **New** -> **GitHub Repo**.
2. Select the repository you just pushed.
3. Once added, Railway will try to build it. We need to add Environment Variables first.
4. Click on your newly added service, go to the **Variables** tab, and add:
   - `MONGO_URI`: (Paste the connection string from Step 2)
   - `JWT_SECRET`: (Create a secure random string)
   - `NODE_ENV`: `production`
5. Railway will automatically detect the root `package.json`. It will run the `build` script (which builds the React frontend) and then the `start` script (which starts the Express server).
6. Go to the **Settings** tab of your service, scroll down to **Domains**, and click **Generate Domain**.
7. Wait for the build to finish. Your app is now live!

---

## Demo Video Script Suggestion (2-5 mins)
1. **Intro (30s):** Introduce the MERN stack app and mention it's hosted on Railway. Show the live URL.
2. **Auth (30s):** Register a new "Admin" user. Log in to show the JWT token works.
3. **Dashboard (30s):** Show the clean, responsive UI with stats and recent items.
4. **Projects (1m):** Go to the Projects tab. As an Admin, create a new project. Click into the project details.
5. **Tasks (1m):** Inside the project, add a new task and assign it to a user. Go to the Tasks board, show the Kanban layout, and update the status of the task.
6. **Code Overview (30s):** Briefly show the folder structure, mentioning `models`, `controllers`, `context`, and the Railway root deployment config.
