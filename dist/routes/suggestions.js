"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherService_1 = require("../services/weatherService");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const { location, date, preferences } = req.query;
    if (!location || typeof location !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid required parameter: location' });
    }
    try {
        const weather = await (0, weatherService_1.getCurrentWeather)(location);
        res.json({
            location,
            date: date || new Date().toISOString().split('T')[0],
            preferences: preferences || 'any',
            weather,
            suggestions: [
                weather.isBadWeather
                    ? { name: 'Visit an art museum', type: 'indoor' }
                    : { name: 'Go for a park walk', type: 'outdoor' }
            ]
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});
exports.default = router;
