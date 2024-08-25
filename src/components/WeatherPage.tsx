import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWeather } from '../services/weatherService';
import { WeatherData } from '../types/Weather';
import sunny from './images/sunny.png';
import rainy from './images/rainy.png';
import cloudy from './images/cloudy.png'; // Updated image source
import snowy from './images/snowy.png'; // Updated image source
import defaultWeather from './images/defaultweather.jpg';

const WeatherPage: React.FC = () => {
  const { city } = useParams<Record<string, string | undefined>>();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        if (city) {
          const data = await fetchWeather(city);
          setWeather(data);
        }
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError(errorMessage);
      }
    };
    loadWeather();
  }, [city]);

  const getWeatherImage = (main: string) => {
    switch (main) {
      case 'Clear':
        return sunny;
      case 'Rain':
        return rainy;
      case 'Clouds':
        return cloudy;
      case 'Snow':
        return snowy;
      default:
        return defaultWeather;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: `url(${defaultWeather})` }}
    >
      <div className="p-6 max-w-4xl w-full bg-white shadow-lg rounded-lg backdrop-blur-md flex">
        {error ? (
          <p className="text-xl text-red-600">{error}</p>
        ) : weather ? (
          <>
            <div className="w-1/2 p-4">
              <h1 className="text-2xl font-bold mb-4">Weather in {city}</h1>
              <p className="text-xl mb-2"><strong>Temperature:</strong> {weather.main.temp}°C</p>
              <p className="text-xl mb-2"><strong>Description:</strong> {weather.weather[0].description}</p>
              <p className="text-xl mb-2"><strong>Humidity:</strong> {weather.main.humidity}%</p>
              <p className="text-xl mb-2"><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
              <p className="text-xl"><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
            </div>
            <div className="w-1/2 p-4 flex items-center justify-center">
              <img 
                src={getWeatherImage(weather.weather[0].main)} 
                alt={weather.weather[0].main} 
                className="max-w-full h-auto"
              />
            </div>
          </>
        ) : (
          <p className="text-xl">Loading weather data...</p>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
