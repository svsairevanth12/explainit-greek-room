import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (has elevated permissions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types for TypeScript
export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  role: 'STUDENT' | 'PARENT' | 'TEACHER'
  grade?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface ExamSession {
  id: string
  user_id: string
  subject: string
  topic?: string
  question: string
  answer?: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  is_correct?: boolean
  time_spent?: number
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  subject: string
  description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  time_limit?: number
  questions: any // JSON field
  created_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  answers: any // JSON field
  score: number
  time_spent?: number
  created_at: string
}

export interface LanguageSession {
  id: string
  user_id: string
  language: string
  conversation_type: string
  topic?: string
  transcript?: any // JSON field
  feedback?: any // JSON field
  pronunciation_score?: number
  grammar_score?: number
  vocabulary_score?: number
  duration?: number
  created_at: string
}

export interface LearningAnalytics {
  id: string
  user_id: string
  subject: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  performance: number
  time_spent: number
  attempts: number
  correct_answers: number
  total_questions: number
  learning_velocity: number
  retention_rate: number
  created_at: string
}

export interface LearningPreferences {
  id: string
  user_id: string
  preferred_difficulty: 'easy' | 'medium' | 'hard'
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  study_time_preference: 'morning' | 'afternoon' | 'evening' | 'night'
  session_duration: number
  subjects: any // JSON field
  weak_areas: any // JSON field
  strong_areas: any // JSON field
  created_at: string
  updated_at: string
}

export interface ProgressRecord {
  id: string
  user_id: string
  subject?: string
  topic?: string
  skill_type: string
  score: number
  max_score: number
  progress: number
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme?: string
  language?: string
  notifications_enabled: boolean
  voice_enabled: boolean
  created_at: string
  updated_at: string
}

// Helper functions for common database operations
export class SupabaseService {
  // User operations
  static async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([{
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async getUserById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Exam session operations
  static async createExamSession(sessionData: Omit<ExamSession, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('exam_sessions')
      .insert([{
        ...sessionData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getExamSessions(userId: string, limit = 10) {
    const { data, error } = await supabaseAdmin
      .from('exam_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Quiz operations
  static async createQuiz(quizData: Omit<Quiz, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .insert([{
        ...quizData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async createQuizAttempt(attemptData: Omit<QuizAttempt, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('quiz_attempts')
      .insert([{
        ...attemptData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getQuizAttempts(userId: string, limit = 10) {
    const { data, error } = await supabaseAdmin
      .from('quiz_attempts')
      .select(`
        *,
        quiz:quizzes(title, subject)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Language session operations
  static async createLanguageSession(sessionData: Omit<LanguageSession, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('language_sessions')
      .insert([{
        ...sessionData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getLanguageSessions(userId: string, limit = 10) {
    const { data, error } = await supabaseAdmin
      .from('language_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Progress tracking
  static async createProgressRecord(progressData: Omit<ProgressRecord, 'id' | 'created_at'>) {
    const { data, error } = await supabaseAdmin
      .from('progress_records')
      .insert([{
        ...progressData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getProgressRecords(userId: string, limit = 10) {
    const { data, error } = await supabaseAdmin
      .from('progress_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // User settings
  static async getUserSettings(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async createUserSettings(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('user_settings')
      .insert([{
        user_id: userId,
        notifications_enabled: true,
        voice_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get subject performance data
  static async getSubjectPerformance(userId: string) {
    try {
      // Get all exam sessions for the user
      const { data: examSessions, error: examError } = await supabaseAdmin
        .from('exam_sessions')
        .select('subject, is_correct, difficulty, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (examError) throw examError;

      // Get all quiz attempts for the user
      const { data: quizAttempts, error: quizError } = await supabaseAdmin
        .from('quiz_attempts')
        .select(`
          score,
          created_at,
          quiz:quizzes(subject)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (quizError) throw quizError;

      // Calculate performance by subject
      const subjectStats: { [key: string]: { total: number; correct: number; scores: number[] } } = {};

      // Process exam sessions
      examSessions?.forEach(session => {
        if (!session.subject) return;

        if (!subjectStats[session.subject]) {
          subjectStats[session.subject] = { total: 0, correct: 0, scores: [] };
        }

        subjectStats[session.subject].total++;
        if (session.is_correct) {
          subjectStats[session.subject].correct++;
          // Weight scores based on difficulty
          let score = 100;
          if (session.difficulty === 'easy') score = 80;
          else if (session.difficulty === 'medium') score = 90;
          else if (session.difficulty === 'hard') score = 100;

          subjectStats[session.subject].scores.push(score);
        } else {
          // Add lower score for incorrect answers
          let score = 40;
          if (session.difficulty === 'easy') score = 50;
          else if (session.difficulty === 'medium') score = 45;
          else if (session.difficulty === 'hard') score = 40;

          subjectStats[session.subject].scores.push(score);
        }
      });

      // Process quiz attempts
      quizAttempts?.forEach(attempt => {
        const subject = attempt.quiz?.subject;
        if (!subject) return;

        if (!subjectStats[subject]) {
          subjectStats[subject] = { total: 0, correct: 0, scores: [] };
        }

        subjectStats[subject].scores.push(attempt.score);
      });

      // Calculate final performance percentages
      const subjectPerformance = Object.entries(subjectStats).map(([subject, stats]) => {
        const averageScore = stats.scores.length > 0
          ? Math.round(stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length)
          : 0;

        return {
          subject,
          performance: Math.min(100, Math.max(0, averageScore)),
          totalActivities: stats.total + stats.scores.length,
          trend: this.calculateTrend(stats.scores)
        };
      });

      // Sort by performance descending
      return subjectPerformance.sort((a, b) => b.performance - a.performance);
    } catch (error) {
      console.error('Error getting subject performance:', error);
      return [];
    }
  }

  // Calculate trend based on recent scores
  private static calculateTrend(scores: number[]): 'up' | 'down' | 'stable' {
    if (scores.length < 2) return 'stable';

    const recent = scores.slice(-3); // Last 3 scores
    const older = scores.slice(-6, -3); // Previous 3 scores

    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 5) return 'up';
    if (difference < -5) return 'down';
    return 'stable';
  }

  // Dashboard data aggregation
  static async getDashboardData(userId: string) {
    try {
      // Get user info
      const user = await this.getUserById(userId)
      
      // Get recent activities
      const [examSessions, quizAttempts, languageSessions, progressRecords] = await Promise.all([
        this.getExamSessions(userId, 5),
        this.getQuizAttempts(userId, 5),
        this.getLanguageSessions(userId, 5),
        this.getProgressRecords(userId, 10)
      ])

      // Calculate stats
      const totalStudyTime = examSessions.reduce((total, session) => {
        return total + (session.time_spent || 0)
      }, 0) / 3600 // Convert to hours

      const completedQuizzes = quizAttempts.length
      const averageScore = quizAttempts.length > 0 
        ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length
        : 0

      // Format recent activities
      const recentActivities = [
        ...examSessions.map(session => ({
          id: session.id,
          type: "exam",
          subject: session.subject,
          topic: session.topic || "Study Session",
          score: session.is_correct ? 100 : 75,
          date: session.created_at,
        })),
        ...languageSessions.map(session => ({
          id: session.id,
          type: "language",
          language: session.language,
          topic: session.topic,
          score: Math.round((session.pronunciation_score || 0 + session.grammar_score || 0 + session.vocabulary_score || 0) / 3),
          date: session.created_at,
        })),
        ...quizAttempts.map(attempt => ({
          id: attempt.id,
          type: "quiz",
          subject: attempt.quiz?.subject || "Quiz",
          topic: attempt.quiz?.title || "Practice Quiz",
          score: attempt.score,
          date: attempt.created_at,
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

      // Create upcoming goals (mock data for now)
      const upcomingGoals = [
        {
          id: 1,
          title: "Complete Mathematics Practice",
          progress: Math.min(95, Math.round(averageScore + Math.random() * 10)),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          title: "Language Learning Session",
          progress: Math.min(90, Math.round(averageScore - 10 + Math.random() * 20)),
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]

      return {
        ...user,
        totalStudyTime: Math.round(totalStudyTime * 10) / 10,
        completedQuizzes,
        averageScore: Math.round(averageScore),
        currentStreak: Math.floor(Math.random() * 10) + 1,
        recentActivities,
        upcomingGoals,
      }
    } catch (error) {
      console.error('Error getting dashboard data:', error)
      throw error
    }
  }

  // Adaptive Learning Methods
  static async createLearningAnalytics(analytics: Omit<LearningAnalytics, 'id'>) {
    const { data, error } = await supabaseAdmin
      .from('learning_analytics')
      .insert([analytics])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getLearningAnalytics(userId: string, subject?: string | null, topic?: string | null, limit: number = 20) {
    let query = supabaseAdmin
      .from('learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (subject) {
      query = query.eq('subject', subject)
    }

    if (topic) {
      query = query.eq('topic', topic)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  static async createUserLearningPreferences(preferences: Omit<LearningPreferences, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('learning_preferences')
      .insert([{
        ...preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserLearningPreferences(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('learning_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  static async updateUserLearningPreferences(userId: string, preferences: Partial<LearningPreferences>) {
    const { data, error } = await supabaseAdmin
      .from('learning_preferences')
      .update({
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics methods for dashboard
  static async getAnalyticsData(type: 'users' | 'sessions' | 'performance' | 'learning_analytics') {
    try {
      switch (type) {
        case 'users':
          const { data: users, error: usersError } = await supabaseAdmin
            .from('users')
            .select('id, created_at, last_active')
            .order('created_at', { ascending: false });

          if (usersError) throw usersError;
          return users;

        case 'sessions':
          const { data: sessions, error: sessionsError } = await supabaseAdmin
            .from('learning_analytics')
            .select('user_id, created_at, time_spent')
            .not('time_spent', 'is', null)
            .order('created_at', { ascending: false });

          if (sessionsError) throw sessionsError;
          return sessions;

        case 'performance':
          const { data: performance, error: performanceError } = await supabaseAdmin
            .from('learning_analytics')
            .select('*')
            .order('created_at', { ascending: false });

          if (performanceError) throw performanceError;
          return performance;

        case 'learning_analytics':
          const { data: analytics, error: analyticsError } = await supabaseAdmin
            .from('learning_analytics')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1000); // Limit for performance

          if (analyticsError) throw analyticsError;
          return analytics;

        default:
          return null;
      }
    } catch (error) {
      console.error(`Error fetching ${type} analytics:`, error);
      return null;
    }
  }
}
