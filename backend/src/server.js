import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/signups', (req, res) => {
  res.json({ success: true, message: 'Registration successful!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server on ${PORT}`);
});
