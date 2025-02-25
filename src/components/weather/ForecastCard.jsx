"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";

export function ForecastCard({ day, darkMode, onClick }) {
  return (
    <Card
      className={`${
        darkMode ? "bg-gray-800 text-white border-gray-700" : ""
      } cursor-pointer transform transition-transform hover:scale-105`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{day.date}</CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-4">
        <div className="flex justify-center">
          <WeatherIcon iconCode={day.icon} />
        </div>
        <p className="text-2xl font-bold mt-2">{day.avgTemp}°C</p>
        <div className="flex justify-center gap-2 text-sm opacity-70 mt-1">
          <span>↓ {day.minTemp}°C</span>
          <span>↑ {day.maxTemp}°C</span>
        </div>
        <p className="capitalize text-sm mt-1">{day.description}</p>
      </CardContent>
    </Card>
  );
}
