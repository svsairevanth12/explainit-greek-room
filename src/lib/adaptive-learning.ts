import { SupabaseService } from './supabase';

export interface LearningAnalytics {
  userId: string;
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  performance: number; // 0-100
  timeSpent: number; // in seconds
  attempts: number;
  correctAnswers: number;
  totalQuestions: number;
  learningVelocity: number; // questions per minute
  retentionRate: number; // 0-100
  timestamp: string;
}

export interface LearningPreferences {
  userId: string;
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  studyTimePreference: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionDuration: number; // preferred session length in minutes
  subjects: string[];
  weakAreas: string[];
  strongAreas: string[];
}

export interface AdaptiveRecommendation {
  type: 'difficulty_adjustment' | 'topic_suggestion' | 'study_schedule' | 'content_type';
  subject: string;
  topic?: string;
  recommendedDifficulty?: 'easy' | 'medium' | 'hard';
  reason: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high';
}

export class AdaptiveLearningService {
  // Track learning activity and performance
  static async trackLearningActivity(analytics: Omit<LearningAnalytics, 'timestamp'>) {
    try {
      // Map camelCase to snake_case for database
      const dbRecord = {
        user_id: analytics.userId,
        subject: analytics.subject,
        topic: analytics.topic,
        difficulty: analytics.difficulty,
        performance: analytics.performance,
        time_spent: analytics.timeSpent,
        attempts: analytics.attempts,
        correct_answers: analytics.correctAnswers,
        total_questions: analytics.totalQuestions,
        learning_velocity: analytics.learningVelocity,
        retention_rate: analytics.retentionRate,
      };

      // Store in database
      await SupabaseService.createLearningAnalytics(dbRecord as any);

      // Update user preferences based on performance
      await this.updateLearningPreferences(analytics.userId, {
        ...analytics,
        timestamp: new Date().toISOString(),
      });

      const learningRecord = {
        ...analytics,
        timestamp: new Date().toISOString(),
      };

      return learningRecord;
    } catch (error) {
      console.error('Error tracking learning activity:', error);
      throw error;
    }
  }

  // Analyze user performance and adjust difficulty
  static async getDifficultyRecommendation(userId: string, subject: string, topic: string): Promise<'easy' | 'medium' | 'hard'> {
    try {
      // Get recent performance data
      const recentPerformance = await SupabaseService.getLearningAnalytics(userId, subject, topic, 10);
      
      if (recentPerformance.length === 0) {
        return 'medium'; // Default for new users
      }

      const avgPerformance = recentPerformance.reduce((sum, record) => sum + record.performance, 0) / recentPerformance.length;
      const recentTrend = this.calculatePerformanceTrend(recentPerformance);

      // Adaptive difficulty logic
      if (avgPerformance >= 85 && recentTrend >= 0) {
        return 'hard'; // User is performing well, increase difficulty
      } else if (avgPerformance <= 60 || recentTrend < -10) {
        return 'easy'; // User struggling, decrease difficulty
      } else {
        return 'medium'; // Maintain current difficulty
      }
    } catch (error) {
      console.error('Error getting difficulty recommendation:', error);
      return 'medium';
    }
  }

  // Generate personalized learning recommendations
  static async getPersonalizedRecommendations(userId: string): Promise<AdaptiveRecommendation[]> {
    try {
      const recommendations: AdaptiveRecommendation[] = [];
      
      // Get user's learning data
      const preferences = await SupabaseService.getUserLearningPreferences(userId);
      const recentAnalytics = await SupabaseService.getLearningAnalytics(userId, null, null, 50);
      
      if (!preferences || recentAnalytics.length === 0) {
        return this.getDefaultRecommendations();
      }

      // Analyze weak areas
      const weakAreas = this.identifyWeakAreas(recentAnalytics);
      weakAreas.forEach(area => {
        recommendations.push({
          type: 'topic_suggestion',
          subject: area.subject,
          topic: area.topic,
          reason: `Focus on ${area.topic} - performance below average (${area.avgPerformance}%)`,
          confidence: 85,
          priority: 'high'
        });
      });

      // Difficulty adjustments
      const difficultyAdjustments = await this.analyzeDifficultyAdjustments(userId, recentAnalytics);
      recommendations.push(...difficultyAdjustments);

      // Study schedule optimization
      const scheduleRecommendation = this.getStudyScheduleRecommendation(recentAnalytics, preferences);
      if (scheduleRecommendation) {
        recommendations.push(scheduleRecommendation);
      }

      return recommendations.slice(0, 5); // Return top 5 recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getDefaultRecommendations();
    }
  }

  // Calculate learning velocity (questions per minute)
  static calculateLearningVelocity(timeSpent: number, questionsAnswered: number): number {
    if (timeSpent === 0) return 0;
    return (questionsAnswered / (timeSpent / 60));
  }

  // Calculate retention rate based on repeated topics
  static async calculateRetentionRate(userId: string, subject: string, topic: string): Promise<number> {
    try {
      const historicalData = await SupabaseService.getLearningAnalytics(userId, subject, topic, 20);
      
      if (historicalData.length < 2) return 100; // Assume 100% for new topics
      
      const recentPerformance = historicalData.slice(0, 5).reduce((sum, record) => sum + record.performance, 0) / 5;
      const olderPerformance = historicalData.slice(-5).reduce((sum, record) => sum + record.performance, 0) / 5;
      
      return Math.max(0, Math.min(100, (recentPerformance / olderPerformance) * 100));
    } catch (error) {
      console.error('Error calculating retention rate:', error);
      return 75; // Default retention rate
    }
  }

  // Private helper methods
  private static calculatePerformanceTrend(records: LearningAnalytics[]): number {
    if (records.length < 2) return 0;
    
    const recent = records.slice(0, Math.ceil(records.length / 2));
    const older = records.slice(Math.ceil(records.length / 2));
    
    const recentAvg = recent.reduce((sum, r) => sum + r.performance, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.performance, 0) / older.length;
    
    return recentAvg - olderAvg;
  }

  private static identifyWeakAreas(analytics: LearningAnalytics[]) {
    const subjectTopicMap = new Map<string, { performance: number[], subject: string, topic: string }>();
    
    analytics.forEach(record => {
      const key = `${record.subject}-${record.topic}`;
      if (!subjectTopicMap.has(key)) {
        subjectTopicMap.set(key, { performance: [], subject: record.subject, topic: record.topic });
      }
      subjectTopicMap.get(key)!.performance.push(record.performance);
    });

    const weakAreas: Array<{ subject: string; topic: string; avgPerformance: number }> = [];
    
    subjectTopicMap.forEach((data) => {
      const avgPerformance = data.performance.reduce((sum, p) => sum + p, 0) / data.performance.length;
      if (avgPerformance < 70) { // Below 70% is considered weak
        weakAreas.push({
          subject: data.subject,
          topic: data.topic,
          avgPerformance: Math.round(avgPerformance)
        });
      }
    });

    return weakAreas.sort((a, b) => a.avgPerformance - b.avgPerformance);
  }

  private static async analyzeDifficultyAdjustments(userId: string, analytics: LearningAnalytics[]): Promise<AdaptiveRecommendation[]> {
    const recommendations: AdaptiveRecommendation[] = [];
    const subjectMap = new Map<string, LearningAnalytics[]>();
    
    analytics.forEach(record => {
      if (!subjectMap.has(record.subject)) {
        subjectMap.set(record.subject, []);
      }
      subjectMap.get(record.subject)!.push(record);
    });

    for (const [subject, records] of subjectMap) {
      const avgPerformance = records.reduce((sum, r) => sum + r.performance, 0) / records.length;
      const recommendedDifficulty = await this.getDifficultyRecommendation(userId, subject, '');
      
      recommendations.push({
        type: 'difficulty_adjustment',
        subject,
        recommendedDifficulty,
        reason: `Based on ${avgPerformance.toFixed(1)}% average performance`,
        confidence: 75,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  private static getStudyScheduleRecommendation(analytics: LearningAnalytics[], preferences: LearningPreferences | null): AdaptiveRecommendation | null {
    const avgSessionTime = analytics.reduce((sum, r) => sum + r.timeSpent, 0) / analytics.length / 60; // in minutes
    const optimalSessionTime = preferences?.sessionDuration || 30;
    
    if (avgSessionTime < optimalSessionTime * 0.7) {
      return {
        type: 'study_schedule',
        subject: 'General',
        reason: `Consider longer study sessions. Current average: ${avgSessionTime.toFixed(1)} min, optimal: ${optimalSessionTime} min`,
        confidence: 70,
        priority: 'low'
      };
    }
    
    return null;
  }

  private static getDefaultRecommendations(): AdaptiveRecommendation[] {
    return [
      {
        type: 'topic_suggestion',
        subject: 'Mathematics',
        topic: 'Basic Algebra',
        reason: 'Great starting point for building mathematical foundations',
        confidence: 60,
        priority: 'medium'
      },
      {
        type: 'difficulty_adjustment',
        subject: 'General',
        recommendedDifficulty: 'medium',
        reason: 'Balanced difficulty for new learners',
        confidence: 50,
        priority: 'low'
      }
    ];
  }

  private static async updateLearningPreferences(userId: string, analytics: LearningAnalytics) {
    try {
      const currentPreferences = await SupabaseService.getUserLearningPreferences(userId);
      
      // Update weak/strong areas based on performance
      const isWeak = analytics.performance < 70;
      const isStrong = analytics.performance > 85;
      
      if (currentPreferences) {
        const updatedPreferences = { ...currentPreferences };
        
        if (isWeak && !updatedPreferences.weakAreas.includes(analytics.topic)) {
          updatedPreferences.weakAreas.push(analytics.topic);
        }
        
        if (isStrong && !updatedPreferences.strongAreas.includes(analytics.topic)) {
          updatedPreferences.strongAreas.push(analytics.topic);
          // Remove from weak areas if present
          updatedPreferences.weakAreas = updatedPreferences.weakAreas.filter((area: string) => area !== analytics.topic);
        }
        
        await SupabaseService.updateUserLearningPreferences(userId, updatedPreferences);
      }
    } catch (error) {
      console.error('Error updating learning preferences:', error);
    }
  }
}
