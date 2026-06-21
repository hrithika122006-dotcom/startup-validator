import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { EvaluationResult } from "@/types";

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to save ideas" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result: EvaluationResult = body.result;

    const { data, error } = await supabase
      .from("evaluations")
      .insert({
        user_id: user.id,
        idea_text: result.ideaText,
        market_size: result.scores.marketSize,
        competition: result.scores.competition,
        technical_feasibility: result.scores.technicalFeasibility,
        business_model: result.scores.businessModel,
        overall_score: result.overallScore,
        summary: result.summary,
        recommendations: result.recommendations,
        risks: result.risks,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase save error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save idea" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
