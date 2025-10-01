import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set in environment variables");
}

// This API key is from Gemini Developer API Key, not vertex AI API Key
export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
