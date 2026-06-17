import { NextResponse } from "next/server";

import { EvaluateResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ideaText } = body;

    if (!ideaText) {
      return NextResponse.json(
        { success: false, error: "Idea text is required" },
        { status: 400 }, // 400 = Bad Request
      );
    }

    const fakeResult: EvaluateResponse = {
      success: true,
      data: {
        ideaText: ideaText,
        scores: {
          marketSize: 8,
          competition: 6,
          technicalFeasibility: 7,
          businessModel: 8,
        },
        overallScore: 7.25,
        summary: "This is a promising idea with strong market potential.",
        recommendations: [
          "Start with a small pilot in one region",
          "Partner with agricultural universities",
          "Focus on mobile-first design for rural users",
        ],
        risks: [
          "Internet connectivity in rural areas",
          "High competition from established AgriTech companies",
        ],
      },
    };

    return NextResponse.json(fakeResult);
    // Send the response back to the frontend
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }, // 500 = Server Error
    );
  }
}
