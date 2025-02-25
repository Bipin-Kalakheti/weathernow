"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";

export function CurrentWeather({ weatherData, darkMode }) {
  return (
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
            <WeatherIcon iconCode={weatherData.weather[0].icon} />
            <div className="ml-4">
              <h2 className="text-4xl font-bold">
                {Math.round(weatherData.main.temp)}°C
              </h2>
              <div className="flex gap-2 text-sm opacity-70">
                <span>↓ {Math.round(weatherData.main.temp_min)}°C</span>
                <span>↑ {Math.round(weatherData.main.temp_max)}°C</span>
              </div>
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
              <p className="font-semibold">{weatherData.main.humidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Wind</p>
              <p className="font-semibold">
                {Math.round(weatherData.wind.speed)} m/s
              </p>
            </div>
            <div>
              <p className="text-sm opacity-70">Pressure</p>
              <p className="font-semibold">{weatherData.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
