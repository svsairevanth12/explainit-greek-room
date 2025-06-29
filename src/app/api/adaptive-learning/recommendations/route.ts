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

    // Get personalized recommendations
    const recommendations = await AdaptiveLearningService.getPersonalizedRecommendations(userId);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Adaptive learning recommendations error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { subject, topic, difficulty, performance, timeSpent, attempts, correctAnswers, totalQuestions } = await request.json();

    // Validate required fields
    if (!subject || !topic || !difficulty || performance === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: subject, topic, difficulty, performance" },
        { status: 400 }
      );
    }

    // Calculate learning metrics
    const learningVelocity = AdaptiveLearningService.calculateLearningVelocity(timeSpent || 0, totalQuestions || 1);
    const retentionRate = await AdaptiveLearningService.calculateRetentionRate(userId, subject, topic);

    // Track learning activity
    const analytics = await AdaptiveLearningService.trackLearningActivity({
      userId,
      subject,
      topic,
      difficulty,
      performance,
      timeSpent: timeSpent || 0,
      attempts: attempts || 1,
      correctAnswers: correctAnswers || 0,
      totalQuestions: totalQuestions || 1,
      learningVelocity,
      retentionRate,
    });

    // Get updated recommendations
    const recommendations = await AdaptiveLearningService.getPersonalizedRecommendations(userId);

    return NextResponse.json({
      success: true,
      analytics,
      recommendations,
    });
  } catch (error) {
    console.error("Adaptive learning tracking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
