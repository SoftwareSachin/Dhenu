import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle, MoreVertical, Send, Image as ImageIcon, Mic, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ChatInterface() {
  const [selectedLang, setSelectedLang] = useState("en");

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "te", name: "తెలుగు" },
    { code: "kn", name: "ಕನ್ನಡ" },
  ];

  return (
    <section id="solutions" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="text-primary" size={16} />
              <span className="text-primary text-sm font-medium">PashuAI</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Your AI Agricultural Assistant
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Chat with our intelligent copilot for instant answers to your farming questions. Powered by Dhenu AI models trained on millions of agricultural conversations.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-primary" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Multilingual Support</h4>
                  <p className="text-muted-foreground text-sm">Converse in Hindi, English, or 20+ regional languages</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-primary" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Contextual Understanding</h4>
                  <p className="text-muted-foreground text-sm">Remembers your farm details and previous conversations</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-primary" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Real-time Responses</h4>
                  <p className="text-muted-foreground text-sm">Get instant expert advice powered by Dhenu 2.0</p>
                </div>
              </div>
            </div>

            <Link href="/chat">
              <Button className="elevation-2 ripple" data-testid="button-try-demo">
                <Bot className="mr-2" size={20} />
                Try Live Demo
              </Button>
            </Link>
          </div>

          <div className="bg-background rounded-2xl elevation-4 overflow-hidden border border-border">
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">PashuAI</h3>
                  <p className="text-white/80 text-xs">Online • Ready to help</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <MoreVertical size={20} />
              </Button>
            </div>

            <div className="bg-card border-b border-border px-6 py-3 flex items-center space-x-2 overflow-x-auto">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Language:</span>
              {languages.map((lang) => (
                <Badge
                  key={lang.code}
                  variant={selectedLang === lang.code ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setSelectedLang(lang.code)}
                >
                  {lang.name}
                </Badge>
              ))}
              <Badge variant="outline" className="whitespace-nowrap">+16 more</Badge>
            </div>

            <div className="p-6 space-y-4 h-96 overflow-y-auto custom-scrollbar">
              <div className="flex items-start space-x-3 message-enter">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white" size={16} />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm p-3 elevation-1 max-w-[80%]">
                  <p className="text-sm text-foreground">Namaste! I'm your AI agricultural assistant. I can help with crop management, livestock care, disease detection, and market prices. How can I assist you today?</p>
                </div>
              </div>

              <div className="flex items-end justify-end message-enter">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm p-3 elevation-1 max-w-[80%]">
                  <p className="text-sm">My wheat crop is showing yellow spots on leaves. What could be the problem?</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 message-enter">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white" size={16} />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm p-3 elevation-1 max-w-[80%]">
                  <p className="text-sm text-foreground mb-2">Yellow spots on wheat leaves could indicate:</p>
                  <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                    <li>Wheat rust (fungal disease)</li>
                    <li>Nitrogen deficiency</li>
                    <li>Septoria leaf blotch</li>
                  </ul>
                  <p className="text-sm text-foreground mt-2">Would you like to upload a photo for precise diagnosis?</p>
                </div>
              </div>
            </div>

            <div className="bg-card border-t border-border p-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="hover:bg-muted" title="Upload Image">
                  <ImageIcon size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted" title="Voice Input">
                  <Mic size={20} />
                </Button>
                <Input 
                  type="text" 
                  placeholder="Type your question..." 
                  className="flex-1"
                  data-testid="input-chat-message"
                />
                <Button className="ripple" size="icon" data-testid="button-send-message">
                  <Send size={20} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Powered by Dhenu 2.0 AI Models</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
