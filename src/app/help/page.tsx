"use client";

import * as React from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  CreditCard,
  Users,
  Mic,
  Globe,
  Phone,
  ChevronRight,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics of using Explain It",
    articles: 12,
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Features & Tools",
    description: "Explore all our AI-powered features",
    articles: 18,
    color: "from-green-500 to-green-600",
  },
  {
    icon: Settings,
    title: "Account & Settings",
    description: "Manage your account and preferences",
    articles: 8,
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: CreditCard,
    title: "Billing & Plans",
    description: "Subscription and payment information",
    articles: 6,
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Parent Portal",
    description: "Guide for parents and families",
    articles: 10,
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Mic,
    title: "Voice Features",
    description: "Using voice AI and conversation tools",
    articles: 7,
    color: "from-indigo-500 to-indigo-600",
  },
];

const popularArticles = [
  {
    title: "How to get started with Explain It",
    category: "Getting Started",
    readTime: "3 min read",
    views: "15.2k views",
  },
  {
    title: "Using the Exam Whisperer for better explanations",
    category: "Features & Tools",
    readTime: "5 min read",
    views: "12.8k views",
  },
  {
    title: "Setting up voice practice with Language Buddy",
    category: "Voice Features",
    readTime: "4 min read",
    views: "9.1k views",
  },
  {
    title: "Parent Portal: Monitoring your child's progress",
    category: "Parent Portal",
    readTime: "6 min read",
    views: "8.7k views",
  },
  {
    title: "Troubleshooting common issues",
    category: "Account & Settings",
    readTime: "7 min read",
    views: "7.3k views",
  },
];

const faqs = [
  {
    question: "How does the AI tutoring work?",
    answer: "Our AI uses advanced language models to provide personalized explanations. Simply ask a question, and our AI will break down complex concepts into easy-to-understand steps, adapting to your learning level.",
  },
  {
    question: "Can I use Explain It offline?",
    answer: "Some features are available offline with a premium subscription, including downloaded content and practice materials. However, AI explanations and voice features require an internet connection.",
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, we take privacy seriously. All data is encrypted, we don't sell personal information, and you can delete your account and data at any time. We comply with GDPR and other privacy regulations.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your account settings. You'll continue to have access until the end of your billing period, and we don't charge cancellation fees.",
  },
  {
    question: "What languages are supported?",
    answer: "We support over 50 languages for learning, including Spanish, French, German, Italian, Japanese, Korean, Chinese, and many more. New languages are added regularly.",
  },
  {
    question: "Can teachers use Explain It in classrooms?",
    answer: "Yes! We offer special education plans for teachers and schools. Contact our sales team to learn about classroom management features and bulk pricing.",
  },
];

const quickActions = [
  {
    icon: MessageSquare,
    title: "Contact Support",
    description: "Get help from our team",
    action: "Start Chat",
    href: "/contact",
  },
  {
    icon: Phone,
    title: "Schedule a Call",
    description: "Talk to our experts",
    action: "Book Call",
    href: "/contact",
  },
  {
    icon: Globe,
    title: "Community Forum",
    description: "Connect with other users",
    action: "Join Forum",
    href: "#",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                How can we
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}help you?
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Find answers, get support, and learn how to make the most of Explain It.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={action.href}>
                          {action.action}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 pb-16">
          <Tabs defaultValue="browse" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Topics</TabsTrigger>
              <TabsTrigger value="popular">Popular Articles</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* Browse Topics */}
            <TabsContent value="browse" className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                      <CardHeader>
                        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${category.color} mb-4`}>
                          <category.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="flex items-center justify-between">
                          {category.title}
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {category.articles} articles
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Popular Articles */}
            <TabsContent value="popular" className="space-y-6">
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <motion.div
                    key={article.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium group-hover:text-primary transition-colors mb-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Badge variant="outline">{article.category}</Badge>
                              <span>{article.readTime}</span>
                              <span>{article.views}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="space-y-6">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <HelpCircle className="h-5 w-5 text-primary" />
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Still Need Help */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Schedule a Call</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
