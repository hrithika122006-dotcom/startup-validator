// app/api/evaluate/route.ts
// This is our main API route
// It receives a startup idea, sends it to OpenAI, returns evaluation

import { NextResponse } from "next/server";
import openai from "@/lib/openai";
import { EvaluateResponse, EvaluationResult } from "@/types";

export async function POST(request: Request) {
  try {
    // ─────────────────────────────────────────
    // STEP 1: Get the idea from the request
    // ─────────────────────────────────────────
    const body = await request.json();
    const { ideaText } = body;

    if (!ideaText || ideaText.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: "Idea text must be at least 20 characters" },
        { status: 400 },
      );
    }

    // ─────────────────────────────────────────
    // STEP 2: Build the prompt
    // This is prompt engineering — we tell GPT exactly what to do
    // ─────────────────────────────────────────
    const systemPrompt = `You are an expert startup idea evaluator with 20 years of experience in venture capital, entrepreneurship, and market analysis.

Your job is to evaluate startup ideas and return a structured JSON response.

You MUST respond with ONLY a valid JSON object — no markdown, no explanation, no backticks.
Just pure JSON.

The JSON must follow this exact structure:
{
  "scores": {
    "marketSize": <number 1-10>,
    "competition": <number 1-10>,
    "technicalFeasibility": <number 1-10>,
    "businessModel": <number 1-10>
  },
  "overallScore": <average of all 4 scores, rounded to 1 decimal>,
  "summary": "<2-3 sentence summary of the idea's potential>",
  "recommendations": [
    "<specific actionable recommendation 1>",
    "<specific actionable recommendation 2>",
    "<specific actionable recommendation 3>"
  ],
  "risks": [
    "<specific risk 1>",
    "<specific risk 2>",
    "<specific risk 3>"
  ]
}

Scoring guide:
- marketSize: 10 = trillion dollar market, 1 = tiny niche
- competition: 10 = no competition, 1 = extremely saturated
- technicalFeasibility: 10 = very easy to build, 1 = requires breakthrough technology
- businessModel: 10 = clear path to revenue, 1 = no obvious monetization`;

    const userPrompt = `Please evaluate this startup idea:

"${ideaText}"

Remember: respond with ONLY the JSON object, nothing else.`;

    // ─────────────────────────────────────────
    // STEP 3: Call OpenAI API
    // ─────────────────────────────────────────
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // gpt-4o-mini = fast and cheap, perfect for our use case
      // gpt-4o = more powerful but costs more

      messages: [
        {
          role: "system",
          content: systemPrompt,
          // "system" = instructions/personality for the AI
          // Think of it as: "You are a _____, your job is to _____"
        },
        {
          role: "user",
          content: userPrompt,
          // "user" = the actual request, like a human typing to ChatGPT
        },
      ],

      temperature: 0.7,
      // temperature controls creativity vs consistency
      // 0.0 = very consistent, same answer every time
      // 1.0 = very creative, different answer every time
      // 0.7 = good balance for business evaluations

      max_tokens: 1000,
      // Maximum length of response
      // 1000 tokens ≈ 750 words — enough for our evaluation
    });

    // ─────────────────────────────────────────
    // STEP 4: Parse the AI response
    // ─────────────────────────────────────────

    // Get the text content from the response
    const aiResponseText = completion.choices[0].message.content;
    // completion.choices[0] = first (and only) response
    // .message.content = the actual text GPT wrote

    if (!aiResponseText) {
      throw new Error("OpenAI returned empty response");
    }

    // Parse the JSON string into a JavaScript object
    let parsedEvaluation;
    try {
      parsedEvaluation = JSON.parse(aiResponseText);
      // JSON.parse converts: '{"score": 8}' → { score: 8 }
    } catch {
      // If GPT didn't return valid JSON (sometimes it adds extra text)
      // Try to extract JSON from the response
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      // This regex finds anything between { and }

      if (!jsonMatch) {
        throw new Error("Could not parse AI response as JSON");
      }
      parsedEvaluation = JSON.parse(jsonMatch[0]);
    }

    // ─────────────────────────────────────────
    // STEP 5: Build our result object
    // ─────────────────────────────────────────
    const result: EvaluationResult = {
      ideaText: ideaText,
      scores: {
        marketSize: parsedEvaluation.scores.marketSize,
        competition: parsedEvaluation.scores.competition,
        technicalFeasibility: parsedEvaluation.scores.technicalFeasibility,
        businessModel: parsedEvaluation.scores.businessModel,
      },
      overallScore: parsedEvaluation.overallScore,
      summary: parsedEvaluation.summary,
      recommendations: parsedEvaluation.recommendations,
      risks: parsedEvaluation.risks,
    };

    // ─────────────────────────────────────────
    // STEP 6: Return success response
    // ─────────────────────────────────────────
    const response: EvaluateResponse = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    // Log full error for debugging (only visible to us, not users)
    console.error("Evaluation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate idea. Please try again.",
      },
      { status: 500 },
    );
  }
}
