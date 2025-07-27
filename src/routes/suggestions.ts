import { Router, Request, Response } from 'express';
import { getWeatherForDate } from '../services/weatherService';
import { getNearbyPlaces } from '../services/placesService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { location, date, preferences } = req.query;

  if (!location || typeof location !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid required parameter: location' });
  }

  try {
    const weather = await getWeatherForDate(location, date as string);

    const places = await getNearbyPlaces(location);


    const isTooHot = weather.temperatureC >= 32;
    const isTooCold = weather.temperatureC <= 5;

    const filteredSuggestions = places.filter(place => {
        if (weather.isBadWeather && place.isOutdoor) return false;
        if ((isTooHot || isTooCold) && place.isOutdoor) return false;

        if (preferences === 'indoor' && place.isOutdoor) return false;
        if (preferences === 'outdoor' && !place.isOutdoor) return false;

        return true;
    });

    res.json({
        location,
        date: date || new Date().toISOString().split('T')[0],
        preferences: preferences || 'any',
        weather,
        suggestions: filteredSuggestions.slice(0, 5)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});


export default router;