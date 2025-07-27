import express from 'express';
import dotenv from 'dotenv';
import suggestionsRoute from './routes/suggestions';
import cors from 'cors';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow cross-origin requests
app.use(express.json()); // for future body parsing

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Suggestions route
app.use('/suggestions', suggestionsRoute);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});