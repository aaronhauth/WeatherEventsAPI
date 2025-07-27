"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentWeather = getCurrentWeather;
const axios_1 = __importDefault(require("axios"));
async function getCurrentWeather(location) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    const response = await axios_1.default.get(endpoint);
    const data = response.data;
    const weatherMain = data.weather[0].main.toLowerCase();
    const isBadWeather = weatherMain.includes('rain') || weatherMain.includes('storm') || weatherMain.includes('snow');
    return {
        description: data.weather[0].description,
        temperatureC: data.main.temp,
        isBadWeather
    };
}
