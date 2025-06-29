/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { script, voice = 'alloy' } = await request.json();

    if (!script) {
      return NextResponse.json(
        { error: "Script is required" },
        { status: 400 }
      );
    }

    // Clean script for audio generation (remove animation cues)
    const cleanScript = cleanScriptForAudio(script);

    // Generate audio using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as any,
      input: cleanScript,
      speed: 1.0,
    });

    // Convert to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Create a data URL for the audio
    const audioBase64 = buffer.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

    return NextResponse.json({
      success: true,
      audioUrl,
      cleanScript,
      voice,
    });

  } catch (error) {
    console.error("Audio generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}

function cleanScriptForAudio(script: string): string {
  // Remove animation cues and timing markers
  let cleaned = script;

  // Remove [ANIMATION: ...] cues
  cleaned = cleaned.replace(/\[ANIMATION:.*?\]/gi, '');

  // Remove timing markers like [0-10s]
  cleaned = cleaned.replace(/\[\d+-\d+s\]/gi, '');

  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Add natural pauses for better speech
  cleaned = cleaned.replace(/\./g, '. ');
  cleaned = cleaned.replace(/,/g, ', ');
  cleaned = cleaned.replace(/:/g, ': ');

  return cleaned;
}
