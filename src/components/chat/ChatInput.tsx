"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

// Pool of example prompts; we filter/extend these based on what the user types.
const SUGGESTION_POOL = [
  "Focus music for coding, no lyrics",
  "Late night drive, moody synthwave",
  "Cyberpunk industrial vibes",
  "Melodic house for a sunset",
  "Sad and quiet like Phoebe Bridgers, but artists I've never heard of",
  "Upbeat indie pop to start the day",
  "Lo-fi hip hop for studying",
  "Energetic gym workout, heavy bass",
  "Chill acoustic for a rainy afternoon",
  "Jazz for a dinner party, nothing abrasive",
  "Dreamy shoegaze, washed-out guitars",
  "90s throwback hits to sing along to",
  "Dark ambient for deep concentration",
  "Feel-good funk and soul",
  "Ease me into jazz from indie folk",
];

const DEFAULT_SUGGESTIONS = [
  "Focus on code",
  "Late night drive",
  "Cyberpunk vibes",
  "Melodic House",
];

function buildSuggestions(input: string): string[] {
  const q = input.trim().toLowerCase();
  if (!q) return DEFAULT_SUGGESTIONS;

  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const matches = SUGGESTION_POOL.filter(
    (s) => s.toLowerCase().includes(q) || words.some((w) => s.toLowerCase().includes(w))
  );

  // Dynamic completions that incorporate what the user typed.
  const dynamic = [
    `${input.trim()}, but lesser-known artists`,
    `${input.trim()} — instrumental only`,
    `More upbeat ${input.trim()}`,
  ];

  const combined = [...matches, ...dynamic];
  // De-duplicate while preserving order, cap at 4.
  return Array.from(new Set(combined)).slice(0, 4);
}

export function ChatInput({ onSubmit, isLoading, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const suggestions = useMemo(() => buildSuggestions(message), [message]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!SpeechRecognitionAPI) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    // continuous=true keeps it listening even if the user pauses
    recognition.continuous = true;
    // interimResults=true shows text live as they speak
    recognition.interimResults = true;

    // Capture the existing message before dictation starts to append to it
    let finalTranscript = message ? message + " " : "";

    recognition.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Show final combined with any partial interim results live
      setMessage(finalTranscript + interimTranscript);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      if (e.error === "no-speech") {
        console.warn("No speech detected.");
      } else {
        console.warn("Speech recognition error:", e.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    const trimmed = message.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter submits; Shift+Enter inserts a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;
    setMessage("");
    onSubmit(text);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="w-full relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={isListening ? "Listening..." : placeholder || "Describe your mood, energy, or activity..."}
          className="w-full min-h-[60px] py-4 pl-6 pr-[120px] bg-brand-sidebar border border-zinc-800/50 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-[color:rgba(var(--accent-rgb),0.5)] text-zinc-100 placeholder:text-zinc-500 disabled:opacity-50 transition-all shadow-lg text-sm"
          rows={1}
          style={{ overflow: "hidden" }}
        />
        <div className="absolute right-2 top-3 flex items-center gap-1">
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${
              isListening
                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            aria-label={isListening ? "Stop listening" : "Start dictation"}
          >
            {isListening ? <StopIcon /> : <MicIcon />}
          </button>

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-[color:var(--accent)] text-black rounded-full font-bold text-sm disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center gap-2 ml-1"
            aria-label="Send message"
          >
            Send
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-3 min-h-[36px]">
        {suggestions.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => handleSuggestionClick(pill)}
            disabled={isLoading}
            className="px-5 py-2 rounded-full border border-zinc-800 bg-[#161918] text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-50 max-w-full truncate"
            title={pill}
          >
            {pill}
          </button>
        ))}
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
