import { useQuery } from '@tanstack/react-query';

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
}

const fetchWeather = async (): Promise<WeatherData> => {
  // Coordenadas fijas para Nueva York
  const lat = 40.7128;
  const lng = -74.0060;
  
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&timezone=America%2FNew_York`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
  };
};

export function useWeather() {
  return useQuery({
    queryKey: ['nyc-weather'],
    queryFn: fetchWeather,
    // Refetch every 15 minutes since weather doesn't change by the second
    refetchInterval: 1000 * 60 * 15,
    staleTime: 1000 * 60 * 5,
  });
}
