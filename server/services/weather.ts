// Weather service for PashuAI
import axios from 'axios';

/**
 * Determines if a message is asking about temperature or weather
 */
export function isWeatherQuery(message: string): boolean {
  const weatherKeywords = [
    // English keywords
    'temperature', 'weather', 'forecast', 'hot', 'cold', 'rain', 'sunny', 
    'climate', 'degrees', 'celsius', 'fahrenheit',
    
    // Hindi keywords
    'tapman', 'taapman', 'tapmaan', 'mausam', 'mosam', 'garmi', 
    'thand', 'barish', 'dhoop', 'jalvayu', 'degree',
    
    // Common misspellings and variations
    'temp', 'whether', 'forcast', 'temprature', 'temprature',
    'tapamaan', 'taapmaan', 'tapamana', 'tapamana'
  ];
  
  const lowercaseMessage = message.toLowerCase();
  
  // Check for common Hindi temperature phrases
  if (lowercaseMessage.includes('aaj ka tapman') || 
      lowercaseMessage.includes('aaj ka mausam') ||
      lowercaseMessage.includes('tapman kya hai') ||
      lowercaseMessage.includes('kitna garam') ||
      lowercaseMessage.includes('kitna thanda')) {
    return true;
  }
  
  return weatherKeywords.some(keyword => lowercaseMessage.includes(keyword));
}

/**
 * Extracts location from a weather query message
 */
export function extractLocationFromQuery(message: string): string {
  // Default to user's current location if no specific location mentioned
  let location = '';
  
  // Simple location extraction - can be improved with NLP
  const locationPatterns = [
    /in\s+([a-zA-Z\s]+)(?:\?|$)/i,
    /at\s+([a-zA-Z\s]+)(?:\?|$)/i,
    /for\s+([a-zA-Z\s]+)(?:\?|$)/i,
    /(?:weather|temperature)\s+(?:in|at|of)\s+([a-zA-Z\s]+)(?:\?|$)/i,
    /(?:weather|temperature)\s+(?:for)\s+([a-zA-Z\s]+)(?:\?|$)/i,
    /([a-zA-Z\s]+)\s+(?:weather|temperature)(?:\?|$)/i,
    /(?:mein|me)\s+([a-zA-Z\s]+)(?:\?|$)/i,
    /([a-zA-Z\s]+)\s+(?:ka|ki|ke)\s+(?:tapman|mausam)(?:\?|$)/i,
    /(?:tapman|mausam)\s+(?:ka|ki|ke)\s+([a-zA-Z\s]+)(?:\?|$)/i
  ];
  
  for (const pattern of locationPatterns) {
    const match = message.match(pattern);
    if (match && match[1] && match[1].trim().length > 2) {
      location = match[1].trim();
      break;
    }
  }
  
  return location;
}

interface OpenWeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

// OpenWeatherMap API key - free tier
const WEATHER_API_KEY = '4da2a5d5a0b3f7ed9f79f2a856098b96';

/**
 * Get current weather by IP address
 */
export async function getCurrentWeatherByIP(): Promise<OpenWeatherResponse | null> {
  try {
    // First get the user's IP-based location
    const geoResponse = await axios.get('https://ipapi.co/json/');
    const { city, country } = geoResponse.data;
    
    // Then get weather data based on location
    return await getCurrentWeatherByLocation(`${city},${country}`);
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}

/**
 * Get current weather by location name
 */
/**
 * Formats weather data into a chat-friendly response
 */
export function formatWeatherResponseForChat(weatherData: OpenWeatherResponse, language: string = "en"): string {
  if (language === "hi" || language.toLowerCase().includes("hindi")) {
    return `${weatherData.name}, ${weatherData.sys.country} में वर्तमान तापमान ${weatherData.main.temp}°C है।
मौसम की स्थिति: ${weatherData.weather[0].description}।
आर्द्रता: ${weatherData.main.humidity}%।
हवा की गति: ${weatherData.wind.speed} मीटर/सेकंड।`;
  }
  
  return `Current temperature in ${weatherData.name}, ${weatherData.sys.country} is ${weatherData.main.temp}°C.
Weather condition: ${weatherData.weather[0].description}.
Humidity: ${weatherData.main.humidity}%.
Wind speed: ${weatherData.wind.speed} m/s.`;
}

export async function getCurrentWeatherByLocation(location: string): Promise<OpenWeatherResponse | null> {
  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    return weatherResponse.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

/**
 * Get formatted weather information for the AI
 */
export async function getFormattedWeatherInfo(): Promise<string> {
  try {
    const weatherData = await getCurrentWeatherByIP();
    
    if (!weatherData) {
      return "I couldn't detect your current location and temperature. Please check your local weather service or provide your location.";
    }
    
    return `Based on your IP location (${weatherData.name}, ${weatherData.sys.country}), the current temperature is ${weatherData.main.temp}°C (${(weatherData.main.temp * 9/5 + 32).toFixed(1)}°F) with ${weatherData.weather[0].description.toLowerCase()} conditions. The humidity is ${weatherData.main.humidity}% and wind speed is ${weatherData.wind.speed} m/s.`;
  } catch (error) {
    console.error('Error formatting weather info:', error);
    return "I couldn't detect your current location and temperature. Please check your local weather service or provide your location.";
  }
}