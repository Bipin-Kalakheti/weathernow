// OpenWeather API key and endpoints
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

export async function fetchCurrentWeather(cityName) {
  const response = await fetch(
    `${WEATHER_API_URL}?q=${cityName}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "City not found. Please check the spelling and try again."
        : "Failed to fetch weather data. Please try again later."
    );
  }

  return await response.json();
}

export async function fetchForecast(cityName) {
  const response = await fetch(
    `${FORECAST_API_URL}?q=${cityName}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data.");
  }

  const result = await response.json();
  return processForecastData(result.list);
}

function processForecastData(forecastList) {
  // Group forecasts by day
  const dailyData = {};

  forecastList.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temperatures: [],
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: [],
        wind: [],
        pressure: [],
        weatherIcons: [],
        descriptions: [],
        hourlyForecasts: [],
      };
    }

    dailyData[date].temperatures.push(forecast.main.temp);
    dailyData[date].temp_min = Math.min(
      dailyData[date].temp_min,
      forecast.main.temp_min
    );
    dailyData[date].temp_max = Math.max(
      dailyData[date].temp_max,
      forecast.main.temp_max
    );
    dailyData[date].humidity.push(forecast.main.humidity);
    dailyData[date].wind.push(forecast.wind.speed);
    dailyData[date].pressure.push(forecast.main.pressure);
    dailyData[date].weatherIcons.push(forecast.weather[0].icon);
    dailyData[date].descriptions.push(forecast.weather[0].description);

    // Add hourly forecast data
    dailyData[date].hourlyForecasts.push({
      time: new Date(forecast.dt * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: forecast.main.temp,
      icon: forecast.weather[0].icon,
      description: forecast.weather[0].description,
      humidity: forecast.main.humidity,
      wind: forecast.wind.speed,
      pressure: forecast.main.pressure,
    });
  });

  // Convert to array and calculate averages
  return Object.values(dailyData)
    .map((day) => ({
      date: day.date,
      avgTemp: (
        day.temperatures.reduce((sum, temp) => sum + temp, 0) /
        day.temperatures.length
      ).toFixed(1),
      minTemp: Math.round(day.temp_min),
      maxTemp: Math.round(day.temp_max),
      avgHumidity: Math.round(
        day.humidity.reduce((sum, h) => sum + h, 0) / day.humidity.length
      ),
      avgWind: (
        day.wind.reduce((sum, w) => sum + w, 0) / day.wind.length
      ).toFixed(1),
      avgPressure: Math.round(
        day.pressure.reduce((sum, p) => sum + p, 0) / day.pressure.length
      ),
      icon: day.weatherIcons[Math.floor(day.weatherIcons.length / 2)],
      description: day.descriptions[Math.floor(day.descriptions.length / 2)],
      hourlyForecasts: day.hourlyForecasts,
    }))
    .slice(0, 5);
}
