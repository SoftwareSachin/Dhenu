import { gemini } from "../gemini";

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
    // Build conversation history for Gemini
    const conversationParts = messages.map(msg => {
      if (msg.role === "system") return null;
      return {
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      };
    }).filter(Boolean);

    // Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: conversationParts as any,
    });

    // response.text is a getter property, not a method
    return response.text || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Chat generation error:", error);
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
}
