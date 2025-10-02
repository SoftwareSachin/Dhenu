import { gemini } from "../gemini";
import { getFormattedWeatherInfo, isWeatherQuery, extractLocationFromQuery, getCurrentWeatherByLocation, formatWeatherResponseForChat } from "./weather";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  language: string = "en"
): Promise<string> {
  // Check if the user is asking about temperature or weather
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === "user" && isWeatherQuery(lastMessage.content)) {
    try {
      // Check if a specific location is mentioned
      const location = extractLocationFromQuery(lastMessage.content);
      
      if (location) {
        // Get weather for the specified location
        const weatherData = await getCurrentWeatherByLocation(location);
        if (weatherData) {
          return formatWeatherResponseForChat(weatherData, language);
        }
      }
      
      // Default to a general location if no specific location found
      const weatherData = await getCurrentWeatherByLocation("New Delhi");
      if (weatherData) {
        return formatWeatherResponseForChat(weatherData, language);
      }
      
      return "I couldn't detect your current location and temperature. Please check your local weather service or provide your location.";
    } catch (error) {
      console.error("Error getting weather info:", error);
      // Continue with normal response if weather detection fails
    }
  }
  const systemPrompt = `You are PashuAI, an expert agricultural and livestock advisory AI assistant. You provide guidance on farming, livestock care, and sustainable agricultural practices.

${language !== "en" ? `Respond in ${language} language.` : ""}

Be concise, practical, and farmer-friendly in your responses.`;

  try {
    // Format messages for the API
    const formattedMessages = [];
    
    // Add system message first
    formattedMessages.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    
    // Add the rest of the messages
    for (const msg of messages) {
      if (msg.role === "system") continue;
      
      formattedMessages.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }

    // Configure generation parameters with simpler settings
    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 1024,
    };

    // Try multiple model options in case one fails
    let result;
    let modelError;
    
    try {
      // First try the newest model
      const model = gemini.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig
      });
      
      result = await model.generateContent({
        contents: formattedMessages,
      });
    } catch (err) {
      console.log("First model attempt failed, trying fallback model:", err);
      modelError = err;
      
      try {
        // Fallback to gemini-1.5-flash if the first attempt fails
        const fallbackModel = gemini.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig
        });
        
        result = await fallbackModel.generateContent({
          contents: formattedMessages,
        });
      } catch (fallbackErr) {
        console.error("Both model attempts failed:", fallbackErr);
        throw modelError; // Throw the original error for consistent error handling
      }
    }

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Chat generation error:", error);
    return "I apologize, but I encountered an error while generating a response. Please try again.";
  }
}

// Simplified function for streaming responses
export async function generateStreamingChatResponse(
  messages: ChatMessage[],
  language: string = "en",
  onChunk: (chunk: string) => void
): Promise<void> {
  // Check if the user is asking about temperature or weather
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === "user" && 
      (lastMessage.content.toLowerCase().includes("temperature") || 
       lastMessage.content.toLowerCase().includes("weather") ||
       lastMessage.content.toLowerCase().includes("how hot") ||
       lastMessage.content.toLowerCase().includes("how cold"))) {
    try {
      const weatherInfo = await getFormattedWeatherInfo();
      onChunk(weatherInfo);
      return;
    } catch (error) {
      console.error("Error getting weather info for stream:", error);
      // Continue with normal response if weather detection fails
    }
  }
  const systemPrompt = `You are PashuAI, an expert agricultural and livestock advisory AI assistant. You provide guidance on farming, livestock care, and sustainable agricultural practices.

${language !== "en" ? `Respond in ${language} language.` : ""}

Be concise, practical, and farmer-friendly in your responses.`;

  try {
    // Format messages for the API
    const formattedMessages = [];
    
    // Add system message first
    formattedMessages.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    
    // Add the rest of the messages
    for (const msg of messages) {
      if (msg.role === "system") continue;
      
      formattedMessages.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }

    // Configure generation parameters with simpler settings
    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 1024,
    };

    // Try multiple model options in case one fails
    let result;
    let modelError;
    
    try {
      // First try the newest model
      const model = gemini.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig
      });
      
      result = await model.generateContentStream({
        contents: formattedMessages,
      });
    } catch (err) {
      console.log("First streaming model attempt failed, trying fallback model:", err);
      modelError = err;
      
      try {
        // Fallback to gemini-1.5-flash if the first attempt fails
        const fallbackModel = gemini.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig
        });
        
        result = await fallbackModel.generateContentStream({
          contents: formattedMessages,
        });
      } catch (fallbackErr) {
        console.error("Both streaming model attempts failed:", fallbackErr);
        throw modelError; // Throw the original error for consistent error handling
      }
    }

    // Process the streaming response
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (error) {
    console.error("Streaming chat generation error:", error);
    onChunk("I apologize, but I encountered an error while generating a response. Please try again.");
  }
}
