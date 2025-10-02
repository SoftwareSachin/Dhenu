import { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscription, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const maxRetries = 2; // Maximum number of automatic retries

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser");
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeRecognition = () => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error("Speech recognition not supported in this browser");
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'en-US'; // Default to English
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onTranscription(transcript);
      setIsRecording(false);
      setRetryCount(0); // Reset retry count on success
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      
      // Handle network errors with retry logic
      if (event.error === 'network' && retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        toast({
          title: "Retrying...",
          description: `Network issue detected. Retrying (${retryCount + 1}/${maxRetries})...`,
          variant: "default",
        });
        
        // Wait a moment before retrying
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error("Failed to restart recognition", e);
              setIsRecording(false);
            }
          }
        }, 1000);
      } else {
        // Show error toast for other errors or if max retries reached
        let errorMessage = `Failed to recognize speech: ${event.error}`;
        let actionText = "";
        
        // Provide helpful suggestions based on error type
        if (event.error === 'network') {
          errorMessage = "Network connection issue detected.";
          actionText = "Please check your internet connection and try again.";
        } else if (event.error === 'no-speech') {
          errorMessage = "No speech detected.";
          actionText = "Please speak clearly and try again.";
        } else if (event.error === 'aborted') {
          errorMessage = "Speech recognition was aborted.";
          actionText = "Please try again.";
        }
        
        toast({
          title: "Speech Recognition Error",
          description: errorMessage + (actionText ? " " + actionText : ""),
          variant: "destructive",
        });
        setIsRecording(false);
        setRetryCount(0); // Reset retry count
      }
    };
    
    recognition.onend = () => {
      // Only set recording to false if we're not in the middle of a retry
      if (retryCount === 0 || retryCount >= maxRetries) {
        setIsRecording(false);
      }
    };
    
    return recognition;
  };

  const startRecording = async () => {
    try {
      // Reset retry count when starting a new recording
      setRetryCount(0);
      
      // Check for microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const recognition = initializeRecognition();
      recognition.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Failed to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={isRecording ? "voice-recording text-destructive" : ""}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      title={isRecording ? "Stop Recording" : "Voice Input"}
      data-testid="button-voice-input"
    >
      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
    </Button>
  );
}
