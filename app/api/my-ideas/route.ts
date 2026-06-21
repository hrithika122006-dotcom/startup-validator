// app/api/my-ideas/route.ts
// Fetches all saved ideas for the CURRENTLY LOGGED IN user only

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    // Check who is logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in" },
        { status: 401 },
      );
    }

    // Fetch ONLY this user's evaluations
    // Row Level Security also enforces this automatically,
    // but we filter explicitly too for clarity
    const { data, error } = await supabase
      .from("evaluations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    // ascending: false = newest ideas show first

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch ideas" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("My ideas error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 },
    );
  }
}
