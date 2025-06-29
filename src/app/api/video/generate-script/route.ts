/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import OpenAIService from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { topic, duration, style } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Generate script using OpenAI
    const prompt = `Create a clear, engaging ${duration}-second explainer video script about "${topic}".

Style: ${style}
Duration: ${duration} seconds
Target: Educational content for students

Requirements:
- Write ONLY the narration text that will be spoken
- NO animation cues or timing markers in the script
- Use simple, clear language perfect for text-to-speech
- Make it educational and engaging
- Structure as a flowing narrative
- Include natural pauses with periods and commas
- Keep it conversational and easy to understand
- Focus on key concepts and practical examples

Write a clean script that flows naturally when spoken aloud. Do NOT include any [ANIMATION:] tags, timing markers, or visual descriptions. Just write the spoken content.

Example: "Welcome to our exploration of ${topic}. Today we'll discover the fascinating world of this concept and understand how it works in simple terms..."

Make it engaging and perfect for AI voice generation.`;

    const script = await OpenAIService.generateExplanation(prompt, "General", "medium");

    // Clean the script to remove any unwanted formatting
    const cleanScript = cleanGeneratedScript(script);

    return NextResponse.json({
      success: true,
      script: cleanScript,
      topic,
      duration,
      style,
    });

  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}

function cleanGeneratedScript(script: string): string {
  // Remove any animation cues that might have been generated
  let cleaned = script;

  // Remove [ANIMATION: ...] cues
  cleaned = cleaned.replace(/\[ANIMATION:.*?\]/gi, '');

  // Remove timing markers like [0-10s]
  cleaned = cleaned.replace(/\[\d+-\d+s\]/gi, '');

  // Remove markdown formatting
  cleaned = cleaned.replace(/#{1,6}\s*/g, ''); // Remove headers
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1'); // Remove italic
  cleaned = cleaned.replace(/`(.*?)`/g, '$1'); // Remove code
  cleaned = cleaned.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links

  // Clean up extra whitespace and formatting
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Ensure proper sentence structure for TTS
  cleaned = cleaned.replace(/\.\s*/g, '. ');
  cleaned = cleaned.replace(/,\s*/g, ', ');
  cleaned = cleaned.replace(/:\s*/g, ': ');
  cleaned = cleaned.replace(/;\s*/g, '; ');

  // Remove any remaining special characters that might interfere with TTS
  cleaned = cleaned.replace(/[^\w\s.,!?:;()-]/g, '');

  return cleaned;
}
