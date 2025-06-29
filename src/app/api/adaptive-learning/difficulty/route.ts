import { NextRequest, NextResponse } from "next/server";
import { AdaptiveLearningService } from "@/lib/adaptive-learning";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("auth-token")?.value;

    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret") as any;
        userId = decoded.userId;
      } catch (error) {
        console.log("Token verification failed");
      }
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const topic = searchParams.get('topic');

    if (!subject || !topic) {
      return NextResponse.json(
        { message: "Missing required parameters: subject, topic" },
        { status: 400 }
      );
    }

    // Get difficulty recommendation
    const recommendedDifficulty = await AdaptiveLearningService.getDifficultyRecommendation(userId, subject, topic);

    return NextResponse.json({
      success: true,
      recommendedDifficulty,
      subject,
      topic,
    });
  } catch (error) {
    console.error("Difficulty recommendation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
