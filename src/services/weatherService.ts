import axios from 'axios';

export interface WeatherInfo {
  description: string;
  temperatureC: number;
  isBadWeather: boolean;
}

export async function getWeatherForDate(location: string, date?: string): Promise<WeatherInfo> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const targetDate = date ? new Date(date) : new Date();
  const today = new Date();
  const isToday = targetDate.toDateString() === today.toDateString();

  if (isToday) {
    // Use current weather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url);

    return {
      description: data.weather[0].description,
      temperatureC: data.main.temp,
      isBadWeather: isSevereWeather(data.weather[0].main)
    };
  } else {
    // Use forecast (5-day / 3-hour forecast)
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
    const { data } = await axios.get(url);

    const target = targetDate.getTime();
    const closest = data.list.reduce((prev: any, curr: any) => {
      const prevTime = new Date(prev.dt_txt).getTime();
      const currTime = new Date(curr.dt_txt).getTime();
      return Math.abs(currTime - target) < Math.abs(prevTime - target) ? curr : prev;
    });

    return {
      description: closest.weather[0].description,
      temperatureC: closest.main.temp,
      isBadWeather: isSevereWeather(closest.weather[0].main)
    };
  }
}

function isSevereWeather(main: string): boolean {
  const severe = ['rain', 'snow', 'storm', 'thunderstorm', 'drizzle'];
  return severe.includes(main.toLowerCase());
}