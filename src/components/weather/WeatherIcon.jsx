"use client";

import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
} from "lucide-react";

export function WeatherIcon({ iconCode, className = "h-12 w-12" }) {
  const iconMap = {
    "01d": <Sun className={`${className} text-yellow-500`} />,
    "01n": <Sun className={`${className} text-gray-300`} />,
    "02d": <Cloud className={`${className} text-gray-400`} />,
    "02n": <Cloud className={`${className} text-gray-500`} />,
    "03d": <Cloud className={`${className} text-gray-400`} />,
    "03n": <Cloud className={`${className} text-gray-500`} />,
    "04d": <Cloud className={`${className} text-gray-400`} />,
    "04n": <Cloud className={`${className} text-gray-500`} />,
    "09d": <CloudRain className={`${className} text-blue-400`} />,
    "09n": <CloudRain className={`${className} text-blue-500`} />,
    "10d": <CloudRain className={`${className} text-blue-400`} />,
    "10n": <CloudRain className={`${className} text-blue-500`} />,
    "11d": <CloudLightning className={`${className} text-yellow-400`} />,
    "11n": <CloudLightning className={`${className} text-yellow-500`} />,
    "13d": <CloudSnow className={`${className} text-gray-200`} />,
    "13n": <CloudSnow className={`${className} text-gray-300`} />,
    "50d": <Wind className={`${className} text-gray-400`} />,
    "50n": <Wind className={`${className} text-gray-500`} />,
  };

  return (
    iconMap[iconCode] || <Cloud className={`${className} text-gray-400`} />
  );
}
