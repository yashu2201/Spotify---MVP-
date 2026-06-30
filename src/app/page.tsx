"use client";

import React, { useState } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ResultsPanel } from "@/components/results/ResultsPanel";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { fetchRecommendations } from "@/lib/api/recommend";
import { EnrichedRecommendation } from "@/types/api";
import { Header } from "@/components/layout/Header";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<EnrichedRecommendation[] | null>(null);
  const [assistantSummary, setAssistantSummary] = useState<string | null>(null);

  const handleSubmit = async (message: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setAssistantSummary(null);

    try {
      const data = await fetchRecommendations(message);
      setResults(data.recommendations);
      setAssistantSummary(data.assistantSummary ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-full flex flex-col px-10 relative">
      <Header />
      
      <div className="flex-1 w-full pb-10 pt-6">
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
        
        {results ? (
          <ResultsPanel 
            recommendations={results} 
            assistantSummary={assistantSummary} 
            isLoading={isLoading} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500 pb-20">
            {isLoading ? "Generating recommendations..." : "Start by typing a prompt below."}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-brand-dark z-20 pb-10 pt-6 border-t border-brand-dark shadow-[0_-20px_40px_-15px_rgba(15,17,16,1)]">
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
}
