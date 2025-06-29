"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { RecommendationsPanel } from "@/components/adaptive-learning/recommendations-panel";
import { ClientOnly } from "@/components/ui/client-only";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Globe,
  Phone,
  TrendingUp,
  Clock,
  Award,
  Target,
  Calendar,
  ArrowRight,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Interface for user data
interface UserData {
  id: string;
  name: string;
  role: string;
  grade?: string;
  totalStudyTime: number;
  completedQuizzes: number;
  averageScore: number;
  currentStreak: number;
  recentActivities: any[];
  upcomingGoals: any[];
}

// Fallback user data
const fallbackUserData: UserData = {
  id: "fallback-user",
  name: "Demo Student",
  role: "STUDENT",
  grade: "high",
  totalStudyTime: 0,
  completedQuizzes: 0,
  averageScore: 0,
  currentStreak: 1,
  recentActivities: [],
  upcomingGoals: [
    {
      id: 1,
      title: "Start Learning Journey",
      progress: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

const quickActions = [
  {
    title: "Start Exam Practice",
    description: "Get AI-powered explanations and quizzes",
    icon: BookOpen,
    href: "/exam-whisperer",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Practice Language",
    description: "Improve your conversation skills",
    icon: Globe,
    href: "/language-buddy",
    color: "from-green-500 to-green-600",
  },
  {
    title: "View Progress",
    description: "Check your learning analytics",
    icon: TrendingUp,
    href: "/analytics",
    color: "from-purple-500 to-purple-600",
  },
];

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch dashboard data from API
        try {
          const response = await fetch("/api/dashboard", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("auth-token") || ""}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              setUser(data.user);
              return;
            }
          }
        } catch (apiError) {
          console.log("API fetch failed, trying localStorage...");
        }

        // Fallback to localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Ensure the user object has all required properties
          const completeUser = {
            ...fallbackUserData,
            ...parsedUser,
            recentActivities: parsedUser.recentActivities || fallbackUserData.recentActivities,
            upcomingGoals: parsedUser.upcomingGoals || fallbackUserData.upcomingGoals,
          };
          setUser(completeUser);
        } else {
          // Use fallback data as final fallback
          setUser(fallbackUserData);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data");
        setUser(fallbackUserData); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4">No user data available</p>
            <Button onClick={() => window.location.href = '/signin'}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey? Here's what's happening today.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                    <p className="text-2xl font-bold">{user.totalStudyTime}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quizzes Completed</p>
                    <p className="text-2xl font-bold">{user.completedQuizzes}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold">{user.averageScore}%</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold">{user.currentStreak} days</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Jump into your learning activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickActions.map((action, index) => (
                      <Link key={action.title} href={action.href}>
                        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                          <CardContent className="p-4">
                            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${action.color}`}>
                              <action.icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold mb-1">{action.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {action.description}
                            </p>
                            <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                              Start <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Goals Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Current Goals</CardTitle>
                  <CardDescription>
                    Track your learning objectives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(user?.upcomingGoals || []).map((goal: any) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{goal.title}</h4>
                        <Badge variant="outline">{goal.progress}%</Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Due: {new Date(goal.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {(!user?.upcomingGoals || user.upcomingGoals.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No goals set yet. Create your first learning goal!</p>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4">
                    <Calendar className="mr-2 h-4 w-4" />
                    Set New Goal
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Adaptive Learning Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <ClientOnly fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Loading Recommendations...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            }>
              <RecommendationsPanel />
            </ClientOnly>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest learning sessions and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(user?.recentActivities || []).map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {activity.type === "exam" && <BookOpen className="h-5 w-5 text-blue-500" />}
                          {activity.type === "language" && <Globe className="h-5 w-5 text-green-500" />}
                          {activity.type === "quiz" && <Target className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {activity.subject || activity.language}
                            {activity.topic && ` - ${activity.topic}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {activity.score}%
                      </Badge>
                    </div>
                  ))}
                  {(!user?.recentActivities || user.recentActivities.length === 0) && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No recent activities. Start learning to see your progress here!</p>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
