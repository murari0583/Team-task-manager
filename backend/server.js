import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// CORS — allow configured frontend origins and Railway app domains in production
const parseOrigins = (...values) => {
  const origins = values
    .filter(Boolean)
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set(origins);
};

const allowedOrigins = parseOrigins(
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.ALLOWED_ORIGINS,
  'http://localhost:5173',
  'http://localhost:3000'
);

const railwayAppPattern = /^https:\/\/team-task-manager(?:-[a-z0-9-]+)?\.up\.railway\.app$/i;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const isAllowedOrigin = allowedOrigins.has(origin);
    const isRailwayAppOrigin = railwayAppPattern.test(origin);

    if (isDevelopment || isAllowedOrigin || isRailwayAppOrigin) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../frontend/dist');
  const indexFile = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexFile)) {
    console.error(`❌ Frontend build not found at ${indexFile}. Ensure build step runs before start.`);
  }

  app.use(express.static(distPath, { index: false }));

  app.get(/^(?!\/api\/).*/, (req, res, next) => {
    // Missing static assets should return 404, not index.html (prevents MIME errors).
    if (req.path.startsWith('/assets/')) {
      return res.status(404).send('Asset not found');
    }

    if (!fs.existsSync(indexFile)) {
      return res.status(500).send('Frontend build missing on server');
    }

    return res.sendFile(indexFile, (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
