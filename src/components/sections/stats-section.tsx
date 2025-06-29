"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  TrendingUp,
  Globe,
  Clock,
  Award,
  MessageSquare,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Users,
    value: "50,000+",
    label: "Active Learners",
    description: "Students worldwide trust Explain It",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: BookOpen,
    value: "1M+",
    label: "Questions Answered",
    description: "AI-powered explanations delivered",
    color: "from-green-500 to-green-600",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    description: "Students improve their grades",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Globe,
    value: "50+",
    label: "Languages Supported",
    description: "Learn in your native language",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Always Available",
    description: "Learn anytime, anywhere",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "User Rating",
    description: "Highly rated by students",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: MessageSquare,
    value: "500K+",
    label: "Conversations",
    description: "Language practice sessions",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Target,
    value: "85%",
    label: "Goal Achievement",
    description: "Students reach their targets",
    color: "from-indigo-500 to-indigo-600",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Trusted by learners{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Join thousands of students who have transformed their learning experience with Explain It.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 bg-background/60 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {stat.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">
                Why students choose Explain It
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI-powered platform adapts to each student's unique learning style, providing personalized explanations, 
                interactive quizzes, and real-time feedback. Whether you're preparing for exams, learning a new language, 
                or helping your child succeed, Explain It makes learning engaging, effective, and accessible.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
