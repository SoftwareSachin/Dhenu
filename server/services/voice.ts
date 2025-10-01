import { openai } from "../openai";
import fs from "fs";
import path from "path";

export async function transcribeAudio(audioFilePath: string): Promise<string> {
  try {
    const audioReadStream = fs.createReadStream(audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
    });

    return transcription.text || "";
  } catch (error: any) {
    console.error("Audio transcription error:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}
