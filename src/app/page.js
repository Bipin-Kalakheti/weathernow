// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
} from "lucide-react";

export default function WeatherApp() {
  // State for the search input, weather data, loading state, and errors
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);

  // Load last searched city from localStorage on mount
  useEffect(() => {
    // Check if code is running in the browser
    if (typeof window !== "undefined") {
      const savedCity = localStorage.getItem("lastSearchedCity");
      const savedTheme = localStorage.getItem("darkMode");
      setDarkMode(savedTheme === "true");

      if (savedCity) {
        setCity(savedCity);
        fetchWeatherData(savedCity);
      }
    }
  }, []);

  // OpenWeather API key and endpoints
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Get from .env.local
  const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

  // Function to fetch weather data
  const fetchWeatherData = async (cityName) => {
    setIsLoading(true);
    setError(null);

    const loadingId = toast.loading(`Fetching weather data for ${cityName}...`);

    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `${WEATHER_API_URL}?q=${cityName}&units=metric&appid=${API_KEY}`
      );

      if (!weatherResponse.ok) {
        throw new Error(
          weatherResponse.status === 404
            ? "City not found. Please check the spelling and try again."
            : "Failed to fetch weather data. Please try again later."
        );
      }

      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);

      // Save to localStorage
      localStorage.setItem("lastSearchedCity", cityName);

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${FORECAST_API_URL}?q=${cityName}&units=metric&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data.");
      }

      const forecastResult = await forecastResponse.json();
      const dailyForecasts = processForecastData(forecastResult.list);
      setForecastData(dailyForecasts);

      toast.dismiss(loadingId);
      toast.success(`Weather data for ${cityName}`, {
        description: `Current temperature: ${Math.round(
          weatherResult.main.temp
        )}°C`,
      });
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error("Error", {
        description: err.message,
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to process the 5-day forecast data
  const processForecastData = (forecastList) => {
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
          hourlyForecasts: [], // Add hourly data
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
      .slice(0, 5); // Ensure we only get 5 days
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city.trim());
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      toast("Theme Changed", {
        description: "Dark mode enabled",
        icon: "🌙",
      });
    } else {
      document.documentElement.classList.remove("dark");
      toast("Theme Changed", {
        description: "Light mode enabled",
        icon: "☀️",
      });
    }
  };

  // Function to get weather icon based on weather condition
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      "01d": <Sun className="h-12 w-12 text-yellow-500" />,
      "01n": <Sun className="h-12 w-12 text-gray-300" />,
      "02d": <Cloud className="h-12 w-12 text-gray-400" />,
      "02n": <Cloud className="h-12 w-12 text-gray-500" />,
      "03d": <Cloud className="h-12 w-12 text-gray-400" />,
      "03n": <Cloud className="h-12 w-12 text-gray-500" />,
      "04d": <Cloud className="h-12 w-12 text-gray-400" />,
      "04n": <Cloud className="h-12 w-12 text-gray-500" />,
      "09d": <CloudRain className="h-12 w-12 text-blue-400" />,
      "09n": <CloudRain className="h-12 w-12 text-blue-500" />,
      "10d": <CloudRain className="h-12 w-12 text-blue-400" />,
      "10n": <CloudRain className="h-12 w-12 text-blue-500" />,
      "11d": <CloudLightning className="h-12 w-12 text-yellow-400" />,
      "11n": <CloudLightning className="h-12 w-12 text-yellow-500" />,
      "13d": <CloudSnow className="h-12 w-12 text-gray-200" />,
      "13n": <CloudSnow className="h-12 w-12 text-gray-300" />,
      "50d": <Wind className="h-12 w-12 text-gray-400" />,
      "50n": <Wind className="h-12 w-12 text-gray-500" />,
    };

    return iconMap[iconCode] || <Cloud className="h-12 w-12 text-gray-400" />;
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weather App</h1>
          <Button
            variant="outline"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>

        {isLoading ? (
          <Card className="w-full mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Skeleton className="h-16 w-16 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : weatherData ? (
          <Tabs defaultValue="current" className="w-full mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="current">Current Weather</TabsTrigger>
              <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <Card
                className={`w-full ${
                  darkMode ? "bg-gray-800 text-white border-gray-700" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      {weatherData.name}, {weatherData.sys.country}
                    </span>
                    <span className="text-sm opacity-70">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center">
                      {getWeatherIcon(weatherData.weather[0].icon)}
                      <div className="ml-4">
                        <h2 className="text-4xl font-bold">
                          {Math.round(weatherData.main.temp)}°C
                        </h2>
                        <p className="capitalize text-lg">
                          {weatherData.weather[0].description}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 md:mt-0 md:ml-auto">
                      <div>
                        <p className="text-sm opacity-70">Feels like</p>
                        <p className="font-semibold">
                          {Math.round(weatherData.main.feels_like)}°C
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-70">Humidity</p>
                        <p className="font-semibold">
                          {weatherData.main.humidity}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-70">Wind</p>
                        <p className="font-semibold">
                          {Math.round(weatherData.wind.speed)} m/s
                        </p>
                      </div>
                      <div>
                        <p className="text-sm opacity-70">Pressure</p>
                        <p className="font-semibold">
                          {weatherData.main.pressure} hPa
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast">
              {forecastData ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {forecastData.map((day, index) => (
                    <Card
                      key={index}
                      className={`${
                        darkMode ? "bg-gray-800 text-white border-gray-700" : ""
                      } cursor-pointer transform transition-transform hover:scale-105`}
                      onClick={() => setSelectedForecast(day)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{day.date}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center pb-4">
                        <div className="flex justify-center">
                          {getWeatherIcon(day.icon)}
                        </div>
                        <p className="text-2xl font-bold mt-2">
                          {day.avgTemp}°C
                        </p>
                        <div className="flex justify-center gap-2 text-sm opacity-70 mt-1">
                          <span>↓ {day.minTemp}°C</span>
                          <span>↑ {day.maxTemp}°C</span>
                        </div>
                        <p className="capitalize text-sm mt-1">
                          {day.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No forecast data available</p>
              )}

              {selectedForecast && (
                <Card
                  className={`mt-6 ${
                    darkMode ? "bg-gray-800 text-white border-gray-700" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Detailed Forecast for {selectedForecast.date}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedForecast(null)}
                      >
                        ✕
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm opacity-70">Humidity</p>
                          <p className="font-semibold">
                            {selectedForecast.avgHumidity}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm opacity-70">Wind Speed</p>
                          <p className="font-semibold">
                            {selectedForecast.avgWind} m/s
                          </p>
                        </div>
                        <div>
                          <p className="text-sm opacity-70">Pressure</p>
                          <p className="font-semibold">
                            {selectedForecast.avgPressure} hPa
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Hourly Forecast
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedForecast.hourlyForecasts.map((hour, idx) => (
                            <div
                              key={idx}
                              className="text-center p-2 rounded-lg bg-opacity-10 bg-gray-500"
                            >
                              <p className="text-sm font-semibold">
                                {hour.time}
                              </p>
                              <div className="flex justify-center my-1">
                                {getWeatherIcon(hour.icon)}
                              </div>
                              <p className="text-lg font-bold">
                                {Math.round(hour.temp)}°C
                              </p>
                              <p className="text-xs opacity-70">
                                {hour.humidity}% humidity
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : error ? (
          <Card
            className={`w-full p-4 ${
              darkMode ? "bg-red-900" : "bg-red-50"
            } border ${
              darkMode ? "border-red-800" : "border-red-200"
            } rounded-md mb-6`}
          >
            <p className={`${darkMode ? "text-red-200" : "text-red-500"}`}>
              {error}
            </p>
          </Card>
        ) : (
          <Card
            className={`w-full text-center p-8 ${
              darkMode ? "bg-gray-800 text-white border-gray-700" : ""
            }`}
          >
            <p className="text-lg mb-2">Welcome to the Weather App!</p>
            <p>Search for a city to get the current weather conditions.</p>
          </Card>
        )}

        <Card
          className={`w-full mt-8 ${
            darkMode ? "bg-gray-800 text-white border-gray-700" : ""
          }`}
        >
          <CardHeader>
            <CardTitle className="text-lg">About This App</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This weather application uses the OpenWeather API to provide
              current weather conditions and 5-day forecasts for cities
              worldwide. Built with Next.js, Shadcn UI components, and Tailwind
              CSS.
            </p>
          </CardContent>
          <CardFooter className="text-sm opacity-70">
            <p>Data provided by OpenWeather</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
