import { openai } from "../openai";

export interface VisionAnalysisResult {
  diagnosis: string;
  confidence: number;
  treatment: string[];
  prevention: string[];
  description: string;
}

export async function analyzeCropOrLivestockImage(
  base64Image: string,
  context: string,
  language: string = "en"
): Promise<VisionAnalysisResult> {
  const systemPrompt = `You are an expert agricultural AI vision analyst specializing in crop disease detection and livestock health assessment.

Analyze the provided image and provide:
1. Diagnosis - identify the disease, pest, or health condition
2. Confidence level (0-100%)
3. Treatment recommendations (specific, actionable steps)
4. Prevention measures for future
5. Detailed description of what you observe

${language !== "en" ? `Respond in ${language} language.` : ""}

Respond in JSON format with this structure:
{
  "diagnosis": "disease/condition name",
  "confidence": 95,
  "treatment": ["step 1", "step 2"],
  "prevention": ["measure 1", "measure 2"],
  "description": "detailed observation"
}`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this agricultural image. Context: ${context}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      diagnosis: result.diagnosis || "Unknown condition",
      confidence: Math.max(0, Math.min(100, result.confidence || 0)),
      treatment: Array.isArray(result.treatment) ? result.treatment : [],
      prevention: Array.isArray(result.prevention) ? result.prevention : [],
      description: result.description || "No description available",
    };
  } catch (error: any) {
    console.error("Vision analysis error:", error);
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}
