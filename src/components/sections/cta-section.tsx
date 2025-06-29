"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SmartGetStartedButton } from "@/components/ui/smart-get-started-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Free 14-day trial",
  "No credit card required",
  "Cancel anytime",
  "24/7 support",
];

const features = [
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get explanations and feedback in real-time",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your data is protected with enterprise-grade security",
  },
  {
    icon: Star,
    title: "Proven Success",
    description: "95% of students improve their grades within 3 months",
  },
];

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] dark:bg-grid-slate-700/25" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-96 w-96 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-4xl">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              Ready to transform your learning?
            </Badge>
            
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Start learning smarter{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                today
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who have already transformed their learning experience with Explain It's AI-powered platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <SmartGetStartedButton size="lg" className="h-14 px-8 text-lg" />
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg" asChild>
                <Link href="/demo">
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3 mb-16"
          >
            {features.map((feature, index) => (
              <Card key={feature.title} className="text-center border-0 bg-background/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>4.9/5 from 10,000+ reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent border border-background" />
                  ))}
                </div>
                <span>Trusted by 50,000+ students</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
