/* eslint-disable */
"use client"
import * as React from "react";
import { useState, useRef, useEffect } from "react";

import {
  Send,
  Trash2,
  Bot,
  MessageSquare,
  HeartPulse,
  Paperclip,
  Smile,
  Volume2,
  VolumeX,
  HelpCircle,
  BookOpen,
} from "lucide-react";
// import SideBar from "./SideBar";
// import useScreenSize from "../../hooks/useScreenSize";

const TAB_CHOICES = [
  {
    title: "Health & Wellness",
    desc: "Physical and mental wellbeing support",
    icon: <HeartPulse className="text-pink-500 hover:text-pink-600" size={28} />,
    key: "health",
    intro:
      "You're in the Health & Wellness tab. Feel free to ask about periods, cycle tracking, body changes, or mental health.",
  },
  {
    title: "Supportive Chat",
    desc: "Friendly conversations and emotional support",
    icon: <MessageSquare className="text-purple-500 hover:text-purple-600" size={28} />,
    key: "support",
    intro:
      "You're in Supportive Chat. Need to talk, vent, or share how you feel? I'm here for emotional support.",
  },
  {
    title: "Learning & Growth",
    desc: "Educational support and personal development",
    icon: <BookOpen className="text-indigo-500 hover:text-indigo-600" size={28} />,
    key: "learning",
    intro:
      "You're in Learning & Growth. Ask about personal development, study tips, or learning about your body and mind.",
  },
];

const popularEmojis = [
  "😊", "😂", "❤️", "😍", "🥰", "😭", "😘", "🥺", "✨", "😅",
  "🙏", "🔥", "😊", "💕", "😌", "💜", "😩", "😤", "🥳", "💪",
];

interface TabChoice {
  title: string;
  desc: string;
  icon: React.ReactNode;
  key: string;
  intro: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getTabByKey(key: string | null): TabChoice | undefined {
  return TAB_CHOICES.find((t) => t.key === key);
}

export default function Chatbot() {
  const [selectedTab, setSelectedTab] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTab = sessionStorage.getItem("shesync_selectedTab");
      return storedTab ? storedTab : null;
    }
    return null;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("shesync_messages");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("shesync_username");
      return stored ? stored : "";
    }
    return "";
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- Sync state to sessionStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("shesync_selectedTab", selectedTab || "");
    }
  }, [selectedTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("shesync_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("shesync_username", userName || "");
    }
  }, [userName]);

  // --- Scroll to bottom on new messages ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Always focus input ---
  useEffect(() => {
    inputRef.current?.focus();
  }, [isTyping, messages, selectedTab]);

  // --- Restore state on mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = sessionStorage.getItem("shesync_selectedTab");
      const storedMsgs = sessionStorage.getItem("shesync_messages");
      const storedName = sessionStorage.getItem("shesync_username");
      if (storedTab) setSelectedTab(storedTab);
      if (storedMsgs) setMessages(JSON.parse(storedMsgs));
      if (storedName) setUserName(storedName);
    }
  }, []);

  // --- Helpers & Interfaces ---
  interface HandleTabSelectFn {
    (key: string): void;
  }
  interface AssistantMessage {
    role: "assistant";
    content: string;
  }

  const handleTabSelect: HandleTabSelectFn = (key) => {
    const tab = getTabByKey(key);
    const introMessage: AssistantMessage = {
      role: "assistant",
      content: tab?.intro ?? "",
    };
    setSelectedTab(key);
    setMessages([introMessage]);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("shesync_selectedTab", key);
      sessionStorage.setItem("shesync_messages", JSON.stringify([introMessage]));
    }
  };

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsTyping(true);

    // Update userName if "my name is"
    let updatedName = userName;
    if (!userName) {
      const match = userText.match(/my name is\s+([A-Za-z]{2,20})/i);
      if (match) updatedName = match[1];
    }

    const tab = getTabByKey(selectedTab);
    const lastMsgs = [
      ...(messages.length > 0 ? messages : [{ role: "assistant", content: tab?.intro || "" }]),
      { role: "user", content: userText },
    ].slice(-6);

    const systemPrompt = `
You are Eve, a warm, concise, and friendly AI assistant for the SheSync platform...
Recent conversation:
${lastMsgs.map((m) => `${m.role === "user" ? "User" : "Eve"}: ${m.content}`).join("\n")}
Eve:`;

    try {
       const response = await fetch("/ai-gemini", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ prompt: systemPrompt }),
       });

       if (!response.ok) {
         throw new Error(`API error: ${response.statusText}`);
       }

       const data = await response.json();
       let text = (data.text || "").trim();
       if (updatedName && text) {
         text = text.replace(new RegExp(`^(Hi,?\\s+)?(${updatedName}[,:\\s-]+)`, "i"), "");
       }
       setMessages((prev) => [...prev, { role: "assistant", content: text }]);
       setUserName(updatedName);
     } catch {
       setMessages((prev) => [
         ...prev,
         { role: "assistant", content: "Sorry, I couldn't generate a response. Please try again." },
       ]);
     } finally {
       setIsTyping(false);
       setTimeout(() => inputRef.current?.focus(), 50);
     }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSelectedTab(null);
    setUserName("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("shesync_messages");
      sessionStorage.removeItem("shesync_selectedTab");
      sessionStorage.removeItem("shesync_username");
    }
  };

  const speakMessage = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);
  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMessages((prev) => [...prev, { role: "user", content: `Uploaded file: ${file.name}` }]);
    }
  };

  const formatMessage = (text: string) =>
    text.split("**").map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="text-pink-600 dark:text-pink-400">
          {part}
        </strong>
      ) : (
        part
      )
    );



return (
  <div className="relative bg-pink-50 dark:bg-gray-900">
    {/* Chat Content - Full screen with padding for fixed input */}
    <div className="flex flex-col w-full h-full pb-20 sm:pb-24 relative">
      
      {/* Chat Header - Minimal Header with Actions Only */}
      <div className="absolute top-0 right-0 flex items-center justify-end px-3 sm:px-4 lg:px-6  bg-transparent ">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={clearChat} 
            className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all duration-200" 
            aria-label="Clear chat"
          >
            <Trash2 size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() =>
              alert("This chatbot provides support and information for young women aged 13-20.")
            }
            className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all duration-200"
            aria-label="Help"
          >
            <HelpCircle size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-4 bg-pink-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-pink-300 dark:scrollbar-thumb-gray-600">
        {!selectedTab && (
          <div className="flex flex-col items-center justify-center min-h-full w-full max-w-4xl mx-auto px-2 sm:px-4 py-8 sm:py-12">
            {/* Welcome Section */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-xl animate-pulse"></div>
              <Bot
                size={70}
                className="relative text-pink-400 hover:text-pink-500 dark:text-pink-300 hover:scale-110 transition-all duration-300 drop-shadow-2xl sm:w-[90px] sm:h-[90px]"
              />
            </div>
            
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                Hey there! 👋
              </h3>
              <p className="text-gray-700 dark:text-gray-300 max-w-xs sm:max-w-md lg:max-w-xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed px-4">
                I'm your SheSync AI companion, here to chat about anything on your mind.
                Whether it's school, relationships, health, or just life in general - let's talk!
              </p>
            </div>
            
            {/* Tab Choices Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full max-w-4xl">
              {TAB_CHOICES.map((tab) => (
                <div
                  key={tab.key}
                  className="group p-4 sm:p-6 bg-gradient-to-br from-pink-300 to-pink-400 dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-pink-200/50 hover:bg-gradient-to-br hover:from-pink-100 hover:to-pink-200 dark:hover:from-gray-700/95 dark:hover:to-gray-600/95 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg relative overflow-hidden cursor-pointer"
                  onClick={() => handleTabSelect(tab.key)}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="mb-3 sm:mb-4 p-1.5 sm:p-2 bg-white/40 dark:bg-pink-900/30 rounded-lg sm:rounded-xl w-fit">
                      {tab.icon}
                    </div>
                    <p className="font-semibold text-sm sm:text-base text-black dark:text-gray-200 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors duration-300">
                      {tab.title}
                    </p>
                    <p className="text-xs sm:text-sm text-black dark:text-gray-400 mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {tab.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Background Blur Effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message: Message, index: number) => (
          <div 
            key={index} 
            className={`flex mb-4 sm:mb-6 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 dark:from-pink-600 dark:to-pink-700 flex items-center justify-center text-white mr-2 sm:mr-3 text-xs sm:text-sm font-semibold shadow-lg">
          AI
              </div>
            )}
            
            <div className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl leading-relaxed shadow-md ${
              message.role === 'user' 
          ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-br-sm' 
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-pink-200 dark:border-gray-600 rounded-bl-sm'
            }`}>
              <div className="text-sm sm:text-base">
          {formatMessage(message.content)}
              </div>
              
              {message.role === "assistant" && (
          <div className="mt-2 sm:mt-3 flex justify-end">
            <button
              onClick={() =>
                isSpeaking
            ? stopSpeaking()
            : speakMessage(message.content)
              }
              className="flex items-center space-x-1 bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-colors duration-200 shadow-sm"
            >
              {isSpeaking ? <VolumeX size={12} className="sm:w-3.5 sm:h-3.5" /> : <Volume2 size={12} className="sm:w-3.5 sm:h-3.5" />}
              <span>{isSpeaking ? "Stop" : "Read"}</span>
            </button>
          </div>
              )}
            </div>
            
            {message.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-600 to-pink-700 dark:from-pink-700 dark:to-pink-800 flex items-center justify-center text-white ml-2 sm:ml-3 text-xs sm:text-sm font-semibold shadow-lg">
          U
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 dark:from-pink-600 dark:to-pink-700 flex items-center justify-center text-white shadow-lg">
              <Bot size={14} className="sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium">SheSync AI is thinking</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
        
        {/* Space for fixed input - ensures content doesn't get hidden */}
        <div className="h-4 sm:h-6" />
        <div ref={messagesEndRef} />
      </div>
    </div>

    {/* Fixed Floating Input Container */}
    <div className="fixed bottom-0 left-0 right-0  p-3 sm:p-4 lg:p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-pink-200/70 dark:border-gray-600/70 shadow-2xl z-50">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-3 max-w-5xl mx-auto">
        {/* Input Field */}
        <div className="flex-1 relative">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
            placeholder={
              selectedTab
                ? "Type your message..."
                : "Please select a tab above to start the conversation."
            }
            className="w-full p-3 sm:p-4 pr-4 rounded-xl sm:rounded-2xl border-2 border-pink-200/80 dark:border-gray-600/80 bg-pink-50/90 dark:bg-gray-700/90 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/80 focus:border-pink-400/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base backdrop-blur-sm"
          />
        </div>
        
        {/* File Upload */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
        />
        
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          <Paperclip size={16} className="sm:w-5 sm:h-5" />
        </label>
        
        {/* Emoji Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            aria-label="Add emoji"
          >
            <Smile size={16} className="sm:w-5 sm:h-5" />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-14 sm:bottom-16 right-0 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl sm:rounded-2xl border-2 border-pink-200/70 dark:border-gray-600/70 shadow-2xl z-50">
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {popularEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="text-lg sm:text-xl hover:bg-pink-100/80 dark:hover:bg-gray-700/80 rounded-lg p-1.5 sm:p-2 transition-colors duration-200 backdrop-blur-sm"
                    tabIndex={-1}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Send Button */}
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
          aria-label="Send message"
          disabled={isTyping || !input.trim()}
        >
          <Send size={16} className="sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  </div>
);
}

