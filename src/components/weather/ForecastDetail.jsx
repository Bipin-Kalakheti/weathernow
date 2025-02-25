"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherIcon } from "./WeatherIcon";

export function ForecastDetail({ forecast, darkMode, onClose }) {
  return (
    <Card
      className={`mt-6 ${
        darkMode ? "bg-gray-800 text-white border-gray-700" : ""
      }`}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Detailed Forecast for {forecast.date}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm opacity-70">Humidity</p>
              <p className="font-semibold">{forecast.avgHumidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Wind Speed</p>
              <p className="font-semibold">{forecast.avgWind} m/s</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Pressure</p>
              <p className="font-semibold">{forecast.avgPressure} hPa</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {forecast.hourlyForecasts.map((hour, idx) => (
                <div
                  key={idx}
                  className="text-center p-2 rounded-lg bg-opacity-10 bg-gray-500"
                >
                  <p className="text-sm font-semibold">{hour.time}</p>
                  <div className="flex justify-center my-1">
                    <WeatherIcon iconCode={hour.icon} />
                  </div>
                  <p className="text-lg font-bold">{Math.round(hour.temp)}°C</p>
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
  );
}
