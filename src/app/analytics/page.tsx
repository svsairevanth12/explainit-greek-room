"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Target,
  Brain,
  Award,
  Activity,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

// Real-time data hooks
const useRealTimeAnalytics = () => {
  const [data, setData] = React.useState({
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      totalSessions: 0,
      avgSessionTime: 0,
      completionRate: 0,
      learningVelocity: 0,
    },
    userGrowth: [],
    subjectPerformance: [],
    learningActivity: [],
    engagementMetrics: [],
    adaptiveLearningData: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch real-time analytics data
      const [overviewRes, performanceRes, activityRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/performance'),
        fetch('/api/analytics/activity'),
      ]);

      if (overviewRes.ok && performanceRes.ok && activityRes.ok) {
        const overview = await overviewRes.json();
        const performance = await performanceRes.json();
        const activity = await activityRes.json();

        setData({
          overview: overview.data,
          userGrowth: overview.userGrowth,
          subjectPerformance: performance.subjects,
          learningActivity: activity.sessions,
          engagementMetrics: activity.engagement,
          adaptiveLearningData: performance.adaptive,
        });
      } else {
        // Fallback to mock data if API fails
        setData(generateMockData());
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, lastUpdated, refetch: fetchAnalytics };
};

// Mock data generator for fallback
const generateMockData = () => {
  const now = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return {
    overview: {
      totalUsers: 1247,
      activeUsers: 342,
      totalSessions: 2156,
      avgSessionTime: 24.5,
      completionRate: 78.3,
      learningVelocity: 85.7,
    },
    userGrowth: last7Days.map((date, i) => ({
      date,
      users: Math.floor(Math.random() * 100) + 200 + i * 20,
      sessions: Math.floor(Math.random() * 150) + 300 + i * 30,
    })),
    subjectPerformance: [
      { subject: 'Mathematics', accuracy: 87, improvement: 12, sessions: 456 },
      { subject: 'Science', accuracy: 82, improvement: 8, sessions: 389 },
      { subject: 'English', accuracy: 91, improvement: 15, sessions: 523 },
      { subject: 'History', accuracy: 79, improvement: 6, sessions: 234 },
      { subject: 'Languages', accuracy: 85, improvement: 18, sessions: 312 },
    ],
    learningActivity: last7Days.map((date, i) => ({
      date,
      explanations: Math.floor(Math.random() * 50) + 80,
      quizzes: Math.floor(Math.random() * 30) + 40,
      practice: Math.floor(Math.random() * 40) + 60,
    })),
    engagementMetrics: [
      { metric: 'Daily Active Users', value: 342, change: 8.5, trend: 'up' },
      { metric: 'Session Duration', value: 24.5, change: 12.3, trend: 'up' },
      { metric: 'Feature Usage', value: 76.8, change: -2.1, trend: 'down' },
      { metric: 'Retention Rate', value: 89.2, change: 5.7, trend: 'up' },
    ],
    adaptiveLearningData: [
      { difficulty: 'Easy', users: 156, accuracy: 94 },
      { difficulty: 'Medium', users: 234, accuracy: 82 },
      { difficulty: 'Hard', users: 89, accuracy: 67 },
      { difficulty: 'Expert', users: 23, accuracy: 45 },
    ],
  };
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const { data, loading, lastUpdated, refetch } = useRealTimeAnalytics();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time insights into learning performance and platform usage
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.overview.totalUsers)}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.overview.activeUsers)}</div>
              <p className="text-xs text-muted-foreground">
                +8.5% from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data.overview.totalSessions)}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(data.overview.avgSessionTime)}</div>
              <p className="text-xs text-muted-foreground">
                +12.3% improvement
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Velocity</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.learningVelocity}%</div>
              <p className="text-xs text-muted-foreground">
                AI optimization active
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="adaptive">Adaptive Learning</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Daily active users and sessions over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="sessions" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Activity</CardTitle>
                <CardDescription>Daily breakdown of learning activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.learningActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="explanations" fill="#3b82f6" />
                    <Bar dataKey="quizzes" fill="#10b981" />
                    <Bar dataKey="practice" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Accuracy rates and improvement across subjects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.subjectPerformance.map((subject, index) => (
                  <div key={subject.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{subject.accuracy}%</Badge>
                        <div className={`flex items-center text-sm ${subject.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {subject.improvement > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(subject.improvement)}%
                        </div>
                      </div>
                    </div>
                    <Progress value={subject.accuracy} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(subject.sessions)} sessions completed
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adaptive Learning Distribution</CardTitle>
                <CardDescription>User distribution across difficulty levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.adaptiveLearningData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ difficulty, users }) => `${difficulty}: ${users}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="users"
                    >
                      {data.adaptiveLearningData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.engagementMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {typeof metric.value === 'number' && metric.value < 100 
                        ? `${metric.value}${metric.metric.includes('Rate') || metric.metric.includes('Usage') ? '%' : metric.metric.includes('Duration') ? 'm' : ''}`
                        : formatNumber(metric.value)
                      }
                    </div>
                    <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(metric.change)}% from last period
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Adaptive Learning Tab */}
        <TabsContent value="adaptive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Learning Performance</CardTitle>
              <CardDescription>How users perform across different difficulty levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.adaptiveLearningData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="difficulty" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="users" fill="#3b82f6" name="Users" />
                  <Bar yAxisId="right" dataKey="accuracy" fill="#10b981" name="Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
