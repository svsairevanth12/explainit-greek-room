/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import OpenAIService from "@/lib/openai";
import { SupabaseService } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { language, level, topic, userId } = await request.json();

    // Validate required fields
    if (!language || !level || !topic) {
      return NextResponse.json(
        { message: "Missing required fields: language, level, topic" },
        { status: 400 }
      );
    }

    // Generate language content using OpenAI
    const content = await OpenAIService.generateLanguageContent(language, level, topic);

    // Save language session to database if userId is provided
    if (userId) {
      try {
        await SupabaseService.createLanguageSession({
          user_id: userId,
          language,
          conversation_type: "lesson",
          topic,
          transcript: content.dialogue || [],
          feedback: {
            vocabulary: content.vocabulary,
            grammar: content.grammar,
            cultural: content.cultural,
          },
          duration: null, // Will be updated when session completes
        });
      } catch (dbError) {
        console.error("Database save error:", dbError);
        // Continue even if DB save fails
      }
    }

    return NextResponse.json({
      content,
      metadata: {
        language,
        level,
        topic,
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("Language content generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate language content" },
      { status: 500 }
    );
  }
}
