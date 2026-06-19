import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { EvaluateResponse, EvaluationResult } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ideaText } = body;

    if (!ideaText || ideaText.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Please type your startup idea first!" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a startup idea evaluator. Evaluate this idea: "${ideaText}"
          
Respond with ONLY these exact lines, no other text:
MARKET_SIZE: [number 1-10]
COMPETITION: [number 1-10]
TECHNICAL: [number 1-10]
BUSINESS: [number 1-10]
SUMMARY: [2 sentences about the idea]
REC1: [recommendation 1]
REC2: [recommendation 2]
REC3: [recommendation 3]
RISK1: [risk 1]
RISK2: [risk 2]
RISK3: [risk 3]`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const aiText = completion.choices[0].message.content || "";
    console.log("AI Response:", aiText);

    // Parse line by line - much more reliable than JSON parsing
    const getValue = (prefix: string) => {
      const line = aiText.split("\n").find((l) => l.startsWith(prefix));
      return line ? line.replace(prefix, "").trim() : "";
    };

    const marketSize = Number(getValue("MARKET_SIZE:")) || 7;
    const competition = Number(getValue("COMPETITION:")) || 6;
    const technical = Number(getValue("TECHNICAL:")) || 7;
    const business = Number(getValue("BUSINESS:")) || 7;
    const overall =
      Math.round(((marketSize + competition + technical + business) / 4) * 10) /
      10;

    const result: EvaluationResult = {
      ideaText,
      scores: {
        marketSize,
        competition,
        technicalFeasibility: technical,
        businessModel: business,
      },
      overallScore: overall,
      summary:
        getValue("SUMMARY:") || "This idea shows potential in the market.",
      recommendations: [
        getValue("REC1:") || "Research your target market thoroughly",
        getValue("REC2:") || "Build an MVP and test with real users",
        getValue("REC3:") || "Focus on a specific niche first",
      ],
      risks: [
        getValue("RISK1:") || "Market competition may be high",
        getValue("RISK2:") || "Funding may be challenging",
        getValue("RISK3:") || "Technical complexity could slow development",
      ],
    };

    const response: EvaluateResponse = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate idea. Please try again." },
      { status: 500 },
    );
  }
}
