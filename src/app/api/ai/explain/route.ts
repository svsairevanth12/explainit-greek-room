/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import OpenAIService from "@/lib/openai";
import { SupabaseService } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { question, subject, difficulty, userId, grade } = await request.json();

    // Validate required fields
    if (!question || !subject || !difficulty) {
      return NextResponse.json(
        { message: "Missing required fields: question, subject, difficulty" },
        { status: 400 }
      );
    }

    // Generate explanation using OpenAI
    const explanation = await OpenAIService.generateExplanation({
      question,
      subject,
      difficulty,
      grade,
    });

    // Save to database if userId is provided
    if (userId) {
      try {
        await SupabaseService.createExamSession({
          user_id: userId,
          subject,
          question,
          answer: "AI Generated",
          explanation,
          difficulty,
          is_correct: undefined, // Not applicable for explanations
          time_spent: undefined,
        });
      } catch (dbError) {
        console.error("Database save error:", dbError);
        // Continue even if DB save fails
      }
    }

    return NextResponse.json({
      explanation,
      subject,
      difficulty,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("AI explanation error:", error);
    return NextResponse.json(
      { message: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
