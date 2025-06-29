"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SmartGetStartedButton } from "@/components/ui/smart-get-started-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Globe,
  Phone,
  Sparkles,
  Play,
  Star,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BookOpen,
    title: "Exam Whisperer",
    description: "AI-powered study companion",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Globe,
    title: "Language Buddy",
    description: "Conversational practice with AI",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Phone,
    title: "Parent Portal",
    description: "Voice-controlled progress tracking",
    color: "from-purple-500 to-purple-600",
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Learners" },
  { icon: BookOpen, value: "1M+", label: "Questions Answered" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
        <div className="h-96 w-96 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
        <div className="h-96 w-96 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Hero Content */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                AI-Powered Learning Platform
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Explain It
                </span>
                <br />
                <span className="text-3xl sm:text-5xl lg:text-6xl">
                  Your Personal Learning Companion
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Master any subject with AI-powered explanations, interactive quizzes, and personalized learning paths. 
                From exam prep to language learning, we've got you covered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <SmartGetStartedButton />
              <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/demo">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2">4.9/5 from 10K+ reviews</span>
              </div>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <Card key={feature.title} className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-20 grid gap-8 sm:grid-cols-3"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
