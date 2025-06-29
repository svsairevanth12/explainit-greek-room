"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Globe,
  Phone,
  Brain,
  MessageSquare,
  BarChart3,
  Mic,
  Target,
  Clock,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const mainFeatures = [
  {
    icon: BookOpen,
    title: "Exam Whisperer",
    description: "Your AI study companion that answers questions instantly and creates personalized quizzes to track your mastery.",
    features: [
      "Instant explanations for any topic",
      "Interactive quiz generation",
      "Progress tracking & analytics",
      "Adaptive learning paths",
    ],
    badge: "AI-Powered",
    color: "from-blue-500 to-blue-600",
    href: "/exam-whisperer",
  },
  {
    icon: Globe,
    title: "Language Buddy",
    description: "Practice conversations with AI that provides accent correction, cultural insights, and personalized learning.",
    features: [
      "Real-time conversation practice",
      "Accent correction & feedback",
      "Cultural context & tips",
      "Personalized learning goals",
    ],
    badge: "Voice AI",
    color: "from-green-500 to-green-600",
    href: "/language-buddy",
  },
  {
    icon: Phone,
    title: "Parent Portal Voice",
    description: "Voice-activated dashboard for parents to get progress summaries and schedule meetings effortlessly.",
    features: [
      "Voice-controlled interface",
      "Progress summaries",
      "Meeting scheduling",
      "Real-time notifications",
    ],
    badge: "Voice Control",
    color: "from-purple-500 to-purple-600",
    href: "/parent-portal",
  },
];

const additionalFeatures = [
  {
    icon: Brain,
    title: "Adaptive Learning",
    description: "AI adjusts to your learning style and pace for optimal results.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Detailed insights into your learning journey and achievements.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your data is protected with enterprise-grade security.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get instant responses and real-time feedback.",
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with peers and learn together.",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "Learn anytime, anywhere with our always-on AI tutors.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                excel in learning
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Our comprehensive suite of AI-powered tools adapts to your learning style and helps you achieve your educational goals faster.
            </p>
          </div>

          {/* Main Features */}
          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color}`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary">{feature.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" asChild>
                      <Link href={feature.href}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <div className="mt-20">
            <h3 className="text-center text-2xl font-bold mb-12">
              Plus many more powerful features
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-md border-0 bg-muted/30">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="mb-2 font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
