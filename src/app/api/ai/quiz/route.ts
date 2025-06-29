import { NextRequest, NextResponse } from "next/server";
import OpenAIService from "@/lib/openai";
import { SupabaseService } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { topic, subject, difficulty, questionCount = 5, userId, grade } = await request.json();

    // Validate required fields
    if (!topic || !subject || !difficulty) {
      return NextResponse.json(
        { message: "Missing required fields: topic, subject, difficulty" },
        { status: 400 }
      );
    }

    // Generate quiz using OpenAI
    const questions = await OpenAIService.generateQuiz({
      topic,
      subject,
      difficulty,
      questionCount: Math.min(questionCount, 10), // Limit to 10 questions max
      grade,
    });

    // Save quiz to database if userId is provided
    let quizId = null;
    if (userId) {
      try {
        const quiz = await SupabaseService.createQuiz({
          title: `${subject} - ${topic} Quiz`,
          subject,
          description: `AI-generated quiz on ${topic}`,
          difficulty,
          time_limit: questionCount * 2, // 2 minutes per question
          questions: questions,
        });
        quizId = quiz.id;
      } catch (dbError) {
        console.error("Database save error:", dbError);
        // Continue even if DB save fails
      }
    }

    return NextResponse.json({
      quizId,
      questions,
      metadata: {
        topic,
        subject,
        difficulty,
        questionCount: questions.length,
        estimatedTime: questions.length * 2, // minutes
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("AI quiz generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
