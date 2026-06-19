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
    if (ideaText.trim() === "") {
      setError("Please type your startup idea first!");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      <div className="bg-[#10281d] border border-green-900 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Validate Your Startup Idea
        </h2>

        <p className="text-green-200 mb-6">
          Describe your idea and get an AI-powered business evaluation
        </p>

        <textarea
          className="
            w-full
            bg-[#08130d]
            border border-green-900
            rounded-xl
            p-4
            text-green-100
            placeholder:text-green-500
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
            focus:border-emerald-500
            transition-all
          "
          rows={6}
          placeholder="Example: An AI-powered platform that helps farmers detect crop diseases using smartphone photos..."
          value={ideaText}
          onChange={(e) => setIdeaText(e.target.value)}
          disabled={isLoading}
        />

        <p className="text-sm text-green-400 mt-2 text-right">
          {ideaText.length} characters
        </p>

        {error && (
          <div
            className="
              bg-red-950
              border
              border-red-800
              text-red-300
              rounded-lg
              p-3
              mt-3
              text-sm
            "
          >
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="
            w-full
            mt-6
            bg-emerald-600
            hover:bg-emerald-500
            disabled:bg-emerald-800
            text-white
            font-semibold
            py-3
            px-6
            rounded-xl
            transition-all
            duration-200
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
          "
        >
          {isLoading ? (
            <>
              <div
                className="
                  w-5
                  h-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              />
              Analyzing Your Idea...
            </>
          ) : (
            <> Validate My Idea</>
          )}
        </button>
      </div>
    </div>
  );
}
