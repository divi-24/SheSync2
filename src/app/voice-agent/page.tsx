/* eslint-disable */

"use client"
import React, { useState, useEffect, useRef } from "react";
import { Mic, PhoneOff, Bot, MessageSquare, Volume2, FileText, MicOff, Download, X } from "lucide-react";
import Vapi from "@vapi-ai/web";

// Avatar – drop any file at src/assets/SheAgent.jpeg
import defaultAvatar from "../../../public/assets/SheAgent.jpeg";

let vapiInstance: Vapi | null = null;

interface TranscriptMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  isFinal: boolean;
  timestamp: number;
}

interface VoiceWaveProps {
  isSpeaking: boolean;
}
const getVapiInstance = () => {
   if (!vapiInstance) {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
      if (!apiKey) {
         console.error("❌ NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set in .env");
         return null;
      }
      try {
         vapiInstance = new Vapi(apiKey);
      } catch (error) {
         console.error("❌ Failed to initialize Vapi:", error);
         return null;
      }
   }
   return vapiInstance;
};

/* ---------- Pure-CSS voice wave ---------- */
const VoiceWave = ({ isSpeaking }: VoiceWaveProps) => {
  if (!isSpeaking) return null;
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-pink-500/60 animate-ping"
          style={{
            animationDuration: `${1.2 + i * 0.3}s`,
            animationDelay: `${i * 0.15}s`,
            transform: `scale(${1 + i * 0.2})`,
          }}
        />
      ))}
    </div>
  );
};
/* ----------------------------------------- */

export default function VoiceAgent() {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("Tap to start speaking with SheSync");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);


  // Unique message id helper
  const messageId = useRef(0);

  useEffect(() => {

    const vapi = getVapiInstance();
    if (!vapi) return; // Exit if Vapi not initialized

    const handleCallStart = () => {
      setIsCalling(true);
      setCallStatus("Listening…");
      setTranscript([]);
    };

    const handleCallEnd = () => {
      setIsCalling(false);
      setCallStatus("Ready to chat again");
      setIsAgentSpeaking(false);
    };

    interface VapiMessage {
      type: string;
      role?: "user" | "assistant";
      transcript?: string;
      transcriptType?: "interim" | "final";
    }

    const handleMessage = (msg: VapiMessage) => {
      if (msg.type === "transcript" && msg.transcript) {
        setIsAgentSpeaking(msg.role === "assistant");

        setTranscript((prev: TranscriptMessage[]) => {
          const next = [...prev];

          // update existing interim line
          const idx = next.findIndex(
            (t) => t.role === msg.role && !t.isFinal
          );
          if (idx !== -1) {
            next[idx] = {
              ...next[idx],
              text: msg.transcript ?? "",
              isFinal: msg.transcriptType === "final",
            };
            return next;
          }

          return [
            ...next,
            {
              id: ++messageId.current,
              role: msg.role as "user" | "assistant",
              text: msg.transcript ?? "",
              isFinal: msg.transcriptType === "final",
              timestamp: Date.now(),
            },
          ];
        });
      }
    };

    const handleError = (error: any) => {
      console.error("❌ Vapi error:", error);
      setCallStatus(`❌ Error: ${String(error).slice(0, 50)}`);
      setIsCalling(false);
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
      vapi.stop();
      // fully reset singleton so Fast-Refresh works
      vapiInstance = null;
    };
  }, []);

  const startCall = async () => {
    const vapi = getVapiInstance();
    if (!vapi) {
      setCallStatus("❌ Vapi not configured. Add NEXT_PUBLIC_VAPI_PUBLIC_KEY to .env");
      return;
    }
    
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setCallStatus("❌ Vapi assistant not configured. Add NEXT_PUBLIC_VAPI_ASSISTANT_ID to .env");
      return;
    }
    
    try {
      setCallStatus("Connecting…");
      await vapi.start(assistantId);
    } catch (error) {
      console.error("❌ Failed to start Vapi call:", error);
      setCallStatus(`❌ Failed to connect: ${String(error).slice(0, 50)}`);
      setIsCalling(false);
    }
  };
  const endCall = () => {
    const vapi = getVapiInstance();
    if (vapi) vapi.stop();
  };
  const toggleTranscript = () => setShowTranscript(!showTranscript);


  return (
    <div className="flex bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen relative">

        {/* Modern Header */}
        <header className="flex items-end justify-end bg-transparent">


          <button
            onClick={toggleTranscript}
            className="p-2 sm:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            aria-label="Toggle transcript"
          >
            <MessageSquare size={18} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </header>

        {/* Central Avatar Section */}
        <section className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 relative">

          {/* Background Decorative Elements
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-pink-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div> */}

          {/* Avatar Container */}
          <div className="relative z-10 mb-8 sm:mb-12">
            <VoiceWave isSpeaking={isAgentSpeaking} />

            {/* Animated Ring */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isAgentSpeaking
                ? 'ring-4 ring-pink-400/50 ring-offset-4 ring-offset-white dark:ring-offset-gray-900 animate-ping'
                : ''
              }`} />

            {/* Main Avatar */}
            <div className={`relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-1 shadow-2xl transition-all duration-300 ${isAgentSpeaking ? "scale-105 shadow-pink-500/25" : "scale-100"
              }`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                <img
                  src={typeof defaultAvatar === "string" ? defaultAvatar : defaultAvatar.src}
                  alt="SheSync AI Assistant"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                    if (img.nextElementSibling) {
                      (img.nextElementSibling as HTMLElement).style.display = "flex";
                    }
                  }}
                />
                {/* Fallback Icon */}
                <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center hidden">
                  <Bot size={60} className="sm:w-20 sm:h-20 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white dark:border-gray-900 shadow-lg transition-all duration-300 ${isCalling ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}>
              <div className={`w-full h-full rounded-full ${isCalling ? 'bg-green-400 animate-ping' : ''
                }`} />
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center mb-8 sm:mb-12 space-y-2">
            <p className={`text-lg sm:text-xl font-semibold transition-all duration-300 ${isAgentSpeaking
                ? 'text-pink-600 dark:text-pink-400 animate-pulse'
                : 'text-gray-600 dark:text-gray-300'
              }`}>
              {callStatus}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              {isCalling
                ? "I'm here to listen and support you. Feel free to share what's on your mind."
                : "Tap the button below to start a voice conversation with your AI companion."
              }
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={isCalling ? endCall : startCall}
            className={`group flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${isCalling
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/25"
                : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-pink-500/25"
              }`}
            aria-label={isCalling ? "End call" : "Start speaking"}
          >
            <div className={`transition-transform duration-200 ${isCalling ? 'group-hover:rotate-12' : 'group-hover:scale-110'
              }`}>
              {isCalling ? <PhoneOff size={20} className="sm:w-6 sm:h-6" /> : <Mic size={20} className="sm:w-6 sm:h-6" />}
            </div>
            <span>{isCalling ? "End Call" : "Start Speaking"}</span>
          </button>

          {/* Quick Actions */}
          {isCalling && (
            <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8 animate-fade-in">
              <button className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Volume2 size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <MicOff size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={toggleTranscript}
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FileText size={18} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          )}
        </section>

        {/* Modern Transcript Panel */}
        <div className={`fixed bottom-0 left-0 right-0 h-80 sm:h-96 backdrop-blur-xl transition-transform duration-500 ease-out bg-white/95 dark:bg-gray-900/95 border-t border-pink-200/50 dark:border-gray-700/50 shadow-2xl ${showTranscript ? "translate-y-0" : "translate-y-full"
          } z-50`}>

          {/* Transcript Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <MessageSquare size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Conversation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {transcript.length} {transcript.length === 1 ? 'message' : 'messages'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <Download size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={toggleTranscript}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Close transcript"
              >
                <X size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Transcript Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-pink-300 dark:scrollbar-thumb-gray-600">
            {transcript.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No conversation yet</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Start speaking to see your conversation history here
                </p>
              </div>
            ) : (
              transcript.map((t) => (
                <div
                  key={t.id}
                  className={`flex ${t.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${t.role === "user"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md"
                    }`}>
                    <div className="flex items-start space-x-2">
                      {t.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot size={12} className="text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm sm:text-base leading-relaxed">{t.text}</p>
                        <p className={`text-xs mt-1 opacity-70 ${t.role === "user" ? "text-pink-100" : "text-gray-500 dark:text-gray-400"
                          }`}>
                          {new Date(t.timestamp || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}