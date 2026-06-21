"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

// Shape of each saved idea coming from Supabase
interface SavedIdea {
  id: string;
  idea_text: string;
  market_size: number;
  competition: number;
  technical_feasibility: number;
  business_model: number;
  overall_score: number;
  summary: string;
  recommendations: string[];
  risks: string[];
  created_at: string;
}

export default function HistoryPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect runs automatically when the page loads
  async function fetchIdeas() {
    try {
      const response = await fetch("/api/my-ideas");
      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to load ideas");
        setIsLoading(false);
        return;
      }

      setIdeas(data.data);
    } catch {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      await fetchIdeas();
    }
    loadData();
  }, []);
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Saved Ideas
        </h1>

        {isLoading && <p className="text-gray-500">Loading your ideas...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && ideas.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-500">
              You haven&apos;t saved any ideas yet.
            </p>
            <a
              href="/validate"
              className="text-blue-600 font-medium mt-2 inline-block"
            >
              Validate your first idea →
            </a>
          </div>
        )}

        <div className="space-y-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <p className="text-gray-800 font-medium flex-1">
                  {idea.idea_text}
                </p>
                <div className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-sm ml-4">
                  {idea.overall_score}/10
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-3">{idea.summary}</p>

              <div className="flex gap-4 text-xs text-gray-400">
                <span>📈 Market: {idea.market_size}</span>
                <span>⚔️ Competition: {idea.competition}</span>
                <span>⚙️ Technical: {idea.technical_feasibility}</span>
                <span>💰 Business: {idea.business_model}</span>
              </div>

              <p className="text-gray-400 text-xs mt-3">
                Saved on {new Date(idea.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
