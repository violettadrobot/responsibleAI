import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import signupRoutes from './routes/signups.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true
};

app.use(cors(corsOptions));

// Routes
app.use('/api', signupRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Event Signup API',
    status: 'running',
    endpoints: {
      signup: 'POST /api/signups',
      health: 'GET /api/health'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Event Signup API running on http://localhost:${PORT}`);
  console.log('CORS enabled for:', corsOptions.origin);
});
