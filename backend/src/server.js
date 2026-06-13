import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ ok: true });
});

app.get('/test-sheets', async (req, res) => {
  try {
    const { submitToGoogleSheet } = await import('./services/googleSheetsService.js');
    const result = await submitToGoogleSheet({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      companyName: 'TestCo'
    }, process.env.GOOGLE_SHEETS_ID);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.post('/api/signups', (req, res) => {
  res.json({ success: true, message: 'Registration successful!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on ${PORT}`);
});
