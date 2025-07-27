import express from 'express';
import dotenv from 'dotenv';
import suggestionsRoute from './routes/suggestions';
import cors from 'cors';

// Import Swagger UI and YAML parser
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

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

// Swagger UI setup
const openapiPath = path.join(__dirname, 'docs', 'openapi.yaml');
const openapiDoc = YAML.parse(fs.readFileSync(openapiPath, 'utf8'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});