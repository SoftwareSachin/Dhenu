import { gemini } from "../gemini";

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
    const contents = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
      `Analyze this agricultural image. Context: ${context}`,
    ];

    // Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            diagnosis: { type: "string" },
            confidence: { type: "number" },
            treatment: { 
              type: "array",
              items: { type: "string" }
            },
            prevention: { 
              type: "array",
              items: { type: "string" }
            },
            description: { type: "string" },
          },
          required: ["diagnosis", "confidence", "treatment", "prevention", "description"],
        },
      },
      contents: contents,
    });

    const result = JSON.parse(response.text || "{}");
    
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
