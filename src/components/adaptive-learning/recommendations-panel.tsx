'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  BookOpen, 
  Lightbulb,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdaptiveRecommendation {
  type: 'difficulty_adjustment' | 'topic_suggestion' | 'study_schedule' | 'content_type';
  subject: string;
  topic?: string;
  recommendedDifficulty?: 'easy' | 'medium' | 'hard';
  reason: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
}

interface LearningInsights {
  totalStudyTime: number;
  averagePerformance: number;
  learningVelocity: number;
  retentionRate: number;
  strongSubjects: string[];
  weakSubjects: string[];
  recommendedStudyTime: number;
}

export function RecommendationsPanel() {
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [insights, setInsights] = useState<LearningInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/adaptive-learning/recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        
        // Mock insights data - in a real app, this would come from the API
        setInsights({
          totalStudyTime: 45,
          averagePerformance: 78,
          learningVelocity: 2.3,
          retentionRate: 85,
          strongSubjects: ['Mathematics', 'Science'],
          weakSubjects: ['English', 'History'],
          recommendedStudyTime: 60,
        });
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'difficulty_adjustment': return <Target className="h-4 w-4" />;
      case 'topic_suggestion': return <BookOpen className="h-4 w-4" />;
      case 'study_schedule': return <Clock className="h-4 w-4" />;
      case 'content_type': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Adaptive Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading personalized recommendations...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Learning Insights */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Insights
              </CardTitle>
              <CardDescription>
                Your personalized learning analytics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{insights.averagePerformance}%</div>
                  <div className="text-sm text-muted-foreground">Avg Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{insights.retentionRate}%</div>
                  <div className="text-sm text-muted-foreground">Retention Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{insights.learningVelocity}</div>
                  <div className="text-sm text-muted-foreground">Q/min Velocity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{insights.totalStudyTime}h</div>
                  <div className="text-sm text-muted-foreground">Study Time</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Study Time Progress</span>
                  <span>{insights.totalStudyTime}h / {insights.recommendedStudyTime}h</span>
                </div>
                <Progress value={(insights.totalStudyTime / insights.recommendedStudyTime) * 100} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Strong Areas
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {insights.strongSubjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-orange-600 mb-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Focus Areas
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {insights.weakSubjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered suggestions to optimize your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Keep studying to get personalized recommendations!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getTypeIcon(recommendation.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{recommendation.subject}</h4>
                            {recommendation.topic && (
                              <Badge variant="outline" className="text-xs">
                                {recommendation.topic}
                              </Badge>
                            )}
                            <Badge variant={getPriorityColor(recommendation.priority)} className="text-xs">
                              {recommendation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {recommendation.reason}
                          </p>
                          {recommendation.recommendedDifficulty && (
                            <div className="flex items-center gap-2 text-xs">
                              <span>Recommended difficulty:</span>
                              <Badge variant="secondary">
                                {recommendation.recommendedDifficulty}
                              </Badge>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>Confidence: {recommendation.confidence}%</span>
                            <Progress value={recommendation.confidence} className="w-16 h-1" />
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
