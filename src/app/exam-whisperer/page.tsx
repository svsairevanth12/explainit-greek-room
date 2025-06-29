"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Send,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  RotateCcw,
  Brain,
  Lightbulb,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const subjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Economics",
];

const difficulties = [
  { value: "easy", label: "Easy", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "hard", label: "Hard", color: "bg-red-500" },
];

// Interface for quiz questions
interface QuizQuestion {
  id?: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function ExamWhispererPage() {
  const [activeTab, setActiveTab] = React.useState("ask");
  const [question, setQuestion] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [conversation, setConversation] = React.useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = React.useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = React.useState(false);
  const [recentSessions, setRecentSessions] = React.useState<any[]>([]);
  const [subjectPerformance, setSubjectPerformance] = React.useState<any[]>([]);

  // Load recent exam sessions and subject performance on component mount
  React.useEffect(() => {
    loadRecentSessions();
    loadSubjectPerformance();
  }, []);

  const loadRecentSessions = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        if (data.user && data.user.recentActivities) {
          const examActivities = data.user.recentActivities.filter(
            (activity: any) => activity.type === "exam"
          );
          setRecentSessions(examActivities);
        }
      }
    } catch (error) {
      console.error("Error loading recent sessions:", error);
    }
  };

  const loadSubjectPerformance = async () => {
    try {
      const response = await fetch("/api/subject-performance");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.performance) {
          setSubjectPerformance(data.performance);
        }
      }
    } catch (error) {
      console.error("Error loading subject performance:", error);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !subject) return;

    setIsLoading(true);

    // Add user question to conversation
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: question,
      subject,
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, userMessage]);

    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem("user");
      const userId = userData ? JSON.parse(userData).id : null;

      // Call OpenAI API for explanation
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          subject,
          difficulty: difficulty || "medium",
          userId,
          grade: "high",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = {
          id: Date.now() + 1,
          type: "ai",
          content: data.explanation,
          subject,
          timestamp: new Date(),
          confidence: 95,
          topic: extractTopicFromQuestion(question),
        };

        setConversation(prev => [...prev, aiResponse]);

        // Track learning activity for adaptive learning
        try {
          await fetch("/api/adaptive-learning/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject,
              topic: extractTopicFromQuestion(question),
              difficulty: difficulty || "medium",
              performance: 85, // Assume good performance for explanations
              timeSpent: 60, // Estimated time spent
              attempts: 1,
              correctAnswers: 1,
              totalQuestions: 1,
            }),
          });
        } catch (adaptiveError) {
          console.log("Adaptive learning tracking failed:", adaptiveError);
        }

        // Reload recent sessions to show the new data
        loadRecentSessions();

        // Show success toast
        toast.success("Question answered successfully!", {
          description: "Your question has been saved to your study history."
        });
      } else {
        throw new Error("Failed to get explanation");
      }
    } catch (error) {
      console.error("Error getting explanation:", error);
      const errorResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: "I apologize, but I'm having trouble generating an explanation right now. Please try again in a moment.",
        subject,
        timestamp: new Date(),
        confidence: 0,
      };
      setConversation(prev => [...prev, errorResponse]);

      // Show error toast
      toast.error("Failed to get explanation", {
        description: "Please check your connection and try again."
      });
    } finally {
      setIsLoading(false);
    }

    setQuestion("");
  };

  const extractTopicFromQuestion = (question: string): string => {
    // Simple topic extraction - in a real app, this could be more sophisticated
    const mathKeywords = ["derivative", "integral", "equation", "algebra", "calculus"];
    const scienceKeywords = ["atom", "molecule", "physics", "chemistry", "biology"];
    const englishKeywords = ["grammar", "literature", "writing", "reading"];

    const lowerQuestion = question.toLowerCase();

    if (mathKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return "Mathematics Concepts";
    } else if (scienceKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return "Science Fundamentals";
    } else if (englishKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return "English Language";
    }

    return "General Knowledge";
  };

  const generateQuizFromConversation = async () => {
    if (conversation.length === 0) return;

    setIsGeneratingQuiz(true);

    try {
      // Get the most recent conversation topics
      const recentTopics = conversation
        .filter(msg => msg.type === "ai" && msg.topic)
        .slice(-3) // Get last 3 AI responses
        .map(msg => msg.topic);

      const mainSubject = conversation[conversation.length - 1]?.subject || "General";
      const topicForQuiz = recentTopics[recentTopics.length - 1] || "General Knowledge";

      // Get user ID from localStorage
      const userData = localStorage.getItem("user");
      const userId = userData ? JSON.parse(userData).id : null;

      const response = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicForQuiz,
          subject: mainSubject,
          difficulty: difficulty || "medium",
          questionCount: 3,
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.questions && Array.isArray(data.questions)) {
          setQuizQuestions(data.questions);
          setSelectedAnswers(new Array(data.questions.length).fill(-1));
          setShowResults(false);
          setCurrentQuestionIndex(0);
          setActiveTab("quiz");

          // Show success toast
          toast.success("Quiz generated successfully!", {
            description: `Created ${data.questions.length} questions based on your conversation.`
          });
        }
      } else {
        throw new Error("Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      // Fallback to a simple quiz
      setQuizQuestions([
        {
          question: "Based on our recent conversation, which concept is most important?",
          options: ["Understanding the fundamentals", "Practicing regularly", "Asking questions", "All of the above"],
          correct: 3,
          explanation: "All aspects are important for effective learning."
        }
      ]);
      setSelectedAnswers([-1]);
      setShowResults(false);
      setCurrentQuestionIndex(0);
      setActiveTab("quiz");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Exam Whisperer</h1>
                <p className="text-muted-foreground">Your AI-powered study companion</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Explanations</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Interactive Quizzes</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ask">Ask Questions</TabsTrigger>
              <TabsTrigger value="quiz">Practice Quiz</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            {/* Ask Questions Tab */}
            <TabsContent value="ask" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Question Input */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Ask Your Question
                      </CardTitle>
                      <CardDescription>
                        Get instant AI-powered explanations for any topic
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subj) => (
                                <SelectItem key={subj} value={subj}>
                                  {subj}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              {difficulties.map((diff) => (
                                <SelectItem key={diff.value} value={diff.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${diff.color}`} />
                                    {diff.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="question">Your Question</Label>
                        <Textarea
                          id="question"
                          placeholder="Ask anything... e.g., 'Explain the concept of derivatives in calculus'"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={handleAskQuestion} 
                        disabled={!question.trim() || !subject || isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Thinking...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Ask Question
                          </>
                        )}
                      </Button>

                      {/* Suggested Questions */}
                      {conversation.length === 0 && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="text-sm font-medium mb-3">Suggested Questions:</h4>
                          <div className="grid gap-2">
                            {[
                              "What is the derivative of x²?",
                              "Explain photosynthesis in simple terms",
                              "How do you solve quadratic equations?",
                              "What is the difference between DNA and RNA?"
                            ].map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                className="justify-start text-left h-auto p-2"
                                onClick={() => setQuestion(suggestion)}
                              >
                                <Lightbulb className="mr-2 h-3 w-3" />
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card className="stats-card">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{conversation.length}</p>
                        <p className="text-sm text-muted-foreground">Questions Asked Today</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="stats-card">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{recentSessions.length > 0 ? Math.round(recentSessions.reduce((acc, session) => acc + session.score, 0) / recentSessions.length) : 0}%</p>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="stats-card">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Lightbulb className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{recentSessions.length}</p>
                        <p className="text-sm text-muted-foreground">Study Sessions</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Conversation History */}
              {conversation.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {conversation.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} conversation-message`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {message.type === "ai" && <Sparkles className="h-4 w-4" />}
                              <span className="text-sm font-medium">
                                {message.type === "user" ? "You" : "AI Tutor"}
                              </span>
                              {message.subject && (
                                <Badge variant="secondary" className="text-xs">
                                  {message.subject}
                                </Badge>
                              )}
                            </div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            {message.confidence && (
                              <div className="mt-2 text-xs opacity-75">
                                Confidence: {message.confidence}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {conversation.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <Button
                          onClick={generateQuizFromConversation}
                          disabled={isGeneratingQuiz}
                          className="w-full"
                          variant="outline"
                        >
                          {isGeneratingQuiz ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                              Generating Quiz...
                            </>
                          ) : (
                            <>
                              <Target className="mr-2 h-4 w-4" />
                              Generate Quiz from Conversation
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Practice Quiz
                  </CardTitle>
                  <CardDescription>
                    Test your understanding with AI-generated questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quizQuestions.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Quiz Available</h3>
                      <p className="text-muted-foreground mb-4">
                        Ask some questions first, then generate a quiz based on your conversation!
                      </p>
                      <Button
                        onClick={() => setActiveTab("ask")}
                        variant="outline"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Start Asking Questions
                      </Button>
                    </div>
                  ) : !showResults ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Question {currentQuestionIndex + 1} of {quizQuestions.length}
                        </h3>
                        <Progress 
                          value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} 
                          className="w-32" 
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-medium">
                          {quizQuestions[currentQuestionIndex]?.question}
                        </h4>
                        <div className="grid gap-3">
                          {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                            <Button
                              key={index}
                              variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                              className={`justify-start text-left h-auto p-4 quiz-option ${
                                selectedAnswers[currentQuestionIndex] === index ? "selected" : ""
                              }`}
                              onClick={() => handleQuizAnswer(currentQuestionIndex, index)}
                            >
                              <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                          disabled={currentQuestionIndex === 0}
                        >
                          Previous
                        </Button>
                        {currentQuestionIndex === quizQuestions.length - 1 ? (
                          <Button onClick={submitQuiz} disabled={selectedAnswers.length !== quizQuestions.length}>
                            Submit Quiz
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                            disabled={selectedAnswers[currentQuestionIndex] === undefined}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="text-6xl font-bold text-primary">
                        {calculateScore()}%
                      </div>
                      <h3 className="text-2xl font-semibold">Quiz Complete!</h3>
                      <p className="text-muted-foreground">
                        You got {selectedAnswers.filter((answer, index) => answer === quizQuestions[index].correct).length} out of {quizQuestions.length} questions correct.
                      </p>
                      
                      <div className="space-y-4 text-left">
                        {quizQuestions.map((question, index) => (
                          <div key={question.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {selectedAnswers[index] === question.correct ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="font-medium">Question {index + 1}</span>
                            </div>
                            <p className="mb-2">{question.question}</p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Correct answer:</strong> {question.options[question.correct]}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <Lightbulb className="h-4 w-4 inline mr-1" />
                              {question.explanation}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Button onClick={() => {
                        setShowResults(false);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswers([]);
                      }}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{conversation.length}</p>
                    <p className="text-sm text-muted-foreground">Questions Asked Today</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{recentSessions.length}</p>
                    <p className="text-sm text-muted-foreground">Recent Sessions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{Math.round(recentSessions.length * 0.5)}h</p>
                    <p className="text-sm text-muted-foreground">Estimated Study Time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Sessions */}
              {recentSessions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Study Sessions</CardTitle>
                    <CardDescription>Your latest learning activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentSessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{session.subject}</p>
                              <p className="text-sm text-muted-foreground">{session.topic}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{session.score}%</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Your progress across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectPerformance.length > 0 ? (
                      subjectPerformance.slice(0, 5).map((subjectData) => (
                        <div key={subjectData.subject} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{subjectData.subject}</span>
                              {subjectData.trend === 'up' && (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              )}
                              {subjectData.trend === 'down' && (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                              {subjectData.trend === 'stable' && (
                                <Minus className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{subjectData.performance}%</span>
                              <p className="text-xs text-muted-foreground">
                                {subjectData.totalActivities} activities
                              </p>
                            </div>
                          </div>
                          <Progress value={subjectData.performance} className="progress-glow" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No subject data yet</p>
                        <p className="text-sm text-muted-foreground">
                          Start asking questions to see your progress!
                        </p>
                      </div>
                    )}
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
