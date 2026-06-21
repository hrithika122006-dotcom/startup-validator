"use client";

import { useState } from "react";
import { EvaluationResult } from "@/types";

interface Props {
  result: EvaluationResult;
}

export default function EvaluationResultCard({ result }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function handleSave() {
    setIsSaving(true);
    setSaveError("");

    try {
      const response = await fetch("/api/save-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      const data = await response.json();

      if (!data.success) {
        setSaveError(data.error || "Failed to save");
        setIsSaving(false);
        return;
      }

      setIsSaved(true);
    } catch {
      setSaveError("Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-500 text-sm mb-2">Overall Score</p>
        <div className="text-6xl font-bold text-blue-600">
          {result.overallScore}
          <span className="text-2xl text-gray-400">/10</span>
        </div>
        <p className="text-gray-600 mt-4">{result.summary}</p>

        <div className="mt-6">
          {isSaved ? (
            <p className="text-green-600 font-medium">✅ Idea Saved!</p>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:bg-blue-400"
            >
              {isSaving ? "Saving..." : "Save This Idea"}
            </button>
          )}
          {saveError && (
            <p className="text-red-500 text-sm mt-2">{saveError}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ScoreCard title="📈 Market Size" score={result.scores.marketSize} />
        <ScoreCard title="⚔️ Competition" score={result.scores.competition} />
        <ScoreCard
          title="⚙️ Technical"
          score={result.scores.technicalFeasibility}
        />
        <ScoreCard title="💰 Business" score={result.scores.businessModel} />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          ✅ Recommendations
        </h3>
        <ul className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-gray-600">{rec}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Risks</h3>
        <ul className="space-y-3">
          {result.risks.map((risk, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <p className="text-gray-600">{risk}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScoreCard({ title, score }: { title: string; score: number }) {
  const color =
    score >= 7
      ? "text-green-600"
      : score >= 5
        ? "text-yellow-600"
        : "text-red-600";
  const bg =
    score >= 7 ? "bg-green-50" : score >= 5 ? "bg-yellow-50" : "bg-red-50";
  const bar =
    score >= 7 ? "bg-green-500" : score >= 5 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className={`${bg} rounded-2xl p-6 text-center`}>
      <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
      <p className={`text-4xl font-bold ${color}`}>{score}</p>
      <p className="text-gray-400 text-xs mt-1">out of 10</p>
      <div className="mt-3 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${bar}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}
