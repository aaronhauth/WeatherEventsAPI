"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherService_1 = require("../services/weatherService");
const placesService_1 = require("../services/placesService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const { location, date, preferences } = req.query;
    if (!location || typeof location !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid required parameter: location' });
    }
    try {
        const weather = await (0, weatherService_1.getWeatherForDate)(location, date);
        const places = await (0, placesService_1.getNearbyPlaces)(location);
        const isTooHot = weather.temperatureC >= 32;
        const isTooCold = weather.temperatureC <= 5;
        const filteredSuggestions = places.filter(place => {
            if (weather.isBadWeather && place.isOutdoor)
                return false;
            if ((isTooHot || isTooCold) && place.isOutdoor)
                return false;
            if (preferences === 'indoor' && place.isOutdoor)
                return false;
            if (preferences === 'outdoor' && !place.isOutdoor)
                return false;
            return true;
        });
        res.json({
            location,
            date: date || new Date().toISOString().split('T')[0],
            preferences: preferences || 'any',
            weather,
            tempFlags: {
                isTooHot,
                isTooCold
            },
            suggestions: filteredSuggestions.slice(0, 5)
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
exports.default = router;
