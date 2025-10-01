import fs from "fs";
import path from "path";

export async function transcribeAudio(audioFilePath: string): Promise<string> {
  try {
    // Gemini doesn't support audio transcription
    // Voice input is now handled client-side using browser's Web Speech API
    // This endpoint is kept for backwards compatibility but returns a message
    throw new Error("Server-side audio transcription is no longer supported. Please use the voice input button which uses browser-based speech recognition.");
  } catch (error: any) {
    console.error("Audio transcription error:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}
