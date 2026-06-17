"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import IdeaForm from "@/components/IdeaForm";
import { EvaluateResponse } from "@/types";

export default function Home() {
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
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✅ Evaluation Complete!
            </h3>
            <pre className="text-sm text-gray-600 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
