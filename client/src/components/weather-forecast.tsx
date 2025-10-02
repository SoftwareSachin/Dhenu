import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

const WeatherForecast: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(`${latitude},${longitude}`);
        },
        (err) => {
          setError('Unable to retrieve your location. Please enter a location manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter a location manually.');
      setLoading(false);
    }
  };

  // Function to fetch weather data from API
  const fetchWeatherData = async (query: string) => {
    try {
      setLoading(true);
      // Using WeatherAPI.com with the provided API key
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=bf81145e2af8429985050422250210&q=${query}&days=7&aqi=no&alerts=no`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual location search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeatherData(location);
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Weather Forecast</h2>
      
      {/* Location search form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city or location"
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
        <button 
          type="button" 
          onClick={getCurrentLocation}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          Use My Location
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading weather data...</p>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Current weather */}
      {weatherData && !loading && (
        <div>
          <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}
                </h3>
                <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                  {weatherData.current.temp_c}°C
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Humidity: {weatherData.current.humidity}% | Wind: {weatherData.current.wind_kph} km/h
                </p>
              </div>
              <div className="flex flex-col items-center mt-4 md:mt-0">
                <img 
                  src={weatherData.current.condition.icon} 
                  alt={weatherData.current.condition.text}
                  className="w-16 h-16"
                />
                <p className="text-gray-700 dark:text-gray-200 mt-1">
                  {weatherData.current.condition.text}
                </p>
              </div>
            </div>
          </div>

          {/* 7-day forecast */}
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">7-Day Forecast</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {weatherData.forecast.forecastday.map((day) => (
              <div key={day.date} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <p className="font-medium text-gray-800 dark:text-white">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <img 
                  src={day.day.condition.icon} 
                  alt={day.day.condition.text}
                  className="w-12 h-12 mx-auto my-2"
                />
                <p className="text-sm text-gray-600 dark:text-gray-300">{day.day.condition.text}</p>
                <div className="flex justify-center gap-2 mt-2">
                  <span className="text-gray-800 dark:text-white">{Math.round(day.day.maxtemp_c)}°</span>
                  <span className="text-gray-500 dark:text-gray-400">{Math.round(day.day.mintemp_c)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;