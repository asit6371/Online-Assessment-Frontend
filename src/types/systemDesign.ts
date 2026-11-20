export type TrackType = "LLD" | "HLD";

export type TopicStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type PhaseStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface SystemDesignTrack {
  id: number;
  trackType: TrackType;
  name: string;
  description: string;
  totalPhases: number;
  totalTopics: number;
  totalProblems: number;
  estimatedWeeks: string;
  completedTopics: number;
  progressPercent: number;
}

export interface SystemDesignPhase {
  id: number;
  phaseNumber: number;
  title: string;
  subtitle: string;
  orderIndex: number;
  totalTopics: number;
  completedTopics: number;
  phaseStatus: PhaseStatus | string;
}

export interface SystemDesignTopicSummary {
  id: number;
  title: string;
  subtitle: string;
  orderIndex: number;
  status: TopicStatus;
}

export interface SystemDesignTopicDetail {
  id: number;
  title: string;
  subtitle: string;
  phaseId: number;
  phaseTitle: string;
  phaseNumber: number;
  trackName: string;
  trackType: TrackType;
  overviewContent?: string;
  theoryContent?: string;
  examplesContent?: string;
  diagramsContent?: string;
  interviewQaContent?: string;
  practiceContent?: string;
  status: TopicStatus;
  lastVisitedAt?: string;
}

export interface SystemDesignTopicTabResponse {
  content: string;
}

export interface UserProgressSummary {
  totalTopicsCompleted: number;
  totalTopics: number;
  totalTimeSpentMinutes: number;
  currentStreak: number;
  lldCompletedTopics: number;
  hldCompletedTopics: number;
  overallProgressPercent: number;
}

export interface RecentlyVisitedTopic {
  topicId: number;
  topicTitle: string;
  phaseTitle: string;
  trackName: string;
  trackType: TrackType;
  status: TopicStatus;
  lastVisitedAt: string;
}

export interface VisitTopicRequest {
  userId: number;
  topicId: number;
}

export interface CompleteTopicRequest {
  userId: number;
  topicId: number;
  durationMinutes?: number;
}
