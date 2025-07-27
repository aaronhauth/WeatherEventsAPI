import axios from 'axios';

export interface WeatherInfo {
  description: string;
  temperatureC: number;
  isBadWeather: boolean;
}

export async function getCurrentWeather(location: string): Promise<WeatherInfo> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

  const response = await axios.get(endpoint);
  const data = response.data;

  const weatherMain = data.weather[0].main.toLowerCase();
  const isBadWeather = weatherMain.includes('rain') || weatherMain.includes('storm') || weatherMain.includes('snow');

  return {
    description: data.weather[0].description,
    temperatureC: data.main.temp,
    isBadWeather
  };
}