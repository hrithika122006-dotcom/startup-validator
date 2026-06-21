"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import IdeaForm from "@/components/IdeaForm";
import EvaluationResultCard from "@/components/EvaluationResult";
import { EvaluateResponse } from "@/types";

export default function ValidatePage() {
  const [result, setResult] = useState<EvaluateResponse | null>(null);

  function handleResult(data: EvaluateResponse) {
    setResult(data);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Is Your Startup Idea
            <span className="text-blue-600"> Worth Building?</span>
          </h1>
          <p className="text-lg text-gray-500">
            Get an AI-powered evaluation in seconds.
          </p>
        </div>
        <IdeaForm onResult={handleResult} />
        {result && result.data && <EvaluationResultCard result={result.data} />}
      </div>
    </main>
  );
}
