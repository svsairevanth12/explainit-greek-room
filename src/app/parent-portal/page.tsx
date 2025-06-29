"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  Mic,
  MicOff,
  Calendar,
  TrendingUp,
  Clock,
  BookOpen,
  Award,
  Bell,
  Users,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data for parent portal
const mockStudentData = {
  name: "Alex Johnson",
  grade: "10th Grade",
  overallProgress: 87,
  weeklyStudyTime: 12,
  completedAssignments: 8,
  totalAssignments: 10,
  upcomingTests: 3,
  subjects: [
    { name: "Mathematics", progress: 92, grade: "A", trend: "up" },
    { name: "Science", progress: 85, grade: "B+", trend: "up" },
    { name: "English", progress: 78, grade: "B", trend: "stable" },
    { name: "History", progress: 90, grade: "A-", trend: "up" },
    { name: "Spanish", progress: 82, grade: "B+", trend: "down" },
  ],
  recentActivities: [
    {
      id: 1,
      type: "quiz",
      subject: "Mathematics",
      title: "Algebra Quiz",
      score: 95,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      type: "assignment",
      subject: "English",
      title: "Essay on Shakespeare",
      score: null,
      date: "2024-01-18",
      status: "pending",
    },
    {
      id: 3,
      type: "test",
      subject: "Science",
      title: "Chemistry Test",
      score: 88,
      date: "2024-01-14",
      status: "completed",
    },
  ],
  upcomingEvents: [
    {
      id: 1,
      type: "test",
      subject: "Mathematics",
      title: "Calculus Test",
      date: "2024-01-22",
      time: "10:00 AM",
    },
    {
      id: 2,
      type: "meeting",
      title: "Parent-Teacher Conference",
      date: "2024-01-25",
      time: "2:00 PM",
      teacher: "Ms. Smith",
    },
    {
      id: 3,
      type: "assignment",
      subject: "History",
      title: "World War II Project Due",
      date: "2024-01-20",
      time: "11:59 PM",
    },
  ],
};

export default function ParentPortalPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [isListening, setIsListening] = React.useState(false);
  const [voiceAgent, setVoiceAgent] = React.useState<any>(null);
  const [lastVoiceCommand, setLastVoiceCommand] = React.useState("");
  const [subjectPerformance, setSubjectPerformance] = React.useState<any[]>([]);
  const [studentData, setStudentData] = React.useState<any>(null);

  // Initialize AI assistant and load data on component mount
  React.useEffect(() => {
    setVoiceAgent({
      id: "parent-portal-ai",
      name: "Parent Portal AI Assistant",
      ready: true
    });
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // Load dashboard data
      const dashboardResponse = await fetch("/api/dashboard");
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        if (dashboardData.success && dashboardData.user) {
          setStudentData(dashboardData.user);
        }
      }

      // Load subject performance
      const performanceResponse = await fetch("/api/subject-performance");
      if (performanceResponse.ok) {
        const performanceData = await performanceResponse.json();
        if (performanceData.success && performanceData.performance) {
          setSubjectPerformance(performanceData.performance);
        }
      }
    } catch (error) {
      console.error("Error loading student data:", error);
    }
  };

  const startVoiceCommand = () => {
    setIsListening(true);
    console.log("Processing voice command...");

    // Simulate voice command processing
    setTimeout(() => {
      setLastVoiceCommand("Show me Alex's progress in Mathematics");
      setIsListening(false);
    }, 2000);
  };

  const stopVoiceCommand = () => {
    setIsListening(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "overdue":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Parent Portal</h1>
                  <p className="text-muted-foreground">Monitor {mockStudentData.name}'s learning progress</p>
                </div>
              </div>

              {/* Voice Command Button */}
              <div className="flex items-center gap-4">
                {voiceAgent && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Button
                        size="lg"
                        onClick={isListening ? stopVoiceCommand : startVoiceCommand}
                        className={`${isListening ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"} transition-all duration-300`}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="mr-2 h-5 w-5" />
                            Stop Listening
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-5 w-5" />
                            Voice Command
                          </>
                        )}
                      </Button>
                      <div className="text-sm">
                        <div className="font-medium">Voice Assistant</div>
                        <div className="text-muted-foreground">
                          {isListening ? "Listening..." : "Ready for commands"}
                        </div>
                      </div>
                    </div>
                    {lastVoiceCommand && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last: "{lastVoiceCommand}"
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
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
                    <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                    <p className="text-2xl font-bold">{studentData?.averageScore || 0}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weekly Study Time</p>
                    <p className="text-2xl font-bold">{studentData?.totalStudyTime || 0}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Quizzes</p>
                    <p className="text-2xl font-bold">
                      {studentData?.completedQuizzes || 0}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Tests</p>
                    <p className="text-2xl font-bold">{mockStudentData.upcomingTests}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest assignments and test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockStudentData.recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              {activity.type === "quiz" && <BarChart3 className="h-5 w-5 text-blue-500" />}
                              {activity.type === "assignment" && <BookOpen className="h-5 w-5 text-green-500" />}
                              {activity.type === "test" && <Award className="h-5 w-5 text-purple-500" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {activity.subject} • {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {activity.score ? (
                              <Badge variant="secondary">{activity.score}%</Badge>
                            ) : (
                              <Badge className={getStatusColor(activity.status)}>
                                {activity.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Tests, assignments, and meetings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockStudentData.upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            {event.type === "test" && <Award className="h-5 w-5 text-orange-500" />}
                            {event.type === "meeting" && <Users className="h-5 w-5 text-orange-500" />}
                            {event.type === "assignment" && <BookOpen className="h-5 w-5 text-orange-500" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                              {event.teacher && ` • ${event.teacher}`}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Detailed progress across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {subjectPerformance.length > 0 ? (
                      subjectPerformance.map((subject) => (
                        <div key={subject.subject} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">{subject.subject}</h3>
                              {getTrendIcon(subject.trend)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {subject.performance >= 90 ? 'A' :
                                 subject.performance >= 80 ? 'B' :
                                 subject.performance >= 70 ? 'C' :
                                 subject.performance >= 60 ? 'D' : 'F'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{subject.performance}%</span>
                            </div>
                          </div>
                          <Progress value={subject.performance} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {subject.totalActivities} learning activities completed
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No subject data available yet</p>
                        <p className="text-sm text-muted-foreground">
                          Student needs to start learning activities to see progress
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>Study sessions and important dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Schedule View</h3>
                    <p className="text-muted-foreground">
                      Interactive calendar view coming soon. Use voice commands to ask about upcoming events.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Parent-Teacher Meetings</CardTitle>
                  <CardDescription>Schedule and manage meetings with teachers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule New Meeting
                    </Button>
                    
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Meeting Management</h3>
                      <p className="text-muted-foreground">
                        Use voice commands to schedule meetings: "Schedule a meeting with the math teacher"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
