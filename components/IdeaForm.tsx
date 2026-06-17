"use client";

import { useState } from "react";
import { EvaluateResponse } from "@/types";

interface IdeaFormProps {
  onResult: (result: EvaluateResponse) => void;
}

export default function IdeaForm({ onResult }: IdeaFormProps) {
  const [ideaText, setIdeaText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (ideaText.trim().length < 100) {
      setError("Please describe your idea in at least 20 characters.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaText }),
      });
      const data: EvaluateResponse = await response.json();
      onResult(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Validate Your Startup Idea
        </h2>
        <p className="text-gray-500 mb-6">
          Describe your idea and our AI will evaluate its potential
        </p>
        <textarea
          className="w-full border border-gray-200 rounded-xl p-4 
                     text-gray-700 resize-none focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 transition-all"
          rows={6}
          placeholder="Example: An AI-powered app that helps farmers detect crop diseases..."
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          disabled={isLoading}
        />
        <p className="text-sm text-gray-400 mt-1 text-right">
          {ideaText.length} characters
        </p>
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-600 
                          rounded-lg p-3 mt-3 text-sm"
          >
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 
                     disabled:bg-blue-400 text-white font-semibold 
                     py-3 px-6 rounded-xl transition-all duration-200
                     flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div
                className="w-5 h-5 border-2 border-white 
                              border-t-transparent rounded-full animate-spin"
              />
              Analyzing your idea...
            </>
          ) : (
            <>🚀 Validate My Idea</>
          )}
        </button>
      </div>
    </div>
  );
}
