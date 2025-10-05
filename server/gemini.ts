import { GoogleGenerativeAI } from "@google/generative-ai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// Use the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.error("ERROR: No Gemini API key provided. Please set the GEMINI_API_KEY environment variable.");
}

// This API key is from Gemini Developer API Key, not vertex AI API Key
// Initialize with the correct format
export const gemini = new GoogleGenerativeAI(apiKey);
