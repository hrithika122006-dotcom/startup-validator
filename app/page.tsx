"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import IdeaForm from "@/components/IdeaForm";
import EvaluationResultCard from "@/components/EvaluationResult";
import { EvaluateResponse } from "@/types";

export default function Home() {
  const [result, setResult] = useState<EvaluateResponse | null>(null);

  function handleResult(data: EvaluateResponse) {
    setResult(data);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#08130d] via-[#10281d] to-[#1a3d2c]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            Is Your Startup Idea
            <span className="text-emerald-400"> Worth Building?</span>
          </h1>

          <p className="text-lg text-green-200">
            Get an AI-powered evaluation in seconds.
          </p>
        </div>

        <IdeaForm onResult={handleResult} />

        {result && result.data && <EvaluationResultCard result={result.data} />}
      </div>
    </main>
  );
}
