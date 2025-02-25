// src/app/page.js
"use client";

import { useState, useEffect } from "react";
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
import { fetchCurrentWeather, fetchForecast } from "@/utils/weatherService";
import { SearchForm } from "@/components/weather/SearchForm";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { ForecastCard } from "@/components/weather/ForecastCard";
import { ForecastDetail } from "@/components/weather/ForecastDetail";

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

  // Function to fetch weather data
  const fetchWeatherData = async (cityName) => {
    setIsLoading(true);
    setError(null);

    const loadingId = toast.loading(`Fetching weather data for ${cityName}...`);

    try {
      // Fetch current weather
      const weatherResult = await fetchCurrentWeather(cityName);
      setWeatherData(weatherResult);

      // Save to localStorage
      localStorage.setItem("lastSearchedCity", cityName);

      // Fetch 5-day forecast
      const dailyForecasts = await fetchForecast(cityName);
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
        icon: "⚠️",
        style: {
          backgroundColor: "#FEE2E2", // Light red background
          borderColor: "#EF4444", // Red border
          borderWidth: "1px",
          borderStyle: "solid",
          color: "#B91C1C", // Dark red text for the title
        },
        className: "error-toast", // Add a custom class
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
        style: {
          backgroundColor: "#1F2937", // Dark background
          color: "#F9FAFB", // Light text for title
        },
        className: "theme-toast-dark",
      });
    } else {
      document.documentElement.classList.remove("dark");
      toast("Theme Changed", {
        description: "Light mode enabled",
        icon: "☀️",
        style: {
          backgroundColor: "#F3F4F6", // Light background
          color: "#111827", // Dark text for title
        },
        className: "theme-toast-light",
      });
    }
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

        <SearchForm
          city={city}
          setCity={setCity}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

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
              <CurrentWeather weatherData={weatherData} darkMode={darkMode} />
            </TabsContent>

            <TabsContent value="forecast">
              {forecastData ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {forecastData.map((day, index) => (
                    <ForecastCard
                      key={index}
                      day={day}
                      darkMode={darkMode}
                      onClick={() => setSelectedForecast(day)}
                    />
                  ))}
                </div>
              ) : (
                <p>No forecast data available</p>
              )}

              {selectedForecast && (
                <ForecastDetail
                  forecast={selectedForecast}
                  darkMode={darkMode}
                  onClose={() => setSelectedForecast(null)}
                />
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
