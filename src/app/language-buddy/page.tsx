"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Star,
  TrendingUp,
  Clock,
  MessageSquare,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

const levels = [
  { value: "beginner", label: "Beginner", color: "bg-green-500" },
  { value: "intermediate", label: "Intermediate", color: "bg-yellow-500" },
  { value: "advanced", label: "Advanced", color: "bg-red-500" },
];

const topics = [
  "Greetings & Introductions",
  "Food & Dining",
  "Travel & Transportation",
  "Shopping & Money",
  "Work & Business",
  "Family & Relationships",
  "Hobbies & Entertainment",
  "Health & Medical",
  "Weather & Seasons",
  "Culture & Traditions",
];

export default function LanguageBuddyPage() {
  const [activeTab, setActiveTab] = React.useState("practice");
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [selectedLevel, setSelectedLevel] = React.useState("");
  const [selectedTopic, setSelectedTopic] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [conversation, setConversation] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [voiceAgent, setVoiceAgent] = React.useState<any>(null);
  const [currentContent, setCurrentContent] = React.useState<any>(null);

  // Initialize AI assistant when language is selected
  React.useEffect(() => {
    if (selectedLanguage) {
      setVoiceAgent({
        id: "openai-assistant",
        name: `${languages.find(l => l.code === selectedLanguage)?.name} AI Assistant`,
        ready: true
      });
    }
  }, [selectedLanguage]);

  const generateContent = async () => {
    if (!selectedLanguage || !selectedLevel || !selectedTopic) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/language/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: languages.find(l => l.code === selectedLanguage)?.name,
          level: selectedLevel,
          topic: selectedTopic,
          userId: "demo-user",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentContent(data.content);
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceConversation = () => {
    setIsRecording(true);
    // Simulate voice conversation with AI
    console.log("Starting AI conversation for language practice");

    // Auto-stop after a few seconds for demo
    setTimeout(() => {
      setIsRecording(false);
    }, 3000);
  };

  const stopVoiceConversation = () => {
    setIsRecording(false);
  };

  const playAudio = (text: string) => {
    setIsPlaying(true);
    // In a real implementation, this would use text-to-speech
    setTimeout(() => setIsPlaying(false), 2000);
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
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Language Buddy</h1>
                <p className="text-muted-foreground">Your AI-powered conversation partner</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mic className="h-4 w-4" />
                <span>Voice Practice</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Real Conversations</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </motion.div>

          {/* Language Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Learning Path</CardTitle>
                <CardDescription>
                  Select your target language, level, and topic to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              {lang.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${level.color}`} />
                              {level.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={generateContent}
                  disabled={!selectedLanguage || !selectedLevel || !selectedTopic || isLoading}
                  className="w-full mt-4"
                >
                  {isLoading ? "Generating Content..." : "Generate Learning Content"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="practice">Voice Practice</TabsTrigger>
              <TabsTrigger value="content">Learning Content</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
            </TabsList>

            {/* Voice Practice Tab */}
            <TabsContent value="practice" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Voice Conversation Practice
                  </CardTitle>
                  <CardDescription>
                    Practice speaking with your AI language partner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {voiceAgent ? (
                    <div className="text-center space-y-4">
                      <div className="p-8 border-2 border-dashed border-muted rounded-lg">
                        <div className="flex flex-col items-center gap-4">
                          <div className={`h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
                          }`}>
                            {isRecording ? (
                              <MicOff className="h-8 w-8 text-white" />
                            ) : (
                              <Mic className="h-8 w-8 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {isRecording ? "Listening..." : "Ready to Practice"}
                            </h3>
                            <p className="text-muted-foreground">
                              {isRecording 
                                ? "Speak naturally, I'm listening!" 
                                : "Click the microphone to start a conversation"
                              }
                            </p>
                          </div>
                          <Button
                            size="lg"
                            onClick={isRecording ? stopVoiceConversation : startVoiceConversation}
                            className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
                          >
                            {isRecording ? (
                              <>
                                <MicOff className="mr-2 h-4 w-4" />
                                Stop Conversation
                              </>
                            ) : (
                              <>
                                <Mic className="mr-2 h-4 w-4" />
                                Start Voice Practice
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Voice Agent Info */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Your Language Partner</h4>
                        <p className="text-sm text-muted-foreground">
                          {voiceAgent.name} is ready to help you practice {
                            languages.find(l => l.code === selectedLanguage)?.name
                          }. 
                          The AI will provide pronunciation feedback, grammar corrections, and cultural insights.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Select a Language to Start</h3>
                      <p className="text-muted-foreground">
                        Choose your target language above to initialize your voice practice partner.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Learning Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {currentContent ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Vocabulary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Vocabulary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentContent.vocabulary?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{item.word}</div>
                              <div className="text-sm text-muted-foreground">{item.translation}</div>
                              {item.pronunciation && (
                                <div className="text-xs text-blue-600">{item.pronunciation}</div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => playAudio(item.word)}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dialogue Practice */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Dialogue Practice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentContent.dialogue?.map((exchange: any, index: number) => (
                          <div key={index} className={`flex ${exchange.speaker === 'A' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              exchange.speaker === 'A' 
                                ? 'bg-muted' 
                                : 'bg-primary text-primary-foreground'
                            }`}>
                              <div className="text-sm font-medium mb-1">
                                Speaker {exchange.speaker}
                              </div>
                              <div>{exchange.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Grammar & Culture */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Grammar & Cultural Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium mb-2">Grammar Tips</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentContent.grammar}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Cultural Context</h4>
                        <p className="text-sm text-muted-foreground">
                          {currentContent.cultural}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Generate Learning Content</h3>
                    <p className="text-muted-foreground">
                      Select your language, level, and topic above, then click "Generate Learning Content" to get started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">24h</p>
                    <p className="text-sm text-muted-foreground">Practice Time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Conversations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">B2</p>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Language Progress</CardTitle>
                  <CardDescription>Your improvement across different skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { skill: "Pronunciation", progress: 78 },
                      { skill: "Grammar", progress: 85 },
                      { skill: "Vocabulary", progress: 92 },
                      { skill: "Listening", progress: 74 },
                      { skill: "Speaking", progress: 68 },
                    ].map((item) => (
                      <div key={item.skill} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.skill}</span>
                          <span className="text-sm text-muted-foreground">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Cultural Insights
                  </CardTitle>
                  <CardDescription>
                    Learn about the culture behind the language
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Cultural Content Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're preparing rich cultural content to enhance your language learning experience.
                    </p>
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
