"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  Phone,
  PhoneOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceChatWidgetProps {
  agentId?: string;
  title?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme?: "light" | "dark";
  autoOpen?: boolean;
}

export function VoiceChatWidget({
  agentId,
  title = "Explain It Assistant",
  position = "bottom-right",
  theme = "light",
  autoOpen = false,
}: VoiceChatWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(autoOpen);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [conversation, setConversation] = React.useState<any[]>([]);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      default:
        return "bottom-4 right-4";
    }
  };

  const connectToAgent = async () => {
    setConnectionStatus("connecting");

    try {
      // Connect to OpenAI-powered chat assistant
      console.log("Connecting to AI assistant...");

      // Simulate connection
      setTimeout(() => {
        setConnectionStatus("connected");
        setIsConnected(true);

        // Add welcome message
        setConversation([{
          id: Date.now(),
          type: "agent",
          content: "Hello! I'm your Explain It AI assistant. I can help you with explanations, quizzes, and learning questions. What would you like to know?",
          timestamp: new Date(),
        }]);
      }, 1000);
    } catch (error) {
      console.error("Failed to connect to AI assistant:", error);
      setConnectionStatus("disconnected");
    }
  };

  const disconnectFromAgent = () => {
    setConnectionStatus("disconnected");
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setConversation([]);
  };

  const startListening = async () => {
    if (!isConnected) return;

    setIsListening(true);
    console.log("Processing your question...");

    // Simulate user input and get AI response
    setTimeout(async () => {
      setIsListening(false);
      setIsSpeaking(true);

      // Add user message
      const userMessage = "Can you help me with my math homework?";
      setConversation(prev => [...prev, {
        id: Date.now(),
        type: "user",
        content: userMessage,
        timestamp: new Date(),
      }]);

      try {
        // Get AI response using OpenAI
        const response = await fetch("/api/ai/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: userMessage,
            subject: "General",
            difficulty: "medium",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setConversation(prev => [...prev, {
            id: Date.now(),
            type: "agent",
            content: data.explanation,
            timestamp: new Date(),
          }]);
        } else {
          throw new Error("Failed to get AI response");
        }
      } catch (error) {
        console.error("Error getting AI response:", error);
        setConversation(prev => [...prev, {
          id: Date.now(),
          type: "agent",
          content: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
          timestamp: new Date(),
        }]);
      } finally {
        setIsSpeaking(false);
      }
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className={`w-80 ${isMinimized ? "h-16" : "h-96"} shadow-xl border-0 bg-background/95 backdrop-blur-sm transition-all duration-300`}>
            <CardHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{title}</CardTitle>
                    <div className="flex items-center gap-1">
                      <div className={`h-2 w-2 rounded-full ${
                        connectionStatus === "connected" ? "bg-green-500" : 
                        connectionStatus === "connecting" ? "bg-yellow-500 animate-pulse" : 
                        "bg-gray-400"
                      }`} />
                      <span className="text-xs text-muted-foreground">
                        {connectionStatus === "connected" ? "Connected" : 
                         connectionStatus === "connecting" ? "Connecting..." : 
                         "Disconnected"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-80">
                {/* Connection Controls */}
                <div className="p-4 border-b bg-muted/30">
                  {!isConnected ? (
                    <Button
                      onClick={connectToAgent}
                      disabled={connectionStatus === "connecting" || !agentId}
                      className="w-full"
                      size="sm"
                    >
                      {connectionStatus === "connecting" ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Phone className="mr-2 h-4 w-4" />
                          Connect to Voice Assistant
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={isListening ? stopListening : startListening}
                        disabled={isSpeaking}
                        className={`flex-1 ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
                        size="sm"
                      >
                        {isListening ? (
                          <>
                            <MicOff className="mr-2 h-4 w-4" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Talk
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={disconnectFromAgent}
                        variant="outline"
                        size="sm"
                      >
                        <PhoneOff className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Conversation Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {conversation.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm">
                      {isConnected ? (
                        <>
                          <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Click "Talk" to start a voice conversation</p>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Connect to start chatting with your AI assistant</p>
                        </>
                      )}
                    </div>
                  ) : (
                    conversation.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-2 rounded-lg text-sm ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Status Indicators */}
                  {isListening && (
                    <div className="flex justify-center">
                      <Badge variant="secondary" className="animate-pulse">
                        <Mic className="mr-1 h-3 w-3" />
                        Listening...
                      </Badge>
                    </div>
                  )}
                  
                  {isSpeaking && (
                    <div className="flex justify-center">
                      <Badge variant="secondary" className="animate-pulse">
                        <Volume2 className="mr-1 h-3 w-3" />
                        Speaking...
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-2 border-t bg-muted/30">
                  <p className="text-xs text-muted-foreground text-center">
                    Powered by OpenAI
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
