/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { SupabaseService } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // Get user from token (in a real app, you'd have proper auth middleware)
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

    // If no valid token, try to get the demo student user
    if (!userId) {
      try {
        const demoUser = await SupabaseService.getUserByEmail("student@demo.com");
        if (demoUser) {
          userId = demoUser.id;
        }
      } catch (error) {
        console.log("Could not find demo user");
      }
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Get subject performance data
    try {
      const performance = await SupabaseService.getSubjectPerformance(userId);
      
      return NextResponse.json({
        success: true,
        performance,
      });
    } catch (error) {
      console.log("Error fetching subject performance:", error);
      
      // Return fallback data if database fails
      return NextResponse.json({
        success: true,
        performance: [
          { subject: "Mathematics", performance: 0, totalActivities: 0, trend: "stable" },
          { subject: "Science", performance: 0, totalActivities: 0, trend: "stable" },
          { subject: "English", performance: 0, totalActivities: 0, trend: "stable" },
        ],
      });
    }
  } catch (error) {
    console.error("Subject performance API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
