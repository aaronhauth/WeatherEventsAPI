import { Request, Response, NextFunction } from 'express';

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  const expectedKey = process.env.API_SECRET_KEY;

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Missing auth key' });
  }

  if (apiKey === process.env.RAPIDAPI_SECRET) {
    return next(); // Allow if coming from RapidAPI
  }

  if (apiKey === expectedKey) {
    return next();
  }

  // If we reach here, the key is invalid
  return res.status(401).json({ error: 'Unauthorized: Invalid auth key' });
}
