import { openai } from "../openai";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  language: string = "en"
): Promise<string> {
  const systemPrompt = `You are an expert agricultural and livestock advisory AI assistant. You provide comprehensive guidance on:
- Crop management (planting, irrigation, fertilization, harvesting)
- Pest control and disease management
- Livestock care (cattle, buffalo, goats) - health, breeding, nutrition
- Weather-based farming advice
- Market prices and selling strategies
- Sustainable agricultural practices

You have knowledge of 4000+ agricultural topics and provide accurate, actionable advice to farmers.
${language !== "en" ? `Respond in ${language} language.` : ""}
Be concise, practical, and farmer-friendly in your responses.`;

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Chat generation error:", error);
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}
