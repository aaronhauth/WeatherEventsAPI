import { Request, Response, NextFunction } from 'express';

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const expectedKey = process.env.API_SECRET_KEY;

  if (apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }

    const rapidAPIHeader = req.headers['x-rapidapi-proxy-secret'];
    if (rapidAPIHeader && rapidAPIHeader === process.env.RAPIDAPI_SECRET) {
    return next(); // Allow if coming from RapidAPI
    }

  next();
}
