import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: ['https://violettadrobot.com', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.json({ status: 'API running' });
});

app.post('/api/signups', (req, res) => {
  const { firstName, lastName, email, companyName } = req.body;

  if (!firstName || !lastName || !email || !companyName) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  res.json({
    success: true,
    message: 'Registration successful! Check your email for confirmation.'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
