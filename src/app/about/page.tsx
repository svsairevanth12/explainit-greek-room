"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Globe, 
  Users, 
  Zap, 
  Heart, 
  Target, 
  Award,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const values = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "We harness the power of artificial intelligence to provide personalized, adaptive learning experiences that evolve with each student.",
  },
  {
    icon: Heart,
    title: "Student-Centered",
    description: "Every feature we build is designed with students in mind, focusing on making learning more engaging, effective, and enjoyable.",
  },
  {
    icon: Globe,
    title: "Accessible Education",
    description: "We believe quality education should be accessible to everyone, regardless of location, background, or learning style.",
  },
  {
    icon: Zap,
    title: "Innovation First",
    description: "We're constantly pushing the boundaries of educational technology to create breakthrough learning experiences.",
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Exam Whisperer",
    description: "Get instant, detailed explanations for any question. Our AI breaks down complex concepts into easy-to-understand steps.",
    stats: "10M+ explanations generated",
  },
  {
    icon: MessageSquare,
    title: "Language Buddy",
    description: "Practice conversations in multiple languages with AI-powered accent correction and cultural insights.",
    stats: "50+ languages supported",
  },
  {
    icon: Users,
    title: "Parent Portal",
    description: "Voice-activated progress tracking and meeting scheduling to keep families connected to learning.",
    stats: "95% parent satisfaction",
  },
];

const stats = [
  { number: "1M+", label: "Students Learning" },
  { number: "50+", label: "Countries" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "AI Support" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Former Google AI researcher with 10+ years in educational technology.",
    avatar: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-founder",
    bio: "Ex-Microsoft engineer specializing in machine learning and voice AI.",
    avatar: "MR",
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of Education",
    bio: "PhD in Cognitive Science, former Stanford professor with expertise in learning psychology.",
    avatar: "EW",
  },
  {
    name: "David Kim",
    role: "Head of Product",
    bio: "Product leader from Duolingo, passionate about making learning accessible.",
    avatar: "DK",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Revolutionizing Education with
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}AI Technology
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're on a mission to make quality education accessible to everyone through 
              the power of artificial intelligence, voice technology, and personalized learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Join Our Mission</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p>
                Explain It was born from a simple observation: every student learns differently, 
                but traditional education often takes a one-size-fits-all approach. Our founders, 
                coming from backgrounds in AI research and education, saw an opportunity to leverage 
                cutting-edge technology to create truly personalized learning experiences.
              </p>
              <p>
                What started as a small project to help students get better explanations for 
                difficult concepts has evolved into a comprehensive platform that combines AI, 
                voice technology, and educational psychology to create the future of learning.
              </p>
              <p>
                Today, we're proud to serve over a million students worldwide, helping them 
                achieve their academic goals through personalized AI tutoring, interactive 
                practice, and family engagement tools.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Values */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do, from product development to customer support.
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center">
                    <CardHeader>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Makes Us Different</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines multiple AI technologies to create a comprehensive learning ecosystem.
            </p>
          </motion.div>
          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      {feature.stats}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're a diverse team of educators, engineers, and AI researchers united by our passion for transforming education.
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center">
                    <CardHeader>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        {member.avatar}
                      </div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join the Future of Learning</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ready to experience personalized AI-powered education? Start your journey with Explain It today.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
