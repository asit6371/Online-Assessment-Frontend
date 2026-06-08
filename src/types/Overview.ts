export interface TopicPerformance {
  topic: string;
  attempted: number;
  accepted: number;
  passRate: number;
}

export interface RecentSession {
  date: string;
  questions: number;
  accepted: number;
  total: number;
}

export interface OverviewResponse {
  totalSessions: number;
  totalQuestionsAttempted: number;
  totalAccepted: number;
  totalSubmitted: number;
  bestStreak: number;
  overallPassRate: number;
  topicPerformance: TopicPerformance[];
  recentSessions: RecentSession[];
}