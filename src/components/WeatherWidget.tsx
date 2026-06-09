import React from 'react';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudLightning, 
  Snowflake,
  Loader2
} from 'lucide-react';
import { useWeather } from '../hooks/use-weather';

// Mapeo de códigos WMO a iconos de Lucide
const getWeatherIcon = (code: number, isDay: boolean) => {
  if (code === 0) return isDay ? Sun : Moon;
  if (code === 1 || code === 2) return isDay ? CloudSun : CloudMoon;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 57) return CloudDrizzle;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return CloudRain;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return Snowflake;
  if (code >= 95 && code <= 99) return CloudLightning;
  
  // Fallback
  return isDay ? Sun : Moon;
};

export function WeatherWidget() {
  const { data, isLoading, isError } = useWeather();

  if (isLoading) {
    return (
      <div className="flex h-9 sm:h-10 items-center justify-center rounded-xl sm:rounded-2xl bg-background/85 px-2.5 sm:px-3 backdrop-blur-xl border border-border/50 shadow-sm">
        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    // Si hay error (ej. sin conexión y sin caché) no renderizamos nada molesto
    return null;
  }

  const Icon = getWeatherIcon(data.weatherCode, data.isDay);

  return (
    <div 
      className="flex h-9 sm:h-10 items-center gap-1.5 rounded-xl sm:rounded-2xl bg-background/85 px-2.5 sm:px-3 backdrop-blur-xl border border-border/50 shadow-sm transition-colors hover:bg-background"
      title="Clima en Nueva York"
    >
      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-foreground/80" />
      <span className="text-xs sm:text-[13px] font-bold">{Math.round(data.temperature)}°C</span>
    </div>
  );
}
