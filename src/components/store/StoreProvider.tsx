"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ChatMessage, Conversation, EnrichedRecommendation, Mood, SavedSong } from "@/types/api";

type View = "chat" | "library";

interface SubmitContext {
  convId: string;
  history: { role: "user" | "assistant"; content: string }[];
  priorTrackKeys: string[];
}

interface StoreValue {
  // navigation
  view: View;
  setView: (v: View) => void;

  // conversations
  conversations: Conversation[];
  activeId: string | null;
  active: Conversation | null;
  startNewChat: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  beginUserTurn: (message: string) => SubmitContext;
  completeAssistantTurn: (
    convId: string,
    summary: string,
    recommendations: EnrichedRecommendation[],
    mood?: Mood
  ) => void;

  // saved songs
  savedSongs: SavedSong[];
  isSaved: (artist: string, track: string) => boolean;
  toggleSave: (song: EnrichedRecommendation) => void;

  // quick-vibe shortcut: queue a prompt to be auto-submitted by the page
  queuedPrompt: string | null;
  queuePrompt: (text: string) => void;
  consumePrompt: () => void;

  // mobile sidebar drawer
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const CONV_KEY = "mb_conversations";
const SAVED_KEY = "mb_saved_songs";

function songKey(artist: string, track: string): string {
  return `${artist.trim().toLowerCase()}|${track.trim().toLowerCase()}`;
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>([]);
  const [queuedPrompt, setQueuedPrompt] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    try {
      const c = localStorage.getItem(CONV_KEY);
      if (c) setConversations(JSON.parse(c));
      const s = localStorage.getItem(SAVED_KEY);
      if (s) setSavedSongs(JSON.parse(s));
    } catch {
      // ignore corrupt storage
    }
    setMounted(true);
  }, []);

  // Persist whenever state changes (after initial mount).
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CONV_KEY, JSON.stringify(conversations));
    } catch {
      /* ignore */
    }
  }, [conversations, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedSongs));
    } catch {
      /* ignore */
    }
  }, [savedSongs, mounted]);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const startNewChat = useCallback(() => {
    setActiveId(null);
    setView("chat");
  }, []);

  const queuePrompt = useCallback((text: string) => {
    setActiveId(null); // start the quick vibe as a fresh conversation
    setView("chat");
    setQueuedPrompt(text);
  }, []);

  const consumePrompt = useCallback(() => setQueuedPrompt(null), []);

  const selectConversation = useCallback((id: string) => {
    setActiveId(id);
    setView("chat");
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setActiveId((cur) => (cur === id ? null : cur));
    },
    []
  );

  // Adds the user message (creating a conversation if needed) and returns the
  // context needed to call the API (history + dedupe keys BEFORE this turn).
  const beginUserTurn = useCallback(
    (message: string): SubmitContext => {
      const userMsg: ChatMessage = { id: newId(), role: "user", content: message };

      if (!activeId || !conversations.some((c) => c.id === activeId)) {
        const conv: Conversation = {
          id: newId(),
          title: message.length > 48 ? message.slice(0, 48) + "…" : message,
          messages: [userMsg],
          priorTrackKeys: [],
          updatedAt: Date.now(),
        };
        setConversations((prev) => [conv, ...prev]);
        setActiveId(conv.id);
        return { convId: conv.id, history: [], priorTrackKeys: [] };
      }

      const current = conversations.find((c) => c.id === activeId)!;
      const history = current.messages.map((m) => ({ role: m.role, content: m.content }));
      const priorTrackKeys = current.priorTrackKeys;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() }
            : c
        )
      );
      return { convId: activeId, history, priorTrackKeys };
    },
    [activeId, conversations]
  );

  const completeAssistantTurn = useCallback(
    (convId: string, summary: string, recommendations: EnrichedRecommendation[], mood?: Mood) => {
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content: summary || "Here are your recommendations.",
        recommendations,
        mood,
      };
      const newKeys = recommendations.map((r) => songKey(r.artist, r.track));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, assistantMsg],
                priorTrackKeys: [...c.priorTrackKeys, ...newKeys],
                mood: mood ?? c.mood,
                updatedAt: Date.now(),
              }
            : c
        )
      );
    },
    []
  );

  const isSaved = useCallback(
    (artist: string, track: string) =>
      savedSongs.some((s) => songKey(s.artist, s.track) === songKey(artist, track)),
    [savedSongs]
  );

  const toggleSave = useCallback((song: EnrichedRecommendation) => {
    setSavedSongs((prev) => {
      const key = songKey(song.artist, song.track);
      if (prev.some((s) => songKey(s.artist, s.track) === key)) {
        return prev.filter((s) => songKey(s.artist, s.track) !== key);
      }
      return [{ ...song, savedAt: Date.now() }, ...prev];
    });
  }, []);

  const value: StoreValue = {
    view,
    setView,
    conversations,
    activeId,
    active,
    startNewChat,
    selectConversation,
    deleteConversation,
    beginUserTurn,
    completeAssistantTurn,
    savedSongs,
    isSaved,
    toggleSave,
    queuedPrompt,
    queuePrompt,
    consumePrompt,
    sidebarOpen,
    setSidebarOpen,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}
