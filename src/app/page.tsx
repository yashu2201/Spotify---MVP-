"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ResultCard } from "@/components/results/ResultCard";
import { ResultCardSkeleton } from "@/components/results/ResultCardSkeleton";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { RefineBar } from "@/components/chat/RefineBar";
import { LibraryView } from "@/components/library/LibraryView";
import { fetchRecommendations } from "@/lib/api/recommend";
import { Header } from "@/components/layout/Header";
import { useStore } from "@/components/store/StoreProvider";
import { applyMoodAccent } from "@/lib/theme/mood";

export default function Home() {
  const { view, active, beginUserTurn, completeAssistantTurn, queuedPrompt, consumePrompt } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = active?.messages ?? [];
  const hasConversation = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const showRefine =
    !isLoading &&
    lastMessage?.role === "assistant" &&
    (lastMessage.recommendations?.length ?? 0) > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  // Re-tint the UI whenever the active conversation's mood changes.
  useEffect(() => {
    applyMoodAccent(active?.mood ?? null);
  }, [active?.mood, active?.id]);

  // Auto-submit a quick-vibe prompt queued from the sidebar.
  useEffect(() => {
    if (queuedPrompt) {
      const prompt = queuedPrompt;
      consumePrompt();
      handleSubmit(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queuedPrompt]);

  const handleSubmit = async (message: string) => {
    setError(null);
    const { convId, history, priorTrackKeys } = beginUserTurn(message);
    setIsLoading(true);
    try {
      const data = await fetchRecommendations({ message, history, priorTrackKeys });
      completeAssistantTurn(
        convId,
        data.assistantSummary || "Here are your recommendations.",
        data.recommendations ?? [],
        data.mood
      );
      if (data.mood) applyMoodAccent(data.mood);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (view === "library") {
    return (
      <main className="min-h-full flex flex-col px-4 sm:px-6 md:px-10 relative mb-mood-glow">
        <div className="relative z-10">
          <Header />
          <LibraryView />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full flex flex-col px-10 relative mb-mood-glow">
      <div className="relative z-10 flex flex-col min-h-full">
        <Header />

        <div className="flex-1 w-full pb-10 pt-2">
          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {!hasConversation && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 pb-20 gap-3">
              <span className="text-5xl mb-2">🎧</span>
              <p className="text-lg text-zinc-300">Describe a mood, vibe, or activity below.</p>
              <p className="text-sm text-zinc-600 max-w-md">
                e.g. &ldquo;sad and quiet like Phoebe Bridgers, but artists I&rsquo;ve never heard of&rdquo;
              </p>
            </div>
          ) : (
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 mt-2">
              {messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="bg-[color:rgba(var(--accent-rgb),0.12)] border border-[color:rgba(var(--accent-rgb),0.25)] text-zinc-100 rounded-2xl rounded-tr-sm px-5 py-3 max-w-[80%] break-words text-sm">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex flex-col gap-4">
                    <p className="text-zinc-400 italic px-1">&ldquo;{m.content}&rdquo;</p>
                    {m.recommendations && m.recommendations.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {m.recommendations.map((rec, i) => (
                          <ResultCard key={`${rec.artist}-${rec.track}-${i}`} recommendation={rec} index={i} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 text-sm px-1">
                        No matching songs were found for this one — try rephrasing.
                      </p>
                    )}
                  </div>
                )
              )}

              {showRefine && <RefineBar onRefine={handleSubmit} disabled={isLoading} />}

              {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ResultCardSkeleton key={i} index={i} />
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-brand-dark z-20 pb-10 pt-6 border-t border-brand-dark shadow-[0_-20px_40px_-15px_rgba(15,17,16,1)]">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
