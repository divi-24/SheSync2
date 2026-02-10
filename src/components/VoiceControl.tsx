"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  error?: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition {
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastError, setLastError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();
  const { success, error, warning } = useToast();

  const processCommand = useCallback(async (command: string) => {
    // Local commands: scrolling and back
    const cmd = command.toLowerCase();
    if (cmd.includes('page down') || cmd.includes('pagedown') || cmd.includes('scroll down')) {
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
      success('Scrolled down');
      return;
    }
    if (cmd.includes('page up') || cmd.includes('pageup') || cmd.includes('scroll up')) {
      window.scrollBy({ top: -window.innerHeight * 0.9, behavior: 'smooth' });
      success('Scrolled up');
      return;
    }
    if (cmd.includes('back') || cmd.includes('go back') || cmd.includes('previous page')) {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        window.history.back();
        success('Going back');
      } else {
        warning('No previous page in history');
      }
      return;
    }

    // Otherwise forward to server to parse route
    try {
      const res = await fetch('/api/voicenav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      if (!res.ok) {
        let text = '';
        try { 
          text = await res.text();
          try { text = JSON.stringify(JSON.parse(text)); } catch { /* ignore parse error */ }
        } catch { 
          text = 'Unable to read error response'; 
        }
        console.error('voicenav server error', res.status, text);
        error(`Server error (${res.status}). ${String(text).slice(0,120)}`);
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error('Failed to parse response:', parseErr);
        error('Invalid server response');
        return;
      }

      // If server explicitly indicates no route, show a fading notification and do not navigate
      if (data?.notFound) {
        warning('No matching page found for that request');
        return;
      }

      const route = data?.route;
      if (!route) {
        warning('No matching page found for that request');
        return;
      }

      success(`Navigating to ${route === '/' ? 'Home' : route.slice(1)}`);
      router.push(route);
    } catch (err) {
      console.error('Error processing command:', err);
      error('Failed to process voice command');
    }
  }, [router, success, error, warning]);

  useEffect(() => {
    const isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost";

    if (!isSecure) {
      error("Voice recognition requires HTTPS. Feature unavailable.");
      return;
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const windowWithSpeech = window as any;
      const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current!.continuous = false;
      recognitionRef.current!.interimResults = false;
      recognitionRef.current!.lang = "en-US";
      recognitionRef.current!.maxAlternatives = 1;

      recognitionRef.current!.onresult = async (event: SpeechRecognitionEvent) => {
        const speechResult = event.results[0][0].transcript;
        setLastError(null);
        setTranscript(speechResult);
        await processCommand(speechResult);
      };

      recognitionRef.current!.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setLastError(event.error || 'unknown');
        const errorMessages: Record<string, string> = {
          network: "Network error. Please check your internet connection and try again.",
          "not-allowed": "Microphone access denied. Please allow microphone permissions in your browser settings.",
          "no-speech": "No speech detected. Please try speaking again.",
          aborted: "Speech recognition was aborted.",
          "audio-capture": "No microphone was found or microphone is being used by another app.",
        };
        const message = errorMessages[event.error] || `Voice recognition error: ${event.error || 'unknown'}. Try refreshing, check mic permissions, or use the typed command.`;
        error(message);
      };

      recognitionRef.current!.onend = () => {
        setIsListening(false);
      };
    } else {
      error("Speech recognition not supported. Please use Chrome, Edge, or Safari.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [error, processCommand]);

  // Auto-hide the transcript after a short delay so it doesn't persist
  useEffect(() => {
    if (!transcript) return;
    const id = setTimeout(() => setTranscript(''), 3500);
    return () => clearTimeout(id);
  }, [transcript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      error("Voice recognition is not available. Try using Chrome browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
          setLastError(null);
        warning("Listening... Say \"open [page name]\"");
      } catch (err) {
        console.error("Failed to start recognition:", err);
        error("Could not start voice recognition. Please try again.");
      }
    }
  };

  // no typed submit - voice only

  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50 flex flex-col items-end gap-2">
      {transcript && (
        <div className="bg-card text-card-foreground rounded-lg px-4 py-2 shadow-lg border border-border max-w-xs">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
      <div className="flex flex-col items-end gap-2">
      <button
        onClick={toggleListening}
        aria-pressed={isListening}
        className={`h-16 w-16 rounded-full shadow-lg transition-all flex items-center justify-center ${
          isListening
            ? "bg-pink-500 text-white animate-pulse shadow-primary/50"
            : "bg-white/80 dark:bg-gray-800/80 text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-700"
        }`}
      >
        {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
      </button>
      </div>
      {lastError && (
        <div className="mt-2 text-xs text-red-600 max-w-xs bg-red-50 border border-red-100 rounded px-3 py-2">
          <strong>Voice error:</strong> {String(lastError)}
          <div className="mt-1 text-xs text-gray-700">Tips: check microphone permissions, refresh the page, try another browser, or use the typed command.</div>
        </div>
      )}
    </div>
  );
};

export default VoiceControl;
