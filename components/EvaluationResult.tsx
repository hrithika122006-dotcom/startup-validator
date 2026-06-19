"use client";

import { EvaluationResult } from "@/types";

interface Props {
  result: EvaluationResult;
}

export default function EvaluationResultCard({ result }: Props) {
  return (
    <div className="mt-8 space-y-6">
      {/* Overall Score */}
      <div className="bg-[#10281d] border border-green-900 rounded-2xl shadow-xl p-8 text-center">
        <p className="text-green-300 text-sm mb-2">Overall Score</p>

        <div className="text-6xl font-bold text-emerald-400">
          {result.overallScore}
          <span className="text-2xl text-green-200">/10</span>
        </div>

        <p className="text-green-100 mt-4">{result.summary}</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-4">
        <ScoreCard title=" Market Size" score={result.scores.marketSize} />

        <ScoreCard title=" Competition" score={result.scores.competition} />

        <ScoreCard
          title=" Technical"
          score={result.scores.technicalFeasibility}
        />

        <ScoreCard title=" Business" score={result.scores.businessModel} />
      </div>

      {/* Recommendations */}
      <div className="bg-[#10281d] border border-green-900 rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-white mb-4">Recommendations</h3>

        <ul className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="bg-emerald-900 text-emerald-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>

              <p className="text-green-100">{rec}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Risks */}
      <div className="bg-[#10281d] border border-green-900 rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-white mb-4"> Risks</h3>

        <ul className="space-y-3">
          {result.risks.map((risk, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="bg-emerald-900 text-emerald-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>

              <p className="text-green-100">{risk}</p>
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
      ? "text-emerald-400"
      : score >= 5
        ? "text-amber-400"
        : "text-red-400";

  const bg =
    score >= 7 ? "bg-[#143524]" : score >= 5 ? "bg-[#3a3117]" : "bg-[#3b1d1d]";

  const bar =
    score >= 7 ? "bg-emerald-500" : score >= 5 ? "bg-amber-500" : "bg-red-500";

  return (
    <div
      className={`${bg} border border-green-900 rounded-2xl p-6 text-center`}
    >
      <p className="text-green-100 text-sm font-medium mb-2">{title}</p>

      <p className={`text-4xl font-bold ${color}`}>{score}</p>

      <p className="text-green-300 text-xs mt-1">out of 10</p>

      <div className="mt-3 bg-[#08130d] rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full ${bar}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}
