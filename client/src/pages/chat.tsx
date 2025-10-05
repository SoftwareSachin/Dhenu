import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Send, Bot } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "@/components/language-selector";
import VoiceInput from "@/components/voice-input";
import ImageUpload from "@/components/image-upload";
import type { Message, Conversation } from "@shared/schema";

export default function Chat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const { toast } = useToast();

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
    enabled: !!conversationId,
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/conversations", {
        userId: null,
        title: "New Conversation",
        language: selectedLanguage,
      });
      return await res.json();
    },
    onSuccess: (data: Conversation) => {
      setConversationId(data.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const res = await apiRequest("POST", "/api/chat", {
        conversationId,
        content,
        language: selectedLanguage,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
      setInputMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // New streaming message function
  const sendStreamingMessage = async (content: string) => {
    if (!conversationId) return;
    
    try {
      setIsStreaming(true);
      setStreamingMessage("");
      setInputMessage("");
      
      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      
      // Create a new EventSource connection
      const params = new URLSearchParams({
        conversationId: conversationId,
        content: content,
        language: selectedLanguage
      });
      
      try {
        const eventSource = new EventSource(`/api/chat/stream?${params.toString()}`);
        eventSourceRef.current = eventSource;
        
        // Set a timeout to handle cases where the connection is established but no data is received
        const connectionTimeout = setTimeout(() => {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            setIsStreaming(false);
            toast({
              title: "Connection Timeout",
              description: "No response received from the server. Please try again.",
              variant: "destructive",
            });
          }
        }, 15000); // 15 seconds timeout
        
        eventSource.onmessage = (event) => {
          // Clear the timeout since we received a message
          clearTimeout(connectionTimeout);
          
          try {
            const data = JSON.parse(event.data);
            
            if (data.error) {
              console.error("Server error:", data.error);
              toast({
                title: "Error",
                description: "Failed to generate response. Please try again.",
                variant: "destructive",
              });
              eventSource.close();
              setIsStreaming(false);
              return;
            }
            
            if (data.done) {
              eventSource.close();
              setIsStreaming(false);
              setStreamingMessage(null);
              queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
              return;
            }
            
            if (data.chunk) {
              setStreamingMessage((prev) => (prev || "") + data.chunk);
            }
          } catch (parseError) {
            console.error("Error parsing SSE data:", parseError);
            eventSource.close();
            setIsStreaming(false);
            toast({
              title: "Data Error",
              description: "Received invalid data from the server.",
              variant: "destructive",
            });
          }
        };
        
        eventSource.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error("EventSource error:", error);
          eventSource.close();
          setIsStreaming(false);
          toast({
            title: "Connection Error",
            description: "Lost connection to the server. Please try again.",
            variant: "destructive",
          });
        };
      } catch (connectionError) {
        console.error("Error creating EventSource:", connectionError);
        setIsStreaming(false);
        toast({
          title: "Connection Error",
          description: "Failed to establish connection with the server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsStreaming(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const analyzeImageMutation = useMutation({
    mutationFn: async ({ image, context }: { image: File; context: string }) => {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("conversationId", conversationId!);
      formData.append("context", context);
      formData.append("language", selectedLanguage);

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze image");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
      setSelectedImage(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!conversationId) {
      createConversationMutation.mutate();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;
    
    // Prevent sending if conversation hasn't been created yet
    if (!conversationId) {
      toast({
        title: "Please wait",
        description: "Initializing conversation...",
      });
      return;
    }

    if (selectedImage) {
      analyzeImageMutation.mutate({
        image: selectedImage,
        context: inputMessage.trim() || "crop disease",
      });
      setInputMessage("");
    } else {
      // Use streaming for better user experience
      const message = inputMessage.trim();
      
      // Save user message first
      await apiRequest("POST", "/api/conversations/" + conversationId + "/messages", {
        role: "user",
        content: message,
      });
      
      // Refresh messages to show user message
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
      
      // Start streaming response
      sendStreamingMessage(message);
      setInputMessage("");
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setInputMessage(text);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-primary px-6 py-4 flex items-center justify-between elevation-2">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" data-testid="button-back-home">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-white font-semibold">PashuAI</h1>
            <p className="text-white/80 text-xs">Online • Ready to help</p>
          </div>
        </div>
        <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messagesLoading ? (
          <>
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-20 w-2/3 ml-auto" />
            <Skeleton className="h-20 w-3/4" />
          </>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Bot className="text-accent" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to PashuAI</h2>
            <p className="text-muted-foreground max-w-md">
              I can help with crop management, livestock care, disease detection, market prices, and more. Ask me anything!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 message-enter ${
                  message.role === "user" ? "justify-end" : ""
                }`}
                data-testid={`message-${index}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-white" size={16} />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-3 elevation-1 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card text-card-foreground rounded-bl-sm"
                  }`}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Uploaded"
                      className="rounded-lg mb-2 max-w-full"
                    />
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {/* Streaming message display */}
            {isStreaming && streamingMessage !== null && (
              <div className="flex items-start space-x-3 message-enter">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white" size={16} />
                </div>
                <div className="rounded-2xl p-3 elevation-1 max-w-[80%] bg-card text-card-foreground rounded-bl-sm">
                  <p className="text-sm whitespace-pre-wrap">{streamingMessage}<span className="animate-pulse">▋</span></p>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <ImageUpload
            onImageSelect={setSelectedImage}
            disabled={!conversationId || sendMessageMutation.isPending || analyzeImageMutation.isPending}
          />
          <VoiceInput
            onTranscription={handleVoiceTranscription}
            disabled={!conversationId || sendMessageMutation.isPending || analyzeImageMutation.isPending}
          />
          <Input
            type="text"
            placeholder={!conversationId ? "Initializing..." : "Type your question..."}
            className="flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!conversationId || sendMessageMutation.isPending || analyzeImageMutation.isPending}
            data-testid="input-message"
          />
          <Button
            className="ripple"
            size="icon"
            onClick={handleSendMessage}
            disabled={
              !conversationId ||
              (!inputMessage.trim() && !selectedImage) ||
              sendMessageMutation.isPending ||
              analyzeImageMutation.isPending
            }
            data-testid="button-send"
          >
            <Send size={20} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by Dhenu 2.0 AI Models • 4000+ Topics • 95% Accuracy
        </p>
      </div>
    </div>
  );
}
